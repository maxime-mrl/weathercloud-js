import type { Statistic, WeatherData, regularID, weatherCloudId, windStatistics } from "./weathercloud"

export declare function login(mail:string, password: string, storeCredentials?: boolean): Promise<boolean>;

export declare function getWeather(id:weatherCloudId): Promise<{
    epoch: number,
    bar: number,
    wdir: number,
    wdiravg: number,
    wspd?: number,
    wspdhi?: number,
    wspdavg?: number,
    rainrate?: number,
    rain?: number,
    temp?: number,
    hum?: number,
    dew?: number,
    
    temp02?: number,
    hum02?: number,
    chill?: number,
    heat?: number,
    thw?: number,
    solarrad?: number,
    uvi?: number,
    vis?: number,

    tempin?: number,
    humin?: number,
    dewin?: number,
    heatin?: number,
    computed: { 
        cloudsHeight: number | null,
        feel: number | null,
        weatherAvg: string | null,
    }
}
|
{ error: any }>;

export declare function getProfile(id:weatherCloudId): Promise<{
    observer?: { 
        name: string,
        nickname: string,
        company: string
    },
    device?: { 
        brand: string,
        model: string
    },
    followers: { 
        number: string 
    }
}
|
{ error: any }>;

export declare function getInfos(id:weatherCloudId): Promise<{
    device: {
        account: number|string,
        status: string,
        city: string,
        image: null|string,
        isWebcam: boolean,
        favorite: boolean,
        social: boolean,
        altitude: string,
        update: number
    },
    values: {
        temp: number,
        hum: number,
        dew: number,
        wspdavg: number,
        wdiravg: number,
        bar: number,
        rain: number,
        rainrate?: number,
        solarrad?: number,
        uvi?: number,
        vis?: number
    }
}
|
{ error: any }>;

export declare function getLastUpdate(id:weatherCloudId): Promise<{
    update: number,
    server_time: number,
    status: string
}
|
{ error: any }>;

export declare function getWind(id:weatherCloudId): Promise<{
    date: number,
    wdirproportions: number[],
    calm: number,
    wspddistData: number[],
    raw: windStatistics
}
|
{ error: any }>;

export declare function getStatistics(id:weatherCloudId): Promise<Statistic | { error: any }>;

export declare function getNearest(lat: string|number, lon: string|number, radius: string|number): Promise<{
    type: "device"|"metar",
    code: string,
    name: string,
   
    city: string,
    latitude: string,
    longitude: string,
    elevation: string
  
    image: string
    account: number|string
    isFavorite: boolean
    update: number
    status?: string
    distance: number
    values: WeatherData
}
|
{ error: any }>;

export declare function getTop(stat:"newest"|"followers"|"popular", countryCode:string, period?:string): Promise<{
    type: "device"|"metar",
    code: string,
    name: string,
   
    city: string,
    latitude: string,
    longitude: string,
    elevation: string
  
    image: string
    account: number|string
    isFavorite: boolean
    update: number
    status?: string
    distance: number
    values: WeatherData
}
|
{ error: any }>;

export declare function getAllDevices(parseDevice?:boolean): Promise<{
    code: string,
    name: string,
    type: "metar"|"device",
    lat: string,
    lon: string,
    status: number,
    isWebcam: boolean,
    temp: null | number,
    hum: null | number,
    bar: number,
    wspdavg: null | number,
    wdiravg: null | number,
    rain: null | number,
    rainrate: null | number,
    solarrad: null | number,
    uvi: null | number,
}
|
[
    string,
    string,
    number,
    number,
    number,
    number,
    number | "",
    number | "",
    number,
    number | "",
    number | "",
    number | "",
    number | "",
    number | "",
    number | "",
]
|
{ error: any }>;

export declare function getStationStatus(id:regularID): Promise<{
    date: number,
    value: number
   
}[]
|
{ error: any }>;

export declare function getOwn(): Promise<{
    type: "device"|"metar",
    code: string,
    name: string,
   
    city: string,
    latitude: string,
    longitude: string,
    elevation: string
  
    image: string
    account: number|string
    isFavorite: boolean
    update: number
    status?: string
    distance: number
    values: WeatherData
}
|
{ error: any }>;

export declare function isFavorite(id:weatherCloudId): Promise<boolean | { error: any }>;

export declare function addFavorite(id:weatherCloudId): Promise<boolean>;

export declare function removeFavorite(id:weatherCloudId): Promise<boolean>;