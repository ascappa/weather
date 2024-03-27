const cityDateEl = document.getElementById("city-date");
const cityTimeEl = document.getElementById("city-time");
const cityNameEl = document.getElementById("city-name");
const cityWeatherNameEl = document.querySelector("#city-weather p")
const currentDate = new Date();
cityDate = currentDate.toLocaleDateString();
cityDateEl.innerHTML = cityDate;
async function fetchWeather(cityName = "Rome") {
  const resGeo = await fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=2e1c73811fbdb77294acb41f066d1786"
  );
  const dataGeo = await resGeo.json()
  const { lat, lon } = dataGeo[0];
  console.log(dataGeo)
  const resW = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=2e1c73811fbdb77294acb41f066d1786"
  );
  const dataW = await resW.json()
  console.log(dataW)
  return dataW
}
fetchWeather().then(data => {
  cityWeatherNameEl.innerHTML = data.weather[0].main
})
setInterval(() => {
  const currentDate = new Date();
  cityTimeEl.innerHTML = currentDate.toLocaleTimeString();
  console.log("hi");
}, 1000);


