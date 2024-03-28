const cities = ["London, UK", "Rome, Italy", "Berlin, Germany", "Barcelona, Spain"];
const weekDays = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"]
const WEATHER_KEY = "2e1c73811fbdb77294acb41f066d1786";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYXNjYXBwYSIsImEiOiJjbHVhY3hmZTAwZzU5MmttbWx0MnQycmlyIn0.AEkF1nFtCKq160tgyHls0Q";
const cityDateEl = document.getElementById("city-date");
const cityTimeEl = document.getElementById("city-time");
const cityNameEl = document.getElementById("city-name");
const cityWeatherNameEl = document.querySelector("#city-weather .weather");
const citySearchFormEl = document.getElementById("citySearchForm");
const cityTemperatureEl = document.querySelector("#city-weather .temperature");
const cityListEl = document.getElementById("city-list");
const cityWeatherIconEl = document.querySelector("#city-weather img");
const dayWeatherEl = document.querySelector("#day-weather ul");
const weekWeatherEl = document.querySelector("#week-weather ul");
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
    fetchWeather(lon, lat).then((data) => {
      const currentDate = new Date();
      cityWeatherNameEl.textContent = data.current.weather[0].main;
      cityTemperatureEl.textContent = Math.round(data.current.temp) + "°";
      cityWeatherIconEl.src = "./assets/" + data.current.weather[0].main.toLowerCase() + ".svg";
      cityWeatherIconEl.alt = data.current.weather[0].main.toLowerCase();
      cityNameEl.textContent = formData.get("q");
      const hoursWeather = data.hourly.slice(0, 5);
      const daysWeather = data.daily.slice(0,5)
      const currentHour = Number(
        currentDate
          .toLocaleTimeString("it-IT", {
            timeZone: data.timezone,
          })
          .split(":")[0]
      );
      const currentDayIndex = currentDate.getDay()
      dayWeatherEl.innerHTML = "";
      weekWeatherEl.innerHTML = ""
      hoursWeather.forEach((hourData, idx) => {
        dayWeatherEl.innerHTML += `<li><img src="${
          "./assets/" + hourData.weather[0].main.toLowerCase() + ".svg"
        }"><p>${((currentHour + idx) % 24).toString().padStart(2, "0") + ":00"}</p><p>${
          Math.round(hourData.temp) + "°"
        }</p></li>`;
      });
      daysWeather.forEach((dayData, idx) => {
        console.log(currentDayIndex)
        const currentWeekDay = weekDays[(currentDayIndex + idx) % 7]
        weekWeatherEl.innerHTML += `<li><p>${currentWeekDay.slice(0, 3)}</p><img src="${
          "./assets/" + dayData.weather[0].main.toLowerCase() + ".svg"
        }"><p>${
          Math.round(dayData.temp) + "°"
        }</p></li>`;
      });
      clearInterval(timeId);
      timeId = setInterval(() => {
        const currentDate = new Date();
        cityTimeEl.textContent = currentDate.toLocaleTimeString("it-IT", {
          timeZone: data.timezone,
        });
      }, 1000);
    });
  } catch {
    citySearchFormEl["q"].placeholder = "Città non valida";
  }
  citySearchFormEl["q"].value = "";
});
citySearchFormEl["q"].addEventListener("input", async (e) => {
  console.log(e.target.value);
  cityListEl.innerHTML = "";
  if (e.target.value.length > 0) {
    citySearchFormEl["q"].placeholder = "Cerca una città...";
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
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`
  );
  const dataW = await resW.json();
  console.log(dataW);
  return dataW;
}
fetchWeather().then((data) => {
  cityWeatherNameEl.textContent = data.current.weather[0].main;
  cityTemperatureEl.textContent = Math.round(data.current.temp) + "°";
});
