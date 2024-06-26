import type { weatherCloudId, countryCode, periodStr, regularID, deviceMapElement, Device } from "./weathercloud";
import { chillFn, heatFn, fetchData, setCookies, parseDevicesList, getCookie, checkId } from "./utils.js";

export async function login(mail:string, password: string, storeCredentials?: boolean) { // log in and retrieve the session cookie
    const formData = new URLSearchParams();
    formData.append('LoginForm[entity]', mail);
    formData.append('LoginForm[password]', password);
    formData.append('LoginForm[rememberMe]', '1');
    const resp = await fetch("https://app.weathercloud.net/signin", {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
        redirect: "manual"
    });
    if (resp.status !== 302) return false;
    // define what we should store
    const store = storeCredentials ? { mail, password } : {
        mail: "",
        password: ""
    }
    if (!setCookies(resp.headers.getSetCookie().join("; ").split("; "), store.mail, store.password)) return false;
    else return true;
}

export async function getWeather(id:weatherCloudId) { // fetch general weather data
    try {
        let type = checkId(id);
        if (!type) throw new Error("Invalid ID");

        const data = await fetchData(`https://app.weathercloud.net/${type}/values?code=${id}`);
        if (!("epoch" in data)) throw new Error("Failed to fetch");
        // fix visibility if present
        if (typeof data.vis === "number") data.vis = data.vis*100;

        /* ------------------------------ parse weather ----------------------------- */
        // calculate clouds height
        const cloudsHeight = (typeof data.temp === "number" && typeof data.dew === "number" && data.temp > -40 && data.dew > -40) ? Math.max(0, 124.69*(data.temp - data.dew)) : null;
        let weatherAvg: string|null = null;
        // check data presence
        if (typeof data.bar === "number" && typeof data.rainrate === "number" && typeof data.hum === "number") {
            // check data validity
            if (data.bar < 0 || data.rainrate < 0 || typeof cloudsHeight !== "number" || data.hum < 0 || data.hum > 100) throw new Error("Invalid data");
            // guess current conditions based on data
            weatherAvg = "clear";
            if (data.rainrate == 0) {
                if (data.bar < 1005) weatherAvg = "cloud";
                else if (data.bar < 1010) weatherAvg = "change";
                else if (data.bar < 1015) weatherAvg = "few";
                
                if (cloudsHeight < 150) weatherAvg += "-fog";
            } else {
                if (data.rainrate < 2) weatherAvg = "light";
                else if (data.rainrate < 15) weatherAvg = "moderate";
                else weatherAvg = "heavy";
            }
        }
        // get feel (more or less just like heat / chill but since this is optionnal we get the value no matter what)
        let feel = data.temp ? data.temp : null;
        if (typeof data.temp === "number" && typeof data.wspd === "number" && data.temp < 10) feel = chillFn(data.temp, data.wspd);
        else if (typeof data.temp === "number" && typeof data.hum === "number" && data.temp > 26) feel = heatFn(data.temp, data.hum);

        return {
            ...data,
            computed: { // rounded computed data
                cloudsHeight: cloudsHeight ? Math.round(cloudsHeight*10)/10 : null,
                feel: feel ? Math.round(feel*10)/10 : null,
                weatherAvg
            }
        }
    } catch (err) {
        return { error: err };
    }
}

export async function getProfile(id:weatherCloudId) {
    try {
        let type = checkId(id);
        if (!type) throw new Error("Invalid ID");
        const profile = await fetchData(`https://app.weathercloud.net/${type}/ajaxprofile`, `d=${id}`);
        if (!("followers" in profile)) throw new Error("Failed to fetch");
        return profile;
    } catch (err) {
        return { error: err };
    }
}

