function newWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(new Date());
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "04odeba41247484f90fd624b3c7at438";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      const responseData = {
        data: {
          city: data.name,
          temperature: {
            current: data.main.temp,
            humidity: data.main.humidity,
          },
          wind: {
            speed: data.wind.speed,
          },
          condition: {
            description: data.weather[0].description,
            icon_url: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
          },
        },
      };

      newWeather(responseData);
      getForecast(city);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#cityInput");

  searchCity(searchInput.value);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function getForecast(city) {
  let apiKey = "04odeba41247484f90fd624b3c7at438";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon={lon}&lat={lat}&key={key}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Forecast data not available");
      }
      return response.json();
    })
    .then((data) => {
      displayForecast(data);
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
}

function displayForecast(response) {
  let forecastHtml = "";

  response.list.forEach(function (forecast, index) {
    if (index < 5) {
      forecastHtml += `<div class="weather-forecast-day">
          <div class="weather-forecast-date">${formatDay(forecast.dt)}</div>
          <img src="http://openweathermap.org/img/wn/${
            forecast.weather[0].icon
          }.png" class="weather-forecast-icon" />
          <div class="weather-forecast-temperatures">
            <div class="weather-forecast-temperature">
              <strong>${Math.round(forecast.main.temp_max)}º</strong>
            </div>
            <div class="weather-forecast-temperature">${Math.round(
              forecast.main.temp_min
            )}º</div>
          </div>
        </div>`;
    }
  });

  let forecastElement = document.querySelector("#weatherData");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Phalaborwa");
