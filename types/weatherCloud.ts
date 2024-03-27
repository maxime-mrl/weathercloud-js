type StringifyNumbers<T> = { // transform number of an object type to string
    [K in keyof T]: T[K] extends number ? string : T[K];
};

type singleStatistic = [
    number, // time of measurement
    number // value of measurement
]

export type weatherCloudId = `${number}${number}${number}${number}${number}${number}${number}${number}${number}${number}`;

export type countryCode = `${Uppercase<string>}${Uppercase<string>}`;
export type periodStr = "day"|"week"|"month"|"year"|"all";

export interface WeatherData {
    epoch: number // time of the last update (unix seconds)
    bar: number // pressure (hPa)
    wdir: number // wind direction (degree)
    wspd: number // wind speed (m/s)
    wspdhi: number // wind gust (m/s)
    rainrate: number // rainrate (mm/hour)
    rain: number // rained today (mm)
    temp: number // temperature (°C)
    temp02?: number // temperature of something (not sure what nor why dosen't seems to be displayed on original website not on all stations) (°C)
    chill?: number // seems to be related to feel_like but there is a separate way of getting it so i'm not sure
    heat?: number // seems to be related to feel_like but there is a separate way of getting it so i'm not sure -- not included by every stations
    hum: number // humidity (%)
    dew: number // dew point (°C)
    wspdavg: number // average wind speed (m/s)
    wdiravg: number // average wind direction (degree)
    solarrad?: number // solar radiation (W/m²)
    uvi?: number // UV index

    // logged only

    tempin?: number // Interior temperature (°C)
    humin?: number // Interior humidity (%)
};

export interface LastUpdate {
    update: number // time elapsed since the last update (seconds)
    status: string // unknkown
    server_time: number // server time when requested (unix seconds)
    time?: string // added later via logic
};

export interface Profile {
    observer: { // owner infos
        name: string
        nickname: string
        company: string
    }
    followers: { // follower of this station
        number: string // (this is a number in a string)
    }
    device: { // device informations
        brand: string
        model: string
    }
};

export interface Device {
    type: string // type of device -- generally device
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
    
    wspd_current: singleStatistic
    wspd_day_max: singleStatistic
    wspd_day_min: singleStatistic
    wspd_month_max: singleStatistic
    wspd_month_min: singleStatistic
    wspd_year_max: singleStatistic
    wspd_year_min: singleStatistic
    
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
    
    rainrate_current: singleStatistic
    rainrate_day_max: singleStatistic
    rainrate_day_min: singleStatistic
    rainrate_month_max: singleStatistic
    rainrate_month_min: singleStatistic
    rainrate_year_max: singleStatistic
    rainrate_year_min: singleStatistic

    rain_current: singleStatistic
    rain_day_max: singleStatistic
    rain_day_total: singleStatistic
    rain_month_max: singleStatistic
    rain_month_total: singleStatistic
    rain_year_max: singleStatistic
    rain_year_total: singleStatistic
    
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
}
