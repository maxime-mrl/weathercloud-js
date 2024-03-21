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

This is a list of all known endpoints. There are more existing (mainly logged ones). The return type refers to `./types/weatherCloud.ts` where everything is documented. Eventually, I'll make a full doc here.

 - Get actual weather data
   - [URl] `app.weathercloud.net/device/values?code={id}`
   - [DATA] None
   - [RETURN] Object (type weather_data)
 - Get last update info
   - [URl] `app.weathercloud.net/device/ajaxupdatedate`
   - [DATA] `d={id}`
   - [RETURN] Object (type last_update)
 - Get owner and station profile data
   - [URl] `app.weathercloud.net/device/ajaxprofile`
   - [DATA] `d={id}`
   - [RETURN] Object (type profile)
 - Get basic statistics
   - [URl] `app.weathercloud.net/device/stats`
   - [DATA] `code=${id}`
   - [RETURN] WIP
 - Get wind history
   - [URl] `app.weathercloud.net/device/wind`
   - [DATA] `code=${id}`
   - [RETURN] WIP

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Links

- 📡[Github](https://github.com/maxime-mrl/weathercloud-api)