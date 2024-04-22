# Weathercloud JS API 📡

## What is it?

weathercloud.net is a web application that logs and makes publicly available weather data from personal weather stations.
> **This is a reverse engineering of the private API used to retrieve stations data.**

## Table of contents

- [Weathercloud JS API 📡](#weathercloud-js-api-)
  - [What is it?](#what-is-it)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage / Example](#usage--example)
  - [Docs](#docs)
    - [Station\_id](#station_id)
    - [`login()`](#login)
    - [`getWeather()`](#getweather)
    - [`getProfile()`](#getprofile)
    - [`getInfos()`](#getinfos)
    - [`getLastUpdate()`](#getlastupdate)
    - [`getWind()`](#getwind)
    - [`getStatistics()`](#getstatistics)
    - [`getNearest()`](#getnearest)
    - [`getTop()`](#gettop)
    - [`getAllDevices()`](#getalldevices)
    - [`getStationStatus()`](#getstationstatus)
    - [`getOwn()`](#getown)
    - [`isFavorite()`](#isfavorite)
    - [`addFavorite()`](#addfavorite)
    - [`removeFavorite()`](#removefavorite)
  - [API documentation](#api-documentation)
  - [License](#license)
  - [Links](#links)

## Installation

```bash
npm install weathercloud-api
```

## Usage / Example

```js
import { getWeather } from "weathercloud-api";

(async () => {
  // Get the weather for station ID 4172447340
  const weather = await getWeather("4172447340");
  console.log(weather);
})();
```
See more examples [here](examples)

## Docs

### Station_id

Station ID can be:
- A 10-digit string for devices.
- A 9-digit string for devices.
- A 4-letter string for METAR (following ICAO airport codes).

```ts
  const deviceId = "5692854635";
  const metarId = "LSGG";
```

### `login()`
**Log in to a WeatherCloud account**
```ts
await login(mail: string, password: string, storecredentials?: boolean = false): boolean; // Returns true if logged in successfully
```

### `getWeather()`
**Get general weather data from a station**
```ts
await getWeather(StationId:string) : {
  // included most of the time
  epoch: number, // time of the last update (unix seconds)
  bar: number, // pressure (hPa)
  wdir: number, // wind direction (degree)
  wdiravg: number, // average wind direction (degree)
  wspd?: number, // wind speed (m/s)
  wspdhi?: number, // wind gust (m/s)
  wspdavg?: number, // average wind speed (m/s)
  rainrate?: number, // rainrate (mm/hour)
  rain?: number, // rained today (mm)
  temp?: number, // temperature (°C)
  hum?: number, // humidity (%)
  dew?: number, // dew point (°C)
  
  // optional
  temp02?: number, // 2nd temperature (°C)
  hum02?: number, // 2nd humidity (%)
  chill?: number, // wind-chill (°C)
  heat?: number, // heat index (°C)
  thw?: number, // Temperature-Humidity-Wind Index or feel like (°C)
  solarrad?: number, // solar radiation (W/m²)
  uvi?: number, // UV index
  vis?: number, // visibility mainly for metar (m)

  // logged only
  tempin?: number, // in temperature (°C)
  humin?: number, // in humidity (%)
  dewin?: number, // in dew point (°C)
  heatin?: number, // in heat index (°C)
  computed: { // added via logic based on above data
    cloudsHeight: number | null, // height of the cloud (m)
    feel: number | null, // feel index (°C)
    weatherAvg: string | null, // avg state of weather in english (exemple "cloud")
  }
};
```

### `getProfile()`
**Get station profile**
```ts
await getProfile(stationId:string): {
  // Not present for metar
  observer?: { // owner infos
    name: string,
    nickname: string,
    company: string
  },
  device?: { // device informations
    brand: string,
    model: string
  },
  // present every time
  followers: { // follower of this station
    number: string // (this is a number in a string)
  }
};
```

### `getInfos()`
**Get device information**
```ts
await getInfos(stationId:string): {
  device: { // infos
    account: number|string, // ...
    status: string, // 0: metar 2: device 1: offline
    city: string, // city
    image: null|string, // optional url of device banner image
    isWebcam: boolean, // is there a webcam
    favorite: boolean, // is station favourite (false when not logged)
    social: boolean, // is there a twitter account linked
    altitude: string, // elevation of the station (m)
    update: number // seconds since last update
  },
  values: { // some of the station data 
    temp: number, // temperature (°C) 
    hum: number, // humidity (%)
    dew: number, // dew point (°C)
    wspdavg: number, // average wind speed (m/s)
    wdiravg: number, // average wind direction (degree)
    bar: number, // pressure (hPa)
    rain: number, // rained today (mm)
    rainrate?: number, // rainrate (mm/hour)
    solarrad?: number, // solar radiation (W/m²)
    uvi?: number, // UV index
    vis?: number // visibility mainly for metar (m)
  }
};
```

### `getLastUpdate()`
**Get update infos**
```ts
await getLastUpdate(stationId:string): {
  update: number, // time elapsed since the last update (seconds)
  server_time: number, // server time when requested (unix seconds)
  status: string // "2" => OK; others => some kind of error
};
```

### `getWind()`
**Get wind data (directions and forces over directions)**
```ts
await getWind(stationId:string): {
  date: number, // time of the update
  wdirproportions: number[], // array of proportion of wind, each one is a cardinals
  calm: number, // proportion of calm wind time (%)
  wspddistData: number[], // array of wind speeds, each one is a cardinals
  raw: data // original values gl to know what this is exactly
};
```

### `getStatistics()`
**Get statistics (max/min for day/month/year)**
```ts
await getStationStatus(stationId:string): {
  last_update: number // time of the last update (unix seconds)
  temp_current: [
    number, // time of measurement
    number // value of measurement
  ],
  temp_day_max: [ number, number ], // number index are the same patern for every entries
  temp_day_min: [ number, number ],
  temp_month_max: [ number, number ],
  temp_month_min: [ number, number ],
  temp_year_max: [ number, number ],
  temp_year_min: [ number, number ],
  
  dew_current: [ number, number ],
  dew_day_max: [ number, number ],
  dew_day_min: [ number, number ],
  dew_month_max: [ number, number ],
  dew_month_min: [ number, number ],
  dew_year_max: [ number, number ],
  dew_year_min: [ number, number ],
  
  hum_current: [ number, number ],
  // all elements as temp or dew
  bar_current: [ number, number ],
  // ...
  wspdavg_current: [ number, number ],
  // ...
  wspdhi_current: [ number, number ],
  // ...
  wdiravg_current: [ number, number ],
  // ...
  rain_current: [ number, number ],
  // ...
  
  // optional
  wspd_current?: [ number, number ],
  // ...
  rainrate_current?: [ number, number ],
  // ...
  solarrad_current?: [ number, number ],
  // ...
  uvi_current?: [ number, number ],
  // ...
  chill_current?: [ number, number ],
  // ...
  heat_current?: [ number, number ],
  // ...
  
  // visibility for some reason divided by 100
  vis_current?: [ number, number ],
  // ...

  // logged only
  tempin_current?: [ number, number ],
  // ...
  humin_current?: [ number, number ],
  // ...
  dewin_current?: [ number, number ],
  // ...
  heatin_current?: [ number, number ]
  // ...
};
```

### `getNearest()`
**Get station in given radius of a GPS point**
```ts
await getNearest(latitude: string|number, longitude: string|number, radius: string|number): {
  type: "device"|"metar",
  code: string, // id of station
  name: string, // name
  // position
  city: string,
  latitude: string,
  longitude: string,
  elevation: string // (m)

  image: string // image profile url of the station
  account: number|string // ...
  isFavorite: boolean // is station favourite (false when not logged)
  update: number // seconds elapsed since last update
  status?: string // 0: METAR, 2: Device OK 1: Device error
  distance: number // distance from point (km)
  values: Object // just like data from getWeather
}[];
```

### `getTop()`
**Get top station by views, follows, or newest in a country, other a timeframe**
```ts
await getTop(stat:"newest"|"followers"|"popular", countryCode:string, period?:"day"|"week"|"month"|"year"|"all"): { // timeframe not used for newest else mandatory
  type: "device"|"metar",
  code: string, // id of station
  name: string, // name
  // position
  city: string,
  latitude: string,
  longitude: string,
  elevation: string // (m)

  image: string // image profile url of the station
  account: number|string // ...
  isFavorite: boolean // is station favourite (false when not logged)
  update: number // seconds elapsed since last update
  status?: string // 0: METAR, 2: Device OK 1: Device error
  age?: number // distance from point (km) -- for newest only
  views?: number // distance from point (km) -- for popular only
  followers?: number // distance from point (km) -- for followers only
  values: Object // just like data from getWeather
}[];
```

### `getAllDevices()`
**List ALL device /!\ very heavy return**
```ts
await getAllDevices(parseDevice?:boolean=false): { // parseDevice optional to let choice between easy work on data, or easyier for machine
  code: string, // station id
  name: string, // station name
  type: "metar"|"device",
  lat: string, // GPS loc
  lon: string, // GPS loc
  status: number, // 0: metar 2: device 1: offline
  isWebcam: boolean, // is a webcam
  temp: null | number, // temperature (°C)
  hum: null | number, // humidity (%)
  bar: number, // pressure (hPa)
  wspdavg: null | number, // average wind speed (m/s)
  wdiravg: null | number, // average wind direction (degree)
  rain: null | number, // rained today (mm)
  rainrate: null | number, // rainrate (mm/hour)
  solarrad: null | number, // solar radiation (W/m²)
  uvi: null | number, // UV index
} | // depending of parseDevice
[ // not parsed
  string, // ID (in base36 for devices)
  string, // name
  number, // latitude
  number, // longitude
  number, // status - 0: metar 2: device 1: offline
  number, // is webcam
  number | "", // temperature (°C*10) string if undefined
  number | "", // humidity string if undefined
  number, // pressure (hPa*10)
  number | "", // average wind speed (m/s*10) string if undefined
  number | "", // average wind direction (deg) string if undefined
  number | "", // rain (mm*10) string if undefined
  number | "", // rainrate (mm/h*10) string if undefined
  number | "", // solarrad string if undefined
  number | "", // uvi string if undefined
];
```

### `getStationStatus()`
**[LOGGED ONLY] Get the uptime of the station over the past month**
```ts
await getStationStatus(stationId:string): { // METAR unsuported
  date: number, // day (unix seconds)
  value: number // uptime (%)
  // maybe some more data for compatible and owned stations
}[];
```

### `getOwn()`
**[LOGGED ONLY] Get owned and favorites devices**
```ts
await getOwn(): {
  favorites: [ // favorites devices list
    {
      type: "device"|"metar",
      code: string, // id of station
      name: string, // name
      // position
      city: string,
      latitude: string,
      longitude: string,
      elevation: string // (m)

      image: string // image profile url of the station
      account: number|string // ...
      isFavorite: boolean // is station favourite (false when not logged)
      update: number // seconds elapsed since last update
      status?: string // 0: METAR, 2: Device OK 1: Device error
      values: Object // just like data from getWeather
    }
  ]
  devices: [ // owned devices list
    // just like favorite
  ]
};
```

### `isFavorite()`
**[LOGGED ONLY] Know if a device is favourited**
```ts
await isFavorite(stationId:string): boolean;
```

### `addFavorite()`
**[LOGGED ONLY] Add a station to favorites**
```ts
await addFavorite(stationId:string): boolean; // return true if success
```

### `removeFavorite()`
**[LOGGED ONLY] Remove a station to favorites**
```ts
await removeFavorite(stationId:string): boolean; // return true if success
```

## API documentation

API docs are now separate, you can find them in [api-documentation.md](api-documentation.md)

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Links

- 📡[Github](https://github.com/maxime-mrl/weathercloud-api)