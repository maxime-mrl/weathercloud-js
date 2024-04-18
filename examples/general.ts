import { login, getStationStatus, getNearest, getTop, getOwn, getWind, getWeather, getStatistics, getInfos, isFavorite, addFavorite, removeFavorite, getProfile, getLastUpdate } from "..";

// TEST IDS
// 4172447340 average station
// 8454216836 station that have almost no data
// 4633478916 station that have alot of data
// 299935953 9-digit id and webcam
// LSGG METAR station

// all examples made here, uncomment the part that interest you
// will improves theses examples later on
(async () => {
    // /* -------------------------- FETCH GENERAL WEATHER ------------------------- */
    // const weather = await getWeather("4172447340");
    // console.log(weather);
    // const profile = await getProfile("LSGG");
    // console.log(profile)
    const update = await getLastUpdate("LSGG");
    console.log(update)

    // /* ------------------------- LOGIN AND LOGGED ROUTES ------------------------ */
    // const loggingstatus = await login("wadomag381@shaflyn.com", "azerty", true); // testing account made with garbage mail
    // console.log(loggingstatus); // log loggin status
    // if (loggingstatus) { // check loggin to continue
    //     // console.log(await getStationStatus("4172447340")); // get uptime statistics
    //     // console.log((await getOwn()).favorites); // get all owned stations
    //     // console.log(await isFavorite("8402540083"));
    //     // console.log(await addFavorite("8402540083"));
    //     // console.log(await isFavorite("8402540083"));
    // }

    // /* ---------------------------- GET TOP STATIONS ---------------------------- */
    // const stations = await getTop("popular", "FR", "day"); // get popular station today in france
    // if (Array.isArray(stations)) { // check if found and log
    //     console.log(stations);
    //     console.log(stations.length);
    // }

    /* -------------------------- GET NEAREST STATIONS -------------------------- */
    // const nearestStations = await getNearest(46.194686, 6.152462, 10);
    // console.log(nearestStations);

    // /* -------------------------------- GET WIND -------------------------------- */
    // const wind = await getWind("4172447340");
    // console.log(wind)

    /* ----------------------------- GET STATISTICS ----------------------------- */
    // const stats = await getStatistics("8454216836"); // device that lacks sensor on the fetchweather will return some data that seems garbage
    // console.log(stats);

    /* -------------------------------- GET INFOS ------------------------------- */
    // const infos = await getInfos("299935953");
    // console.log(infos);
})();
