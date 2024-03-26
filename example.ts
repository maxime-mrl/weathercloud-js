import { login, getStationStatus, getNearest } from ".";

async function fetchAndLogStatus() {
    const loggingstatus = await login("wadomag381@shaflyn.com", "azerty", true); // testing account made with garbage mail
    console.log(loggingstatus);
    if (!loggingstatus) return;
    console.log(await getStationStatus("5305914082"));
}

async function findNearest() {
    const stations = await getNearest(46.161999, 6.177229, 10);
    console.log(stations[0])
    console.log(stations)
}

findNearest();
