import type { LastUpdate, Profile, weatherCloudId, WeatherData } from "./types/weatherCloud";

export default async function fetchWeather(id:weatherCloudId) : Promise<Object> {
    try {
        if (!id || /^\d{10}$/.test(id)) throw new Error("invalid ID")
        const fullReport = {
            weather: {},
            update: {},
            profile: {},
        };

        /* --------------------------- request basic data --------------------------- */
        const data = await fetchData(`https://app.weathercloud.net/device/values?code=${id}`, "");
        const lastUpdate = await fetchData(`https://app.weathercloud.net/device/ajaxupdatedate`, `d=${id}`);
        const profile = await fetchData(`https://app.weathercloud.net/device/ajaxprofile`, `d=${id}`);
        // history (WIP)
        // const statistic = await fetchData(`https://app.weathercloud.net/device/stats`, `code=${id}`);
        // const windHistory = await fetchData(`https://app.weathercloud.net/device/wind`, `code=${id}`);

        /* --------------------------- check data presence -------------------------- */
        if (!("temp" in data) ||
            !("update" in lastUpdate) ||
            !("observer" in profile)
        ) throw new Error("Failed to fetch");

        /* ------------------------------ parse weather ----------------------------- */
        // calculate clouds height
        const cloudsHeight = (data.temp > -40 && data.dew > -40) ? Math.max(0, 124.69*(data.temp - data.dew)) : -1;

        // check data validity
        if (data.bar < 0 ||
            data.rainrate < 0 ||
            cloudsHeight < 0 ||
            data.hum < 0 ||
            data.hum > 100
        ) throw new Error("Invalid data");

        // guess current conditions based on data
        let weatherAvg = "clear";
        if (data.rainrate == 0) {
            const barTH = [1005,1010,1015];
            const fogTH = 150;
            if (data.bar < barTH[0]) weatherAvg = "cloud";
            else if (data.bar < barTH[1]) weatherAvg = "change";
            else if (data.bar < barTH[2]) weatherAvg = "few";
            
            if (cloudsHeight < fogTH) weatherAvg += "-fog";
        } else {
            const rainrateTH = [2,15];
            if (data.rainrate < rainrateTH[0]) weatherAvg = "light";
            else if (data.rainrate < rainrateTH[1]) weatherAvg = "moderate";
            else weatherAvg = "heavy";
        }

        // get feel (maybe just like chill and heat but used in weather cloud code so here it is)
        let feel = data.temp;
        if (data.temp < 10) feel = chillFn(data.temp, data.wspd);
        else if (data.temp > 26) feel = heatFn(data.temp, data.hum);
        // save the added data
        const { epoch, ...dataToSave } = data;
        fullReport.weather = {
            ...dataToSave,
            cloudsHeight,
            weatherAvg,
            feel
        };

        /* ---------------------------- parse update time --------------------------- */
	    const time = new Date(epoch*1000);
        fullReport.update = {
            ...lastUpdate,
            time: `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`,
            lastUpdateMinutes: Math.round(lastUpdate.update/60),
            updateTime: epoch
        };

        /* ------------------------------ parse profile ----------------------------- */
        fullReport.profile = profile; // nothing to add

        return fullReport;
    } catch (err) {
        return { error: err }
    }
}

async function fetchData(url:string, data:string):Promise<LastUpdate | WeatherData | Profile | object> {
    const resp = await fetch(url, {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: data
    });
    try {
        return await resp.json();
    } catch (err) {
        return { error: true, err }
    }
}

const chillFn = (temp:number, wspd:number) => { // mostly untouched from weathercloud
	if (wspd < 1.3 || temp > 21) return temp;
	
	let windPow = Math.pow(wspd*3.6, 0.16);
	let _chill = 13.12 + 0.6215 * temp-11.37 * windPow + 0.3965 * temp * windPow;
	
	return Math.min(temp, _chill);
}

const heatFn = (temp:number, hum:number) => { // mostly untouched from weathercloud
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