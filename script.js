const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const loadingSpinner = document.querySelector(".loading-spinner");

const API_KEY = "c7bd508de7cb96aa4ce06b7dde749a49"; // Replace with your OpenWeatherMap API key

const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    return `<div class="details">
              <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
              <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
              <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
              <h6>Humidity: ${weatherItem.main.humidity}%</h6>
            </div>
            <div class="icon">
              <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
              <h6>${weatherItem.weather[0].description}</h6>
            </div>`;
  } else {
    return `<li class="card">
              <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
              <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
              <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
              <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
              <h6>Humidity: ${weatherItem.main.humidity}%</h6>
            </li>`;
  }
};

const getWeatherDetails = (cityName, latitude, longitude) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  showLoading();
  fetch(WEATHER_API_URL)
    .then(response => response.json())
    .then(data => {
      hideLoading();
      cityInput.value = "";
      currentWeatherDiv.innerHTML = "";
      weatherCardsDiv.innerHTML = "";

      data.list.slice(0, 5).forEach((weatherItem, index) => {
        const html = createWeatherCard(cityName, weatherItem, index);
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML("beforeend", html);
        } else {
          weatherCardsDiv.insertAdjacentHTML("beforeend", html);
        }
      });
    })
    .catch(() => {
      hideLoading();
      alert("An error occurred while fetching the weather forecast!");
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;
  const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  showLoading();
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      hideLoading();
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { lat, lon, name } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => hideLoading());
};

searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
