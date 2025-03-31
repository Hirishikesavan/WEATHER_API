const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const loadingSpinner = document.querySelector(".loading-spinner");

const API_KEY = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key

const createWeatherCard = (cityName, weatherItem, index) => {
    let date = weatherItem.dt_txt.split(" ")[0];
    let temp = (weatherItem.main.temp - 273.15).toFixed(2);
    let wind = weatherItem.wind.speed;
    let humidity = weatherItem.main.humidity;
    let icon = weatherItem.weather[0].icon;
    let description = weatherItem.weather[0].description;

    if (index === 0) {
        return `
            <div class="details">
                <h2>${cityName} (${date})</h2>
                <h6>Temperature: ${temp}°C</h6>
                <h6>Wind: ${wind} M/S</h6>
                <h6>Humidity: ${humidity}%</h6>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="weather-icon">
                <h6>${description}</h6>
            </div>
        `;
    } else {
        return `
            <li class="card">
                <h3>(${date})</h3>
                <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="weather-icon">
                <h6>Temp: ${temp}°C</h6>
                <h6>Wind: ${wind} M/S</h6>
                <h6>Humidity: ${humidity}%</h6>
            </li>
        `;
    }
};

const fetchWeather = (url, cityName) => {
    showLoading();
    fetch(url)
        .then(response => response.json())
        .then(data => {
            hideLoading();
            let uniqueDays = [];
            let forecast = data.list.filter(item => {
                let date = new Date(item.dt_txt).getDate();
                if (!uniqueDays.includes(date)) {
                    uniqueDays.push(date);
                    return true;
                }
                return false;
            });

            cityInput.value = "";
            currentWeatherDiv.innerHTML = createWeatherCard(cityName, forecast[0], 0);
            weatherCardsDiv.innerHTML = forecast.slice(1).map((item, i) => createWeatherCard(cityName, item, i)).join("");
        })
        .catch(() => {
            hideLoading();
            alert("Error fetching weather data!");
        });
};

searchButton.addEventListener("click", () => {
    let city = cityInput.value.trim();
    if (city) fetchWeather(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`, city);
});

locationButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(position => {
        let { latitude, longitude } = position.coords;
        fetchWeather(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`, "Your Location");
    });
});

const showLoading = () => loadingSpinner.style.display = "block";
const hideLoading = () => loadingSpinner.style.display = "none";


