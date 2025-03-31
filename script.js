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
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png">
                <h6>${weatherItem.weather[0].description}</h6>
            </div>`;
  } else {
    return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png">
                <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                <h6>Humidity: ${weatherItem.main.humidity}%</h6>
            </li>`;
  }
};

const getWeatherDetails = async (cityName, latitude, longitude) => {
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
  showLoading();
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    hideLoading();
    weatherCardsDiv.innerHTML = "";
    currentWeatherDiv.innerHTML = createWeatherCard(cityName, data.list[0], 0);
    data.list.slice(1, 6).forEach((weatherItem, index) => {
      weatherCardsDiv.innerHTML += createWeatherCard(cityName, weatherItem, index + 1);
    });
  } catch {
    hideLoading();
    alert("Failed to fetch weather data!");
  }
};

searchButton.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeatherDetails(city, 13.0827, 80.2707); // Default to Chennai
});



