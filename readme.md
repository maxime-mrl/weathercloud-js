# Weather cloud API 📡

**⚠️ work in progress**

## What is it?

weathercloud.net is a web application that logs and makes weather data from personal weather stations publicly accessible.

**-> This is a reverse engineering of the private API used to retrieve data from one station.**

## Table of contents

- [Weather cloud API 📡](#weather-cloud-api-)
  - [What is it?](#what-is-it)
  - [Table of contents](#table-of-contents)
  - [Instalation](#instalation)
  - [Usage](#usage)
    - [Development](#development)
    - [Build app](#build-app)
  - [Currently Supported](#currently-supported)
  - [API documentation](#api-documentation)
    - [known endpoints](#known-endpoints)
  - [License](#license)
  - [Links](#links)

## Instalation

Install necessary dependencies (typescript)

```bash
npm install
```

## Usage

Basically, run the code the way you prefer, or include it in your project. Then follow example from `./example.ts` and call the function `fetchWeather(id)` imported from `./index.ts`.

### Development

```bash
npm run dev
```

### Build app

```bash
npm run build
```

OR

```bash
npm run clean
```

## Currently Supported

 - ✔️ Device info
 - ✔️ Last update info
 - ✔️ Actual weather data
 - ✔️ Computation of various data based on received values including:
   - Clouds height 
   - Text average time 
   - Feels like temperature
   - Text time of last update
   - Minutes elapsed since last update
   - Server last update time
 - ❌ Data protected by login
 - ❌ Statistics (basic history)
 - ❌ Wind history

## API documentation

### known endpoints

This is a list of all known endpoints. There are more existing (mainly logged ones). The return type/interface refers to `./types/weatherCloud.ts` where everything is documented. Eventually, I'll make a full doc here.

**OPTIONAL / NO LOGIN**

 - Get actual weather data
   - [URl] `app.weathercloud.net/device/values?code={id}`
   - [DATA] None
   - [RETURN] Object (interface WeatherData)
   - [LOGIN] optional (more infos if logged and owned)
 - Get last update info
   - [URl] `app.weathercloud.net/device/ajaxupdatedate`
   - [DATA] `d={id}`
   - [RETURN] Object (interface LastUpdate)
   - [LOGIN] false
 - Get owner and station profile data
   - [URl] `app.weathercloud.net/device/ajaxprofile`
   - [DATA] `d={id}`
   - [RETURN] Object (interface Profile)
   - [LOGIN] false
 - Get basic statistics
   - [URl] `app.weathercloud.net/device/stats`
   - [DATA] `code=${id}`
   - [RETURN] Object (interface Statistic)
   - [LOGIN] optional (more infos if logged and owned)
 - Get top devices
   - [URL] `app.weathercloud.net/page/popular/country/${countryCode}/period/${period:"day"|"week"|"month"|"year"|"all"}`
   - [DATA] None
   - [RETURN] array (type stationList)
   - [LOGIN] false
 - Get top followed devices
   - [URL] `app.weathercloud.net/page/followers/country/${countryCode}`
   - [DATA] None
   - [RETURN] array (type stationList)
   - [LOGIN] false
 - Get newest devices
   - [URL] `app.weathercloud.net/page/newest/country/${countryCode}`
   - [DATA] None
   - [RETURN] array (type stationList)
   - [LOGIN] false
 - Get nearest station from coordinate
   - [URL] `app.weathercloud.net/page/coordinates/latitude/${lat}/longitude/${lon}/distance/${radius}`
   - [DATA] None
   - [RETURN] array (type stationList)
   - [LOGIN] false

**LOGIN REQUIRED**

 - Get station statistic infos (update battery etc)
   - [URl] `app.weathercloud.net/device/ajaxdevicestats`
   - [DATA] `device={id}`
   - [RETURN] Array (type uptime)
   - [LOGIN] true (for owned or not - maybe owned can give battery and more stats)


**NOT DEFINED (WIP)**
 - Get your history (probably w/ cookies so not very usefull)
   - [URL] `app.weathercloud.net/page/lastviews`
   - [DATA] None
   - [RETURN] array (type stationList)
 - Get wind history
   - [URl] `app.weathercloud.net/device/wind`
   - [DATA] `code=${id}`
   - [RETURN] WIP
 - Get graph data history
   - [URl] `app.weathercloud.net/device/evolution`
   - [DATA] `device=${id}; variable=${variablecode(101/201/541/641/701/801/811/1001/1101/6011/6501)}; period=${variableday(day/week/month)}; WEATHERCLOUD_CSRF_TOKEN=${token?}`
   - [RETURN] WIP
 - Get owned/fav devices
   - [URL] `app.weathercloud.net/page/own`
 - Login
   - [URL] `app.weathercloud.net/signin`
 - Register
   - [URL] `app.weathercloud.net/signup`

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Links

- 📡[Github](https://github.com/maxime-mrl/weathercloud-api)