export async function getInfos(id:weatherCloudId) {
    try {
        if (!checkId(id)) throw new Error("Invalid ID");
        const data = await fetchData(`https://app.weathercloud.net/device/info/${id}`);
        if (!("device" in data) || !("values" in data)) throw new Error("Failed to fetch");
        const values = Object.fromEntries( // parse values to int because weathercloud is terribly inconsistent
			Object.entries(data.values).map(([key, value]) => ([key, +value]))
		);
        return {
            ...data,
            values
        };
    } catch (err) {
        return { error: err };
    }
}

export async function getLastUpdate(id:weatherCloudId) {
    try {
        let type = checkId(id);
        if (!type) throw new Error("Invalid ID");
        const lastUpdate = await fetchData(`https://app.weathercloud.net/${type}/ajaxupdatedate`, `d=${id}`);
        if (!("update" in lastUpdate)) throw new Error("Failed to fetch");
        return lastUpdate;
    } catch (err) {
        return { error: err };
    }
}

export async function getWind(id:weatherCloudId) {
    try {
        let type = checkId(id);
        if (!type) throw new Error("Invalid ID");
        const data = await fetchData(`https://app.weathercloud.net/${type}/wind?code=${id}`);
        if (!("date" in data)) throw new Error("Failed to fetch");

        // calculation from weatherclouds to display graphs
        let wdirdistData: number[] = [];
        let wspddistData: number[] = [];
        let total = 0;
        let calm = 0;
        
        data.values.forEach((value) => {
            const wdir = value.scale.reduce((a, b) => a + b, 0) - value.scale[0]; // total of scale[] - scale[0] (which is no wind)
            wdirdistData.push(wdir);
            wspddistData.push(wdir > 0 ? value.sum / wdir : 0);
            total += wdir;
            calm += value.scale[0];
        })
        total += calm;

        let wdirproportions = wdirdistData.map(wdir => (wdir / total) * 100);

        return {
            date: data.date, // time of the update
            // for graph of percentage per cardinals
            wdirproportions, // array of proportion of wind, each one is a cardinals
            calm: (calm/total) * 100, // proportion of calm wind time
            // for graphs of speed per cardinals
            wspddistData, // array of wind speeds, each one is a cardinals
            raw: data // original values
        };
    } catch (err) {
        return { error: err };
    }
}

export async function getStatistics(id:weatherCloudId) {
    try {
        let type = checkId(id);
        if (!type) throw new Error("Invalid ID");
        const data = await fetchData(`https://app.weathercloud.net/${type}/stats?code=${id}`);
        if (!("last_update" in data)) throw new Error("Failed to fetch");
        return data;
    } catch (err) {
        return { error: err };
    }
}

export async function getNearest(lat: string|number, lon: string|number, radius: string|number) {
    try {
        const data = await fetchData(`https://app.weathercloud.net/page/coordinates/latitude/${lat}/longitude/${lon}/distance/${radius}`);
        if (!data || !("devices" in data) || !Array.isArray(data.devices)) throw new Error("Failed to fetch");
        return parseDevicesList(data.devices as Device[], "distance");
    } catch (err) {
        return [ { error: err } ];
    }
}

export async function getTop(stat:"newest"|"followers"|"popular", countryCode:countryCode, period?:periodStr) {
    try {
        let url = `https://app.weathercloud.net/page/${stat}/country/${countryCode}`;
        if (stat === "popular") {
            if (!period) throw new Error("Period required for popular ranking");
            url += `/period/${period}`;
        }
        const data = await fetchData(url);
        if (!("devices" in data) || !Array.isArray(data.devices)) throw new Error("Failed to fetch");
        let dataType:string = stat;
        if (stat === "newest") dataType = "age";
        if (stat === "popular") dataType = "views";
        return parseDevicesList(data.devices as Device[], dataType);
    } catch (err) {
        return { error: err };
    }
}

