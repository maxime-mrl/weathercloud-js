type StringifyNumbers<T> = { // transform number of an object type to string
    [K in keyof T]: T[K] extends number ? string : T[K];
};

type singleStatistic = [
    number, // time of measurement
    number // value of measurement
]
export type regularID = `${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}`
export type metarID = `${Uppercase<string>}${Uppercase<string>}${Uppercase<string>}${Uppercase<string>}`

export type weatherCloudId = regularID | metarID;

export type countryCode = `${Uppercase<string>}${Uppercase<string>}`;
export type periodStr = "day"|"week"|"month"|"year"|"all";

export type isFavoriteResponse = "0"|"1";

export interface FavoriteResponse {
    type: "add"|"delete", // type of action
    success: boolean,
    favorites: 0|1 // old favorite status (as boolean)
}

export interface WeatherData {
    // included most of the time
    epoch: number // time of the last update (unix seconds)
    bar: number // pressure (hPa)
    wdir: number // wind direction (degree)
    wdiravg: number // average wind direction (degree)
    wspd?: number // wind speed (m/s)
    wspdhi?: number // wind gust (m/s)
    wspdavg?: number // average wind speed (m/s)
    rainrate?: number // rainrate (mm/hour)
    rain?: number // rained today (mm)
    temp?: number // temperature (°C)
    hum?: number // humidity (%)
    dew?: number // dew point (°C)
    
    // optional
    temp02?: number // temperature of something (not sure what nor why dosen't seems to be displayed on original website not on all stations) (°C)
    hum02?: number
    chill?: number // wind-chill or how much colder will it feels w/ wind
    heat?: number // heat or how much will it feel hotter with humidity -- not included by every stations
    thw?: number // Temperature-Humidity-Wind Index or feel like
    solarrad?: number // solar radiation (W/m²)
    uvi?: number // UV index
    vis?: number // visibility (100 of meters)

    // logged only (or not if it's from devices list)
    tempin?: number // Interior temperature (°C)
    humin?: number // Interior humidity (%)
    dewin?: number
    heatin?: number
};

export interface LastUpdate {
    update: number // time elapsed since the last update (seconds)
    status: string // "2" is normal "0" is a special state where update is the only thig worth displaying others means some kind of errors
    server_time: number // server time when requested (unix seconds)
    time?: string // added later via logic
};

export interface Profile {
    observer?: { // owner infos (not present for METAR)
        name: string
        nickname: string
        company: string
    }
    followers: { // follower of this station
        number: string // (this is a number in a string)
    }
    device?: { // device informations (not present for METAR)
        brand: string
        model: string
    }
};

export interface Device {
    type: "device|metar" // type of device -- device for personal device metar for airport station
    code: weatherCloudId // station ID
    name: string // station name

    // position of the station
    city: string
    latitude: string
    longitude: string
    elevation: string // elevation in decimeters (meters*10)

    image: string // image profile url of the station
    account: number|string // no idea what is this
    isFavorite: boolean // with account cookie tell you if you favorited this station
    update: number // seconds elapsed since last update
    values: StringifyNumbers<WeatherData> // just like weather_data but with strings for some reason
    status?: string
    data?: string // number of views / distance (km) / followers / age (day) // depending on what's asked
};

export interface DevicesList {
    devices: Device[]
};

export interface OwnDevices {
    devices: Device[] | [];
    favorites: Device[] | [];
};

export interface Uptime {
    date: number // day (unix seconds)
    value: number // uptime (%)

    // some other things for battery/current maybe? - only for compatible owned station
};

export interface DeviceInfo {
    device: { // self explanatory for most of things
        account: number|string // not sure what is this
        status: string // neither for that
        city: string // city
        image: null|string // if there is a banner image dor the station, url of that image
        isWebcam: boolean // is there a webcam
        favorite: boolean // is fav (false when logged out)
        social: boolean // is there a twitter account linked
        altitude: string // elevation of the station
        update: number // seconds since last update
    }
    values: { // some of the data from weatherdata but not all - in string format
        temp: string
        hum: string
        dew: string
        wspdavg: string
        wdiravg: string
        bar: string
        rain: string
        rainrate?: string
        solarrad?: string
        uvi?: string
        vis?: string
    }
}


export interface Statistic { // data type similar to weather_data
    last_update: number // time of the last update (unix seconds)
    temp_current: singleStatistic
    temp_day_max: singleStatistic
    temp_day_min: singleStatistic
    temp_month_max: singleStatistic
    temp_month_min: singleStatistic
    temp_year_max: singleStatistic
    temp_year_min: singleStatistic

    dew_current: singleStatistic
    dew_day_max: singleStatistic
    dew_day_min: singleStatistic
    dew_month_max: singleStatistic
    dew_month_min: singleStatistic
    dew_year_max: singleStatistic
    dew_year_min: singleStatistic
    
    hum_current: singleStatistic
    hum_day_max: singleStatistic
    hum_day_min: singleStatistic
    hum_month_max: singleStatistic
    hum_month_min: singleStatistic
    hum_year_max: singleStatistic
    hum_year_min: singleStatistic
    
