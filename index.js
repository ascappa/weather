const cities = ["London, UK", "Rome, Italy", "Berlin, Germany", "Barcelona, Spain"];
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYXNjYXBwYSIsImEiOiJjbHVhY3hmZTAwZzU5MmttbWx0MnQycmlyIn0.AEkF1nFtCKq160tgyHls0Q";
const cityDateEl = document.getElementById("city-date");
const cityTimeEl = document.getElementById("city-time");
const cityNameEl = document.getElementById("city-name");
const cityWeatherNameEl = document.querySelector("#city-weather .weather");
const citySearchFormEl = document.getElementById("citySearchForm");
const cityTemperatureEl = document.querySelector("#city-weather .temperature");
const cityListEl = document.getElementById("city-list");
let timeId;
timeId = setInterval(() => {
  const currentDate = new Date();
  cityTimeEl.textContent = currentDate.toLocaleTimeString();
}, 1000);
cities.forEach((city) => {
  const cityEl = document.createElement("li");
  cityEl.textContent = city;
  cityListEl.append(cityEl);
});
citySearchFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
  const formData = new FormData(e.target);
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${formData.get(
      "q"
    )}.json?access_token=${MAPBOX_TOKEN}&limit=5&types=place`
  );
  const cities = await res.json();
  const [lon, lat] = cities.features[0].center;
  let locale = "it-IT";
  fetchWeather(lon, lat).then((data) => {
    cityWeatherNameEl.textContent = data.weather[0].main;
    cityTemperatureEl.textContent = Math.round(data.main.temp) + "°";
    cityNameEl.textContent = formData.get("q")
    locale = data.sys.country.toLowerCase() + "-" + data.sys.country;
    console.log(locale)
  });
  clearInterval(timeId);
  timeId = setInterval(() => {
    const currentDate = new Date();
    cityTimeEl.textContent = currentDate.toLocaleTimeString(locale);
  }, 1000); }
  catch {
    citySearchFormEl["q"].placeholder = "Città non valida"
  }
  citySearchFormEl["q"].value = "";
});
citySearchFormEl["q"].addEventListener("input", async (e) => {
  console.log(e.target.value);
  cityListEl.innerHTML = "";
  if (e.target.value.length > 0) {
    citySearchFormEl["q"].placeholder = "Cerca una città..."
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.target.value}.json?access_token=${MAPBOX_TOKEN}&limit=5&types=place`
    );
    const cities = await res.json();
    console.log(cities);
    const cityProps = cities.features.map((city) => ({
      place_name: city.place_name,
      lon: city.center[0],
      lat: city.center[1],
    }));
    cityProps.forEach((city) => {
      cityListEl.innerHTML += `<option value="${city.place_name}"></option>`;
    });
  } else {
    cities.forEach((city) => {
      cityListEl.innerHTML += `<option value="${city}"></option>`;
    });
  }
});

const currentDate = new Date();
cityDate = currentDate.toLocaleDateString();
cityDateEl.textContent = cityDate;

async function fetchWeather(lon = 70, lat = 70) {
  const resW = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&limit=5&units=metric&appid=2e1c73811fbdb77294acb41f066d1786"
  );
  const dataW = await resW.json();
  console.log(dataW);
  return dataW;
}
fetchWeather().then((data) => {
  cityWeatherNameEl.textContent = data.weather[0].main;
  cityTemperatureEl.textContent = Math.round(data.main.temp) + "°";
});
