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
  - [Roadmap / todo list - what's still to be done](#roadmap--todo-list---whats-still-to-be-done)
  - [API documentation](#api-documentation)
  - [License](#license)
  - [Links](#links)

## Instalation

Install necessary dependencies (typescript)

```bash
npm install
```

## Usage

Basically, run the code the way you prefer, or include it in your project. Then follow example from `./example.ts` and call the function `fetchWeather(id)` imported from `./index.ts`.

more detailed docs incoming

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
 - ⏳ Computation of various data based on received values including:
   - Clouds height 
   - Text average time 
   - Feels like temperature
   - Text time of last update
   - Minutes elapsed since last update
   - Server last update time
   - Maybe more ?
 - ✔️ Data protected by login
 - ✔️ Statistics (basic history)
 - ✔️ Wind history
 - ✔️ Owned / favourite devices
 - ✔️ devices listing based on top, distance and more
 - ❌ own history
 - ❌ graph data
 - ❌ Maybe more ?

## Roadmap / todo list - what's still to be done

- [x] Define the last known url endpoints (enough for V)
- [x] Create the method to utilize these endpoints
- [ ] Big code cleanup
- [ ] Search for unfound endpoints and restart these stages if needed
- [ ] Make a real documentation (Actually WIP)
- [ ] Make an NPM module ?

## API documentation

API docs are now separate, you can find them in `api-documentation.md`

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Links

- 📡[Github](https://github.com/maxime-mrl/weathercloud-api)