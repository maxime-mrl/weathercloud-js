# API documentation

Want to directly use the weathercloud API on your own? Here is the endpoints doc:

## Table of contents

- [API documentation](#api-documentation)
  - [Table of contents](#table-of-contents)
  - [General Format](#general-format)
  - [Defined endpoints](#defined-endpoints)
    - [`/signin`](#signin)
    - [`/device/values`](#devicevalues)
    - [`/device/stats`](#devicestats)
    - [`/device/wind`](#devicewind)
    - [`/device/info`](#deviceinfo)
    - [`/device/ajaxprofile`](#deviceajaxprofile)
    - [`/device/ajaxdevicestats`](#deviceajaxdevicestats)
    - [`/device/ajaxupdatedate`](#deviceajaxupdatedate)
    - [`/device/ajaxfavorite`](#deviceajaxfavorite)
    - [`/device/ajaxfavoritesnumber`](#deviceajaxfavoritesnumber)
    - [`/page/popular`](#pagepopular)
    - [`/page/followers`](#pagefollowers)
    - [`/page/newest`](#pagenewest)
    - [`/page/coordinates`](#pagecoordinates)
    - [`/page/own`](#pageown)
  - [Known endpoints](#known-endpoints)
    - [`/device/evolution`](#deviceevolution)
    - [`/map/metars`](#mapmetars)
    - [`/map/bgdevices`](#mapbgdevices)
    - [`/signup`](#signup)
    - [`/page/lastviews`](#pagelastviews)

## General Format

API Start from `https://app.weathercloud.net/` URL

method for every request is POST _(note that some is originally used by weatherCloud with GET but everything work as POST)._

Needed headers are:
```json
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        "cookie": "optionnal for logged route - session cookie"
    },
```

the data is passed either as urlencoded or in the request body. This will be precised for every endpoints.

The return structure shown bellow often show **optionnal** data depending on the station it may not show everything, this means it's possible (though unlikely) I've missed a possible rare return.

**Device and METARS situation**

WeatherCloud support METARS station (data from airports), the ID format is different (see **WeatherCLoud IDs**). WeatherCloud is **NOT** the best service for METARS, you can get some much more detailled infos elsewhere, but since this is all at the same place it can be usefull.

On url with device (eg `/device/value`), you need to replace device by metar (eg `/metar/value`). this is supported for most of the device routes, unsupported route will be announced.

**WeatherCLoud IDs**

Station ID are of format of ten numbers (eg. `1482436856`).

For metars it's the OACI code (four letters) (eg. `LSGG` for geneva).

**Rate limiting**

WeatherCloud seems to rate limit requests (which is understandable). you should not make to many request for nothing **this can be considered as DOS**. free station update every 10 minutes and paid each minutes. You should avoid making more request.

## Defined endpoints

This is a complete documentation for every defined endpoint.

Use the table of content to navigate (seriously), all return infos are detailled so its **BIG**.

### `/signin`
**Login to an account.**

**Request**

Full URL: `app.weathercloud.net/signin`

**DATA:** in body - Formdata (URLSearchParams):
```json
{
    "entity": "YOUR_MAIL",
    "password": "YOUR_PASSWORD",
    "remeberMe": 0 | 1
}
```

**Response**

Status:
- 200 Not successfull (yes very logical)
- 302 when logged

Headers:
- set-cookie: Your session cookie

### `/device/values`
**Get actual weather data for a station.**

**Request**

Full URL: `app.weathercloud.net/device/values?code={id}`

**DATA:** in URL - urlEncoded: 
```json
"code": "DEVICE_ID"
```

**Response**

Body:
```json
{
    // included most of the time
    "epoch": "number", // time of the last update (unix seconds)
    "bar": "number", // pressure (hPa)
    "wdir": "number", // wind direction (degree)
    "wdiravg": "number", // average wind direction (degree)
    "wspd": "number", // wind speed (m/s)
    "wspdhi": "number", // wind gust (m/s)
    "wspdavg": "number", // average wind speed (m/s)
    "rainrate": "number", // rainrate (mm/hour)
    "rain": "number", // rained today (mm)
    "temp": "number", // temperature (°C)
    "hum": "number", // humidity (%)
    "dew": "number", // dew point (°C)
    
    // optional
    "temp02": "number", // secondary temperature (°C) (not sure what nor why dosen't seems to be used on original website)
    "hum02": "number",  // secondary humidity (%) (also not used on website)
    "chill": "number", // wind-chill or how much colder will it feels w/ wind
    "heat": "number", // heat or how much will it feel hotter with humidity -- not included by every stations
    "thw": "number", // Temperature-Humidity-Wind Index or feel like
    "solarrad": "number", // solar radiation (W/m²)
    "uvi": "number", // UV index
    "vis": "number", // visibility (100 of meters)

    // logged owner only (possible to get from devices list as a guest)
    "tempin": "number", // Inside temperature (°C)
    "humin": "number", // Inside humidity (%)
    "dewin": "number", // Inside dew point (°C)
    "heatin": "number", // inside heat value
}
```

### `/device/stats`
**Get weather statistics for a station.**

**Request**

Full URL: `app.weathercloud.net/device/stats`

**DATA:** Request body: 
```json 
"code": "DEVICE_ID",
```

**Response**
```json
{ // data type similar to weather_data
    "last_update": "number", // time of the last update (unix seconds)
    "temp_current": [
        "number", // time of measure (unizx seconds)
        "number", // value measured (refer to "device/stats" to see unit etc.)
    ],
    "temp_day_max": [
        "number", // will not repeat for each one, you get the idea
        "number"
    ],
    "temp_day_min": [
        "number", 
        "number"
    ],
    "temp_month_max": [
        "number", 
        "number"
    ],
    "temp_month_min": [
        "number", 
        "number"
    ],
    "temp_year_max": [
        "number", 
        "number"
    ],
    "temp_year_min": [
        "number", 
        "number"
    ],

    "dew_current": [
        "number", 
        "number"
    ],
    "dew_day_max": [
        "number", 
        "number"
    ],
    "dew_day_min": [
        "number", 
        "number"
    ],
    "dew_month_max": [
        "number", 
        "number"
    ],
    "dew_month_min": [
        "number", 
        "number"
    ],
    "dew_year_max": [
        "number", 
        "number"
    ],
    "dew_year_min": [
        "number", 
        "number"
    ],
    
    "hum_current": [
        "number", 
        "number"
    ],
    "hum_day_max": [
        "number", 
        "number"
    ],
    "hum_day_min": [
        "number", 
        "number"
    ],
    "hum_month_max": [
        "number", 
        "number"
    ],
    "hum_month_min": [
        "number", 
        "number"
    ],
    "hum_year_max": [
        "number", 
        "number"
    ],
    "hum_year_min": [
        "number", 
        "number"
    ],
    
    "bar_current": [
        "number", 
        "number"
    ],
    "bar_day_max": [
        "number", 
        "number"
    ],
    "bar_day_min": [
        "number", 
        "number"
    ],
    "bar_month_max": [
        "number", 
        "number"
    ],
    "bar_month_min": [
        "number", 
        "number"
    ],
    "bar_year_max": [
        "number", 
        "number"
    ],
    "bar_year_min": [
        "number", 
        "number"
    ],
    
    "wspdavg_current": [
        "number", 
        "number"
    ],
    "wspdavg_day_max": [
        "number", 
        "number"
    ],
    "wspdavg_day_min": [
        "number", 
        "number"
    ],
    "wspdavg_month_max": [
        "number", 
        "number"
    ],
    "wspdavg_month_min": [
        "number", 
        "number"
    ],
    "wspdavg_year_max": [
        "number", 
        "number"
    ],
    "wspdavg_year_min": [
        "number", 
        "number"
    ],
    
    "wspdhi_current": [
        "number", 
        "number"
    ],
    "wspdhi_day_max": [
        "number", 
        "number"
    ],
    "wspdhi_day_min": [
        "number", 
        "number"
    ],
    "wspdhi_month_max": [
        "number", 
        "number"
    ],
    "wspdhi_month_min": [
        "number", 
        "number"
    ],
    "wspdhi_year_max": [
        "number", 
        "number"
    ],
    "wspdhi_year_min": [
        "number", 
        "number"
    ],
    
    "wdiravg_current": [
        "number", 
        "number"
    ],
    "wdiravg_day_max": [
        "number", 
        "number"
    ],
    "wdiravg_day_min": [
        "number", 
        "number"
    ],
    "wdiravg_month_max": [
        "number", 
        "number"
    ],
    "wdiravg_month_min": [
        "number", 
        "number"
    ],
    "wdiravg_year_max": [
        "number", 
        "number"
    ],
    "wdiravg_year_min": [
        "number", 
        "number"
    ],

    "rain_current": [
        "number", 
        "number"
    ],
    "rain_day_max": [
        "number", 
        "number"
    ],
    "rain_day_total": [
        "number", 
        "number"
    ],
    "rain_month_max": [
        "number", 
        "number"
    ],
    "rain_month_total": [
        "number", 
        "number"
    ],
    "rain_year_max": [
        "number", 
        "number"
    ],
    "rain_year_total": [
        "number", 
        "number"
    ],
    
    // optional
    "wspd_current": [
        "number", 
        "number"
    ],
    "wspd_day_max": [
        "number", 
        "number"
    ],
    "wspd_day_min": [
        "number", 
        "number"
    ],
    "wspd_month_max": [
        "number", 
        "number"
    ],
    "wspd_month_min": [
        "number", 
        "number"
    ],
    "wspd_year_max": [
        "number", 
        "number"
    ],
    "wspd_year_min": [
        "number", 
        "number"
    ],
    
    "rainrate_current": [
        "number", 
        "number"
    ],
    "rainrate_day_max": [
        "number", 
        "number"
    ],
    "rainrate_day_min": [
        "number", 
        "number"
    ],
    "rainrate_month_max": [
        "number", 
        "number"
    ],
    "rainrate_month_min": [
        "number", 
        "number"
    ],
    "rainrate_year_max": [
        "number", 
        "number"
    ],
    "rainrate_year_min": [
        "number", 
        "number"
    ],

    "solarrad_current": [
        "number", 
        "number"
    ],
    "solarrad_day_max": [
        "number", 
        "number"
    ],
    "solarrad_day_hours": [
        "number", 
        "number"
    ],
    "solarrad_month_max": [
        "number", 
        "number"
    ],
    "solarrad_month_hours": [
        "number", 
        "number"
    ],
    "solarrad_year_max": [
        "number", 
        "number"
    ],
    "solarrad_year_hours": [
        "number", 
        "number"
    ],
    
    "uvi_current": [
        "number", 
        "number"
    ],
    "uvi_day_max": [
        "number", 
        "number"
    ],
    "uvi_day_min": [
        "number", 
        "number"
    ],
    "uvi_month_max": [
        "number", 
        "number"
    ],
    "uvi_month_min": [
        "number", 
        "number"
    ],
    "uvi_year_max": [
        "number", 
        "number"
    ],
    "uvi_year_min": [
        "number", 
        "number"
    ],
    
    "chill_current": [
        "number", 
        "number"
    ],
    "chill_day_max": [
        "number", 
        "number"
    ],
    "chill_day_min": [
        "number", 
        "number"
    ],
    "chill_month_max": [
        "number", 
        "number"
    ],
    "chill_month_min": [
        "number", 
        "number"
    ],
    "chill_year_max": [
        "number", 
        "number"
    ],
    "chill_year_min": [
        "number", 
        "number"
    ],
    
    "heat_current": [
        "number", 
        "number"
    ],
    "heat_day_max": [
        "number", 
        "number"
    ],
    "heat_day_min": [
        "number", 
        "number"
    ],
    "heat_month_max": [
        "number", 
        "number"
    ],
    "heat_month_min": [
        "number", 
        "number"
    ],
    "heat_year_max": [
        "number", 
        "number"
    ],
    "heat_year_min": [
        "number", 
        "number"
    ],
    
    // visibility (for some reason divided by 100)
    "vis_current": [
        "number", 
        "number"
    ],
    "vis_day_max": [
        "number", 
        "number"
    ],
    "vis_day_min": [
        "number", 
        "number"
    ],
    "vis_month_max": [
        "number", 
        "number"
    ],
    "vis_month_min": [
        "number", 
        "number"
    ],
    "vis_year_max": [
        "number", 
        "number"
    ],
    "vis_year_min": [
        "number", 
        "number"
    ],

    // logged only
    "tempin_current": [
        "number", 
        "number"
    ],
    "tempin_day_max": [
        "number", 
        "number"
    ],
    "tempin_day_min": [
        "number", 
        "number"
    ],
    "tempin_month_max": [
        "number", 
        "number"
    ],
    "tempin_month_min": [
        "number", 
        "number"
    ],
    "tempin_year_max": [
        "number", 
        "number"
    ],
    "tempin_year_min": [
        "number", 
        "number"
    ],
    
    "humin_current": [
        "number", 
        "number"
    ],
    "humin_day_max": [
        "number", 
        "number"
    ],
    "humin_day_min": [
        "number", 
        "number"
    ],
    "humin_month_max": [
        "number", 
        "number"
    ],
    "humin_month_min": [
        "number", 
        "number"
    ],
    "humin_year_max": [
        "number", 
        "number"
    ],
    "humin_year_min": [
        "number", 
        "number"
    ],

    "dewin_current": [
        "number", 
        "number"
    ],
    "dewin_day_max": [
        "number", 
        "number"
    ],
    "dewin_day_min": [
        "number", 
        "number"
    ],
    "dewin_month_max": [
        "number", 
        "number"
    ],
    "dewin_month_min": [
        "number", 
        "number"
    ],
    "dewin_year_max": [
        "number", 
        "number"
    ],
    "dewin_year_min": [
        "number", 
        "number"
    ],
    
    "heatin_current": [
        "number", 
        "number"
    ],
    "heatin_day_max": [
        "number", 
        "number"
    ],
    "heatin_day_min": [
        "number", 
        "number"
    ],
    "heatin_month_max": [
        "number", 
        "number"
    ],
    "heatin_month_min": [
        "number", 
        "number"
    ],
    "heatin_year_max": [
        "number", 
        "number"
    ],
    "heatin_year_min": [
        "number", 
        "number"
    ]
}
```

### `/device/wind`
**Get wind history** not sure exactly what the returned data represent, it's enough to (folowing weatherCloud implementation) get wind sector percentage and speed.

**Request**

Full URL: `app.weathercloud.net/device/wind?code={id}`

**DATA:** in URL - urlEncoded: 
```json
"code": "DEVICE_ID"
```

**Response**
```json
[
    { // data that you will get from the wind endpoint, not sure what it's representing, can be used to get wind sector percentage and speed
        "date": "number", // unix time of the data
        "values": {
            "sum": "number", // not sure what is it
            "scale": [
                "number",
                "..."
            ] // scale[0] represent calm wind, others wind (force?)
        } 
    } // repeated 16 times, each is a wind cardinal (N, NNE, NE, etc.)
]
```

### `/device/info`
**Get device general infos**

**Request**

Full URL: `app.weathercloud.net/device/info/{id}`

**DATA:** in URL 
```json
"DEVICE_ID"
```

**Response**
```json
{
    "device": {
        "account": "number | string", // not sure what is this
        "status": "string", // neither for that
        "city": "string", // city
        "image": "null | string", // optional url of device banner image
        "isWebcam": "boolean", // is there a webcam
        "favorite": "boolean", // is fav (false when logged out)
        "social": "boolean", // is there a twitter account linked
        "altitude": "string", // elevation of the station
        "update": "number" // seconds since last update
    },
    "values": { // some of the devices weather values but not all - in string format because.
        "temp": "string",
        "hum": "string",
        "dew": "string",
        "wspdavg": "string",
        "wdiravg": "string",
        "bar": "string",
        "rain": "string",
        "rainrate": "string",
        "solarrad": "string",
        "uvi": "string",
        "vis": "string"
    }
}
```

### `/device/ajaxprofile`
**Get owner and station profile infos.**

**Request**

Full URL: `app.weathercloud.net/device/ajaxprofile`

**DATA:** Request body: 
```json 
"d": "DEVICE_ID"
```

**Response**
```json
{
    // METAR and Devices
    "followers": { // follower of this station
        "number": "string" // (this is a number in a string because yes)
    },
    // Devices only
    "observer": { // owner infos
        "name": "string",
        "nickname": "string",
        "company": "string"
    },
    "device": { // device informations
        "brand": "string",
        "model": "string"
    }
}
```

### `/device/ajaxdevicestats`
**Get station statistics**

**Login required** for any station, maybe if owned station give some additionals infos (battery?)

**Request**

Full URL: `app.weathercloud.net/device/ajaxdevicestats`

**DATA:** Request body: 
```json 
"device": "DEVICE_ID"
```

**Response**
```json
[
    {
        "date": "number", // day (unix seconds)
        "value": "number" // uptime (%)
        // some other things for battery/current maybe? - only for compatible and owned station
    } // repeated 31 times for each days
]
```

### `/device/ajaxupdatedate`
**Get last update info**

**Request**

Full URL: `app.weathercloud.net/device/ajaxupdatedate`

**DATA:** Request body: 
```json 
"d": "DEVICE_ID"
```
**Response**
```json
{
    "update": "number", // time elapsed since the last update (seconds)
    "server_time": "number", // server time when requested (unix seconds)
    "status": "string", // "2" is normal "0" is a special state where update is the only thing worth displaying on website. Others code means some kind of errors
}
```

### `/device/ajaxfavorite`
**Follow a device**

**Login required**

**Request**

Full URL: `app.weathercloud.net/device/ajaxfavorite`

**DATA:** Request body: 
```json 
{
    "device": "DEVICE_ID",
    "delete":  0 | 1 
}
```

**Response**
```json
{
    "type": "add" | "delete", // type of action
    "success": "boolean",
    "favorites": 0 | 1 // old favorite status (0 = false; 1 = true)
}
```

### `/device/ajaxfavoritesnumber`
**Get device favorite status**

**Login required**

**Request**

Full URL: `app.weathercloud.net/device/ajaxfavoritesnumber`

**DATA:** Request body: 
```json 
"d": "DEVICE_ID"
```

**Response**
```json
"0" | "1"
```

### `/page/popular`
**Get most viewed devices other a period**

**Request**

Full URL: `app.weathercloud.net/page/popular/country/{countryCode}/period/{period}`

**DATA:** in URL: 
```json
{
    "countryCode": "string", // example FR for France
    "period": "day" | "week" | "month" | "year" | "all" // period for counting popularity
}
```
**Response**
```json
[
    {
        "type": "device|metar",
        "code": "weatherCloudId", // station ID
        "name": "string", // station name

        // position of the station
        "city": "string",
        "latitude": "string",
        "longitude": "string",
        "elevation": "string", // elevation in decimeters (meters*10)

        "image": "null | string", // optional url of device banner image
        "account": "number | string", // not sure what is this
        "isFavorite": "boolean", // with account cookie tell you if you favorited this station
        "update": "number", // seconds elapsed since last update
        "values": {
            "...": "..."
            // just like /device/values return but as string for some reason
        },
        "status": "string",
        "data": "string" // number of views
    }
    // repeated for each devices
]
```

### `/page/followers`
**Get most followed devices**

**Request**

Full URL: `app.weathercloud.net/page/followers/country/{countryCode}`

**DATA:** in URL: 
```json
{
    "countryCode": "string", // example FR for France
}
```
**Response**
```json
[
    {
        "type": "device|metar",
        "code": "weatherCloudId", // station ID
        "name": "string", // station name

        // position of the station
        "city": "string",
        "latitude": "string",
        "longitude": "string",
        "elevation": "string", // elevation in decimeters (meters*10)

        "image": "null | string", // optional url of device banner image
        "account": "number | string", // not sure what is this
        "isFavorite": "boolean", // with account cookie tell you if you favorited this station
        "update": "number", // seconds elapsed since last update
        "values": {
            "...": "..."
            // just like /device/values return but as string for some reason
        },
        "status": "string",
        "data": "string" // number of views
    }
    // repeated for each devices
]
```

### `/page/newest`
**Get newest devices**

**Request**

Full URL: `app.weathercloud.net/page/newest/country/{countryCode}`

**DATA:** in URL: 
```json
{
    "countryCode": "string", // example FR for France
}
```
**Response**
```json
[
    {
        "type": "device|metar",
        "code": "weatherCloudId", // station ID
        "name": "string", // station name

        // position of the station
        "city": "string",
        "latitude": "string",
        "longitude": "string",
        "elevation": "string", // elevation in decimeters (meters*10)

        "image": "null | string", // optional url of device banner image
        "account": "number | string", // not sure what is this
        "isFavorite": "boolean", // with account cookie tell you if you favorited this station
        "update": "number", // seconds elapsed since last update
        "values": {
            "...": "..."
            // just like /device/values return but as string for some reason
        },
        "status": "string",
        "data": "string" // number of views
    }
    // repeated for each devices
]
```

### `/page/coordinates`
**Get nearest station from coordinate**

**Request**

Full URL: `app.weathercloud.net/page/coordinates/latitude/{lat}/longitude/{lon}/distance/{radius}`

**DATA:** in URL: 
```json
{
    "lat": "LATITUDE",
    "lon": "LONGITUDE",
    "radius": "RADIUS OF SEARCH (KM)"
}
```
**Response**
```json
[
    {
        "type": "device|metar",
        "code": "weatherCloudId", // station ID
        "name": "string", // station name

        // position of the station
        "city": "string",
        "latitude": "string",
        "longitude": "string",
        "elevation": "string", // elevation in decimeters (meters*10)

        "image": "null | string", // optional url of device banner image
        "account": "number | string", // not sure what is this
        "isFavorite": "boolean", // with account cookie tell you if you favorited this station
        "update": "number", // seconds elapsed since last update
        "values": {
            "...": "..."
            // just like /device/values return but as string for some reason
        },
        "status": "string",
        "data": "string" // number of views
    }
    // repeated for each devices
]
```

### `/page/own`
**Get owned or favorite devices**

**Login required*

**Request**

Full URL: `app.weathercloud.net/page/own`

**DATA:** none

**Response**
```json 
{
    "favorites": [ // favorite devices list
        {
            "type": "device|metar",
            "code": "weatherCloudId", // station ID
            "name": "string", // station name

            // position of the station
            "city": "string",
            "latitude": "string",
            "longitude": "string",
            "elevation": "string", // elevation in decimeters (meters*10)

            "image": "null | string", // optional url of device banner image
            "account": "number | string", // not sure what is this
            "isFavorite": "boolean", // with account cookie tell you if you favorited this station
            "update": "number", // seconds elapsed since last update
            "values": {
                "...": "..."
                // just like /device/values return but as string for some reason
            },
            "status": "string",
            "data": "string" // number of views
        }
        // repeated for each devices
    ],
    "devices": [ // owned devices list
        "..."
        // just like favorites
    ]
}
```


## Known endpoints

This is a list of endpoints that are known, but need to work on them to know how to use them.

Here is included as much information as possible of what's know.

### `/device/evolution`
**Get graph data history**

Full URL: `app.weathercloud.net/device/evolution`

**DATA:** Request body: 
```json 
{
    "device":"DEVICE_ID",
    "variable":"101/201/541/641/701/801/811/1001/1101/6011/6501 (and maybe more)",
    "period":"day/week/month",
}
```

### `/map/metars`
**Map related**

### `/map/bgdevices`
**Map related**

### `/signup`
**Register an account**

This will stay forever not defined more, creating an account is:
1) Anoying and difficult (email verification).
2) Not of any use for legitimate use (you never need more than one account, so you can create it manually).

### `/page/lastviews`
**History of viewed device**

Probably follow the pattern of [/page/own](#pageown).