    bar_current: singleStatistic
    bar_day_max: singleStatistic
    bar_day_min: singleStatistic
    bar_month_max: singleStatistic
    bar_month_min: singleStatistic
    bar_year_max: singleStatistic
    bar_year_min: singleStatistic
    
    wspdavg_current: singleStatistic
    wspdavg_day_max: singleStatistic
    wspdavg_day_min: singleStatistic
    wspdavg_month_max: singleStatistic
    wspdavg_month_min: singleStatistic
    wspdavg_year_max: singleStatistic
    wspdavg_year_min: singleStatistic
    
    wspdhi_current: singleStatistic
    wspdhi_day_max: singleStatistic
    wspdhi_day_min: singleStatistic
    wspdhi_month_max: singleStatistic
    wspdhi_month_min: singleStatistic
    wspdhi_year_max: singleStatistic
    wspdhi_year_min: singleStatistic
    
    wdiravg_current: singleStatistic
    wdiravg_day_max: singleStatistic
    wdiravg_day_min: singleStatistic
    wdiravg_month_max: singleStatistic
    wdiravg_month_min: singleStatistic
    wdiravg_year_max: singleStatistic
    wdiravg_year_min: singleStatistic

    rain_current: singleStatistic
    rain_day_max: singleStatistic
    rain_day_total: singleStatistic
    rain_month_max: singleStatistic
    rain_month_total: singleStatistic
    rain_year_max: singleStatistic
    rain_year_total: singleStatistic
    
    // optional
    wspd_current?: singleStatistic
    wspd_day_max?: singleStatistic
    wspd_day_min?: singleStatistic
    wspd_month_max?: singleStatistic
    wspd_month_min?: singleStatistic
    wspd_year_max?: singleStatistic
    wspd_year_min?: singleStatistic
    
    rainrate_current?: singleStatistic
    rainrate_day_max?: singleStatistic
    rainrate_day_min?: singleStatistic
    rainrate_month_max?: singleStatistic
    rainrate_month_min?: singleStatistic
    rainrate_year_max?: singleStatistic
    rainrate_year_min?: singleStatistic

    solarrad_current?: singleStatistic
    solarrad_day_max?: singleStatistic
    solarrad_day_hours?: singleStatistic
    solarrad_month_max?: singleStatistic
    solarrad_month_hours?: singleStatistic
    solarrad_year_max?: singleStatistic
    solarrad_year_hours?: singleStatistic
    
    uvi_current?: singleStatistic
    uvi_day_max?: singleStatistic
    uvi_day_min?: singleStatistic
    uvi_month_max?: singleStatistic
    uvi_month_min?: singleStatistic
    uvi_year_max?: singleStatistic
    uvi_year_min?: singleStatistic
    
    chill_current?: singleStatistic
    chill_day_max?: singleStatistic
    chill_day_min?: singleStatistic
    chill_month_max?: singleStatistic
    chill_month_min?: singleStatistic
    chill_year_max?: singleStatistic
    chill_year_min?: singleStatistic
    
    heat_current?: singleStatistic
    heat_day_max?: singleStatistic
    heat_day_min?: singleStatistic
    heat_month_max?: singleStatistic
    heat_month_min?: singleStatistic
    heat_year_max?: singleStatistic
    heat_year_min?: singleStatistic
    
    // visibility for some reason divided by 100
    vis_current?: singleStatistic
    vis_day_max?: singleStatistic
    vis_day_min?: singleStatistic
    vis_month_max?: singleStatistic
    vis_month_min?: singleStatistic
    vis_year_max?: singleStatistic
    vis_year_min?: singleStatistic

    // logged only
    tempin_current?: singleStatistic
    tempin_day_max?: singleStatistic
    tempin_day_min?: singleStatistic
    tempin_month_max?: singleStatistic
    tempin_month_min?: singleStatistic
    tempin_year_max?: singleStatistic
    tempin_year_min?: singleStatistic
    
    humin_current?: singleStatistic
    humin_day_max?: singleStatistic
    humin_day_min?: singleStatistic
    humin_month_max?: singleStatistic
    humin_month_min?: singleStatistic
    humin_year_max?: singleStatistic
    humin_year_min?: singleStatistic

    dewin_current?: singleStatistic
    dewin_day_max?: singleStatistic
    dewin_day_min?: singleStatistic
    dewin_month_max?: singleStatistic
    dewin_month_min?: singleStatistic
    dewin_year_max?: singleStatistic
    dewin_year_min?: singleStatistic
    
    heatin_current?: singleStatistic
    heatin_day_max?: singleStatistic
    heatin_day_min?: singleStatistic
    heatin_month_max?: singleStatistic
    heatin_month_min?: singleStatistic
    heatin_year_max?: singleStatistic
    heatin_year_min?: singleStatistic

    // need to check for other logged of weatherdata
}

export interface windStatistics { // data that you will get from the wind endpoint, not sure what it's representing, can be used to get wind sector percentage and speed
    date: number // unix time of the data
    values: {
        sum: number // not sure what is it
        scale: number[] // scale[0] represent calm wind, others wind (force?)
    }[] // 16 values each representing a cardinal (N, NNE, NE, etc)
}
