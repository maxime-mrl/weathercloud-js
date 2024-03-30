import { login } from ".";
import type { LastUpdate, Profile, Statistic, WeatherData, Device, Uptime, DevicesList, OwnDevices, windStatistics } from "./types/weatherCloud";

type apiReturn = LastUpdate | WeatherData | Profile | Uptime[] | Statistic | DevicesList | OwnDevices | windStatistics;

const session = {
	cookie: "", // actual cookie
	expireDate: 0, // expiry date
	credentials: { // used to re-autentificate the session if needed -- this can be consider as insecure to you, you can choose not to store them with loggin(mail, pass, false) (default false)
		mail: "",
		password: ""
	}
};

export async function fetchData(url:string, data:string=""):Promise<apiReturn | { error: boolean, err: any }> { // fetch data from API
    try {
		const resp = await fetch(url, {
			method: "post",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				"X-Requested-With": "XMLHttpRequest",
				"cookie": await getCookie()
			},
			body: data
		});
        return await resp.json();
    } catch (err) {
        return { error: true, err }
    }
}

export function setCookies(cookiesArray:string[], mail:string, password:string) { // parse and set the session cookie
    const expire = cookiesArray.find(cookie => /expires/.test(cookie))?.split("=")[1]; // get the expire date in cookies
    if (!expire) return false; // if no expires date then it's not a valid cookie
	// set the session
    session.cookie = cookiesArray.join("; ");
	session.expireDate = (new Date(expire)).getTime();
	session.credentials = { mail, password };
    return true;
}

export async function getCookie() { // check cookie validity and return it
	// check if session is expired
	if (session.cookie && session.expireDate <= Date.now()) {
		// try to login back
		if (session.credentials.mail.length <= 1 || !await login(session.credentials.mail, session.credentials.password, true)) {
			// if can't login back reset cookie
			session.cookie = "";
			session.expireDate = 0;
			session.credentials = {
				mail: "",
				password: ""
			};
		}
	}
	return session.cookie;
}

export function parseDevicesList(devices:Device[], dataName?:string) { // correct a few deffect of devicelist
	return devices.map((device:Device) => {
		const { data, values, ...deviceInfos } = device;
		// Convert string values to numbers
		const numberValues = Object.fromEntries( // parse values to int and divide them so it's just like normal WeatherData because weathercloud is terribly inconsistent
			Object.entries(values).map(([key, value]) => {
				if (typeof value === "string") {
					if (/epoch|hum|wdir/.test(key)) return [key, +value]
					return [key, (+value)/10] // devide by ten the value so it's the right decimal
				};
				return [key, value];
			})
		);
		if (dataName && data) return {
			...deviceInfos,
			values: numberValues,
			[dataName]: +data, // get a value that make sense
		};
		return {
			...deviceInfos,
			values: numberValues,
		};
	});
}

export const chillFn = (temp:number, wspd:number) => { // mostly untouched from weathercloud
	if (wspd < 1.3 || temp > 21) return temp;
	
	let windPow = Math.pow(wspd*3.6, 0.16);
	let _chill = 13.12 + 0.6215 * temp-11.37 * windPow + 0.3965 * temp * windPow;
	
	return Math.min(temp, _chill);
}

export const heatFn = (temp:number, hum:number) => { // mostly untouched from weathercloud
	if(temp <= 4.44) return temp;

	// 1. Steadman ( Celsius ) This formula include the average with the temperature
	let heat = -3.94 + 1.1*temp + 0.026*hum;

	// 2. HI > 80ºF (26.7ºC) -> The regression equation of Rothfusz ( Celsius )
	if (heat > 26.5){
		heat = -8.784694755 + 1.61139411*temp + 2.338548838*hum - 0.1461160501*hum*temp - 0.012308094*temp*temp - 0.01642482777*hum*hum 
		+ 0.002211732*hum*temp*temp + 0.00072546*hum*hum*temp - 0.000003582*hum*hum*temp*temp;
	}

	// 3. Adjustments. 
	if (hum < 13 && temp > 26.5 && temp < 44.5) {
		heat -= ((13-hum)/4) * (Math.sqrt(1-0.059*Math.abs(1.8*temp-63)));
	} else if (hum > 85 && temp > 26.5 && temp < 30.5) {
		heat += ((hum-85)/10) * (11-0.36*temp);
	}

	return Math.max(temp, heat);
}
