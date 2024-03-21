export type weatherCloud_id = `${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}`;

export type weather_data = {
    epoch: number, // time of the last update (unix seconds)
    bar: number, // pressure (hPa)
    wdir: number, // wind direction (degree)
    wspd: number, // wind speed (m/s)
    wspdhi: number, // wind gust (m/s)
    rainrate: number, // rainrate (mm/hour)
    rain: number, // rained today (mm)
    temp: number, // temperature (°C)
    temp02?: number // temperature of something (not sure what nor why, dosen't seems to be displayed on original website, not on all stations) (°C)
    chill: number, // seems to be related to feel_like but there is a separate way of getting it so i'm not sure
    heat?: number, // seems to be related to feel_like but there is a separate way of getting it so i'm not sure -- not included by every stations
    hum: number, // humidity (%)
    dew: number, // dew point (°C)
    wspdavg: number, // average wind speed (m/s)
    wdiravg: number, // average wind direction (degree)
    solarrad?: number, // solar radiation (W/m²)
    uvi?: number // UV index
};

export type last_update = {
    update: number, // time elapsed since the last update (seconds)
    status: string, // unknkown
    server_time: number, // server time when requested (unix seconds)
    time?: string // added later via logic
};

export type profile = {
    observer: { // owner infos
        name: string,
        nickname: string,
        company: string
    },
    followers: { // follower of this station
        number: string // (this is a number in a string)
    },
    device: { // device informations
        brand: string,
        model: string
    }
};
