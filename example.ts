import { login, getStationStatus, getNearest, getTop } from ".";

async function fetchAndLogStatus() {
    const loggingstatus = await login("wadomag381@shaflyn.com", "azerty", true); // testing account made with garbage mail
    console.log(loggingstatus);
    if (!loggingstatus) return;
    console.log(await getStationStatus("5305914082"));
}

async function getTopStations() {
    const stations = await getTop("popular", "FR", "day");
    if (Array.isArray(stations)) {
        console.log(stations[0])
        console.log(stations.length)
    }
}

getTopStations();
