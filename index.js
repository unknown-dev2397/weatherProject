const getElement = (selector) => document.querySelector(selector);

const tempElement = getElement(".weather__temp");
const cityElement = getElement(".weather__city");
const searchInput = getElement(".search__input");
const searchBtn = getElement(".search__button");
const windElement = getElement(".detail__value.wind");
const humidityElement = getElement(".detail__value.humidity");
const weatherIcon = getElement(".weather__icon");
const weatherCardDetails = getElement(".weather");

const weatherIcons = {
  clear: "./images/clear.png",
  clouds: "./images/clouds.png",
  drizzle: "./images/drizzle.png",
  haze: "./images/haze.png",
  mist: "./images/mist.png",
  rain: "./images/rain.png",
  snow: "./images/snow.png",
  wind: "./images/wind.png",
};

const updateUI = (data, errorMessage = "") => {
  if (!data) {
    cityElement.textContent = errorMessage || "City not found";
    tempElement.innerHTML = "--°C";
    windElement.textContent = "-- km/h";
    humidityElement.textContent = "--%";
    weatherIcon.src = weatherIcons.clear;
    weatherCardDetails.style.display = "block";
    return;
  }

  const { name, main, wind, weather } = data;

  cityElement.textContent = name || "Unknown";
  tempElement.innerHTML = main ? `${Math.round(main.temp)}&deg;C` : "--°C";
  windElement.textContent = wind ? `${wind.speed} km/h` : "-- km/h";
  humidityElement.textContent = main ? `${main.humidity}%` : "--%";
  weatherIcon.src = weather
    ? weatherIcons[weather[0].main.toLowerCase()] || weatherIcons.clear
    : weatherIcons.clear;

  weatherCardDetails.style.display = "block";
};

const fetchWeather = async (city) => {
  if (!city) return;

  const apiKey = "d08606ce6e6872a840f2ecebb2d1bfc1";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    updateUI(data);
  } catch (error) {
    console.error(error.message);
    updateUI(null, error.message);
  } finally {
    searchInput.value = "";
    searchInput.focus();
  }
};

const handleSearch = (event) => {
  if (event.type === "click" || event.key === "Enter") {
    const city = searchInput.value.trim();
    if (city) fetchWeather(city);
  }
};

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", handleSearch);
