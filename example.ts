import { login, getStationStatus, getNearest, getTop, getOwn, getWind, fetchWeather } from ".";

async function fetchAndLogStatus() {
    const loggingstatus = await login("wadomag381@shaflyn.com", "azerty", true); // testing account made with garbage mail
    console.log(loggingstatus);
    if (!loggingstatus) return;
    // console.log(await getStationStatus("5305914082"));
    console.log((await getOwn()).favorites);
}

async function getTopStations() {
    const stations = await getTop("popular", "FR", "day");
    if (Array.isArray(stations)) {
        console.log(stations[0])
        console.log(stations.length)
    }
}

async function testWind() {
    const wind = await getWind("4172447340");
    console.log(wind)
}

testWind()