export async function getAllDevices(parseDevice?:boolean) {
    const devices = await fetchData(`https://app.weathercloud.net/map/bgdevices`);
    const metar = await fetchData(`https://app.weathercloud.net/map/metars`);
    // check validity
    if (
        !("devices" in devices) || !("owner" in devices) || !Array.isArray(devices.devices)
        ||
        !("metars" in metar) || !Array.isArray(metar.metars)
    ) throw new Error("failed to fetch");
    // parse
    function parseDeviceList(list:deviceMapElement[]) {
        return list.map(device => ({
            code: device[4] === 0 ? device[0] : parseInt(device[0], 36), // convert device ids to base10
            name: device[1],
            type: device[4] === 0 ? "metar" : "device",
            lat: device[2],
            lon: device[3],
            status: device[4],
            isWebcam: !!device[5], // convert to boolean
            temp: device[6] === "" ? null : device[6]/10,
            hum: device[7] === "" ? null : device[7],
            bar: device[8]/10,
            wspdavg: device[9] === "" ? null : device[9]/10,
            wdiravg: device[10] === "" ? null : device[10],
            rain: device[11] === "" ? null : device[11]/10,
            rainrate: device[12] === "" ? null : device[12]/10,
            solarrad: device[13] === "" ? null : device[13]/10,
            uvi: device[14] === "" ? null : device[14]/10,
        }));
    }
    
    return parseDevice ? 
    [
        ...parseDeviceList(devices.devices),
        ...parseDeviceList(metar.metars)
    ]
    :
    [
        ...devices.devices,
        ...metar.metars
    ];
}

export async function getStationStatus(id:regularID) { // fetch the station status [NEED LOGIN] -- metar not supported by api
    try {
        let type = checkId(id);
        if (!type || type === "metar") throw new Error("Invalid ID");
        if ((await getCookie()).length < 1) throw new Error("Session required!");
        const data = await fetchData(`https://app.weathercloud.net/device/ajaxdevicestats`, `device=${id}`);
        if (!Array.isArray(data) || !("date" in data[0])) throw new Error("Failed to fetch");
        return data;
    } catch (err) {
        return { error: err };
    }
}

export async function getOwn() {
    try {
        if ((await getCookie()).length < 1) throw new Error("Session required!");
        const data = await fetchData(`https://app.weathercloud.net/page/own`);
        if (!("devices" in data) || !("favorites" in data)) throw new Error("Failed to fetch");
        return {
            devices: parseDevicesList(data.devices),
            favorites: parseDevicesList(data.favorites),
        };
    } catch (err) {
        return { error: err };
    }
}

export async function isFavorite(id:weatherCloudId) {
    try {
        if (!checkId(id)) throw new Error("Invalid ID");
        if ((await getCookie()).length < 1) throw new Error("Session required!");
        const data = await fetchData(`https://app.weathercloud.net/device/ajaxfavoritesnumber`, `d=${id}`);
        if (!("favoriteStatus" in data)) throw new Error("Failed to fetch");
        return data.favoriteStatus == "1" ? true : false;
    } catch (err) {
        return { error: err };
    }
}

export async function addFavorite(id:weatherCloudId) {
    try {
        if (!checkId(id)) throw new Error("Invalid ID");
        if ((await getCookie()).length < 1) throw new Error("Session required!");
        if (await isFavorite(id)) return true;
        const data = await fetchData(`https://app.weathercloud.net/device/ajaxfavorite`, `device=${id}&delete=0`);
        if (!("favorites" in data) || !("success" in data)) throw new Error("Failed to fetch");
        return data.success;
    } catch (err) {
        return false;
    }
}

export async function removeFavorite(id:weatherCloudId) {
    try {
        if (!checkId(id)) throw new Error("Invalid ID");
        if ((await getCookie()).length < 1) throw new Error("Session required!");
        if (!(await isFavorite(id))) return true;
        console.log("ok")
        const data = await fetchData(`https://app.weathercloud.net/device/ajaxfavorite`, `device=${id}&delete=1`);
        if (!("favorites" in data) || !("success" in data)) throw new Error("Failed to fetch");
        return data.success;
    } catch (err) {
        return false;
    }
}
