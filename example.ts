import fetchWeather from ".";

async function fetchAndLogWeather() {
    const data = await fetchWeather("5305914082");
    console.log(data);
}
fetchAndLogWeather();