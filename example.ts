import { login, getStationStatus } from ".";

async function fetchAndLogStatus() {
    const loggingstatus = await login("wadomag381@shaflyn.com", "azerty"); // testing account made with garbage mail
    console.log(loggingstatus);
    if (!loggingstatus) return;
    console.log(await getStationStatus("5305914082"));
}
fetchAndLogStatus();
