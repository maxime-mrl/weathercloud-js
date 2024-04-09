import type { weatherCloudId, countryCode, periodStr, regularID } from "./types/weatherCloud";
import { chillFn, heatFn, fetchData, setCookies, parseDevicesList, getCookie, checkId } from "./utils";

export async function fetchWeather(id:weatherCloudId) { // fetch general weather data
    try {
        let type = checkId(id);
        if (!type) throw new Error("Invalid ID");

        const fullReport = {
            weather: {},
            update: {},
            profile: {},
        };

        /* --------------------------- request basic data --------------------------- */
        const data = await fetchData(`https://app.weathercloud.net/${type}/values?code=${id}`);
        const lastUpdate = await fetchData(`https://app.weathercloud.net/${type}/ajaxupdatedate`, `d=${id}`);
        const profile = await fetchData(`https://app.weathercloud.net/${type}/ajaxprofile`, `d=${id}`);

        /* --------------------------- check data presence -------------------------- */
        if (!data || !("epoch" in data) ||
            !("update" in lastUpdate) ||
            !("followers" in profile)
        ) throw new Error("Failed to fetch");


        /* ------------------------------ parse weather ----------------------------- */
        // calculate clouds height
        const cloudsHeight = (data.temp && data.dew && data.temp > -40 && data.dew > -40) ? Math.max(0, 124.69*(data.temp - data.dew)) : null;

        let weatherAvg: string|null = null
        // check data presence
        if (data.bar && data.rainrate && data.hum) {
            // check data validity
            if (data.bar < 0 ||
                data.rainrate < 0 ||
                !cloudsHeight ||
                data.hum < 0 ||
                data.hum > 100
            ) throw new Error("Invalid data");
            // guess current conditions based on data
            weatherAvg = "clear";
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
        }

        // get feel (more or less just like heat/chill but since this is optionnal we get the value no matter what)
        let feel = data.temp;
        if (data.temp && data.wspd && data.temp < 10) feel = chillFn(data.temp, data.wspd);
        else if (data.temp && data.hum && data.temp > 26) feel = heatFn(data.temp, data.hum);

        // parse visibility if present cause for some reason it's divided by 100
        if (typeof data.vis === "number") data.vis = data.vis*100;
        // save the added data
        const { epoch, ...dataToSave } = data;
        fullReport.weather = {
            ...dataToSave,
            ...(cloudsHeight ? { cloudsHeight } : {}), // not include null data
            ...(weatherAvg ? { weatherAvg } : {}),
            ...(feel ? { feel } : {}),
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

export async function getStationStatus(id:regularID) { // fetch the station status [NEED LOGIN] -- metar not supported by api
    try {
        let type = checkId(id);
        if (!type || type === "metar") throw new Error("Invalid ID");
        if ((await getCookie()).length < 1) throw new Error("Session required!");
        const data = await fetchData(`https://app.weathercloud.net/device/ajaxdevicestats`, `device=${id}`);
        if (!data || !Array.isArray(data) || !("date" in data[0]))  throw new Error("Failed to fetch");
        return data;
    } catch (err) {
        return { error: err };
    }
}

export async function getStatistics(id:weatherCloudId) {
    try {
        let type = checkId(id);
        if (!type) throw new Error("Invalid ID");
        const data = await fetchData(`https://app.weathercloud.net/${type}/stats?code=${id}`);
        if (!data || !("last_update" in data))  throw new Error("Failed to fetch");
        return data;
    } catch (err) {
        return { error: err };
    }
}

export async function getNearest(lat: string|number, lon: string|number, radius: string|number) {
    try {
        const data = await fetchData(`https://app.weathercloud.net/page/coordinates/latitude/${lat}/longitude/${lon}/distance/${radius}`);
        if (!data || !("devices" in data) || !Array.isArray(data.devices))  throw new Error("Failed to fetch");
        return parseDevicesList(data.devices, "distance");
    } catch (err) {
        return [ { error: err } ];
    }
}

export async function getTop(definer:"newest"|"followers"|"popular",countryCode:countryCode, period?:periodStr) {
    try {
        let url = `https://app.weathercloud.net/page/${definer}/country/${countryCode}`;
        if (definer === "popular") {
            if (!period) throw new Error("Period required for popular ranking");
            url += `/period/${period}`;
        }
        const data = await fetchData(url);
        if (!data || !("devices" in data) || !Array.isArray(data.devices))  throw new Error("Failed to fetch");
        let dataType:string = definer;
        if (definer === "newest") dataType = "age";
        if (definer === "popular") dataType = "views";
        return parseDevicesList(data.devices, dataType);
    } catch (err) {
        return { error: err };
    }
}

export async function getOwn() {
    try {
        if ((await getCookie()).length < 1) throw new Error("Session required!");
        const data = await fetchData(`https://app.weathercloud.net/page/own`);
        if (!data || !("devices" in data) || !("favorites" in data))  throw new Error("Failed to fetch");
        return {
            devices: parseDevicesList(data.devices),
            favorites: parseDevicesList(data.favorites),
        };
    } catch (err) {
        return { error: err };
    }
}

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

export async function getWind(id:weatherCloudId) {
    try {
        let type = checkId(id);
        if (!type) throw new Error("Invalid ID");
        const data = await fetchData(`https://app.weathercloud.net/${type}/wind?code=${id}`);
        if (!data || !("date" in data))  throw new Error("Failed to fetch");

        // calculation from weatherclouds to display graphs
        let wdirdistData: number[] = [];
        let wspddistData: number[] = [];
        let total = 0;
        let calm = 0;
        
        data.values.forEach((value) => {
            const wdir = value.scale.reduce((a, b) => a + b, 0) - value.scale[0];  // total of scale[] - scale[0] (which is no wind)
            wdirdistData.push(wdir);
            wspddistData.push(wdir > 0 ? value.sum / wdir : 0);
            total += wdir;
            calm += value.scale[0];
        })
        total += calm;

        let wdirproportions = wdirdistData.map(wdir => (wdir / total) * 100);

        return {
            date: data.date, // tile of the update
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

export async function getInfos(id:weatherCloudId) {
    try {
        if (!checkId(id)) throw new Error("Invalid ID");
        const data = await fetchData(`https://app.weathercloud.net/device/info/${id}`);
        if (!data)  throw new Error("Failed to fetch");
        return data;
    } catch (err) {
        return { error: err };
    }
}

export async function isFavorite(id:weatherCloudId) {
    try {
        if (!checkId(id)) throw new Error("Invalid ID");
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
        if (!(await isFavorite(id))) return true;
        console.log("ok")
        const data = await fetchData(`https://app.weathercloud.net/device/ajaxfavorite`, `device=${id}&delete=1`);
        if (!("favorites" in data) || !("success" in data)) throw new Error("Failed to fetch");
        return data.success;
    } catch (err) {
        return false;
    }
}
