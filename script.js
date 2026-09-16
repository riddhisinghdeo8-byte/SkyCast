/* =========================================================
   SKYCAST WEATHER DASHBOARD
   Task 4 — Asynchronous JavaScript & RESTful APIs
   Dynamic Weather Animation Edition
========================================================= */


/* ================= DOM ELEMENTS ================= */

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const locationBtn = document.getElementById("locationBtn");
const refreshBtn = document.getElementById("refreshBtn");

const celsiusBtn = document.getElementById("celsiusBtn");
const fahrenheitBtn = document.getElementById("fahrenheitBtn");

const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

const loading = document.getElementById("loading");

const weatherDashboard =
    document.getElementById("weatherDashboard");

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const currentDate =
    document.getElementById("currentDate");

const weatherIcon =
    document.getElementById("weatherIcon");

const weatherCondition =
    document.getElementById("weatherCondition");

const temperature =
    document.getElementById("temperature");

const temperatureUnit =
    document.getElementById("temperatureUnit");

const feelsLike =
    document.getElementById("feelsLike");

const humidity =
    document.getElementById("humidity");

const windSpeed =
    document.getElementById("windSpeed");

const humidityCard =
    document.getElementById("humidityCard");

const windCard =
    document.getElementById("windCard");

const visibility =
    document.getElementById("visibility");

const pressure =
    document.getElementById("pressure");

const uvIndex =
    document.getElementById("uvIndex");

const conditionShort =
    document.getElementById("conditionShort");

const sunrise =
    document.getElementById("sunrise");

const sunset =
    document.getElementById("sunset");

const recentSearches =
    document.getElementById("recentSearches");

const clearRecentBtn =
    document.getElementById("clearRecentBtn");

const lastUpdated =
    document.getElementById("lastUpdated");

const weatherEffects =
    document.getElementById("weatherEffects");


/* ================= APP STATE ================= */

let currentWeatherData = null;

let currentLocation = null;

let temperatureUnitPreference = "C";

let refreshTimer = null;

const RECENT_STORAGE_KEY =
    "skycastRecentCities";


/* ================= WEATHER CODE INFORMATION ================= */

function getWeatherInfo(code) {

    const weatherMap = {

        0: {
            condition: "Clear Sky",
            short: "Clear",
            icon: "☀️"
        },

        1: {
            condition: "Mainly Clear",
            short: "Mostly Clear",
            icon: "🌤️"
        },

        2: {
            condition: "Partly Cloudy",
            short: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            condition: "Overcast",
            short: "Cloudy",
            icon: "☁️"
        },

        45: {
            condition: "Fog",
            short: "Foggy",
            icon: "🌫️"
        },

        48: {
            condition: "Depositing Rime Fog",
            short: "Foggy",
            icon: "🌫️"
        },

        51: {
            condition: "Light Drizzle",
            short: "Drizzle",
            icon: "🌦️"
        },

        53: {
            condition: "Moderate Drizzle",
            short: "Drizzle",
            icon: "🌦️"
        },

        55: {
            condition: "Dense Drizzle",
            short: "Drizzle",
            icon: "🌧️"
        },

        61: {
            condition: "Slight Rain",
            short: "Rain",
            icon: "🌦️"
        },

        63: {
            condition: "Moderate Rain",
            short: "Rain",
            icon: "🌧️"
        },

        65: {
            condition: "Heavy Rain",
            short: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            condition: "Slight Snow",
            short: "Snow",
            icon: "🌨️"
        },

        73: {
            condition: "Moderate Snow",
            short: "Snow",
            icon: "❄️"
        },

        75: {
            condition: "Heavy Snow",
            short: "Heavy Snow",
            icon: "❄️"
        },

        80: {
            condition: "Rain Showers",
            short: "Showers",
            icon: "🌦️"
        },

        81: {
            condition: "Moderate Rain Showers",
            short: "Showers",
            icon: "🌧️"
        },

        82: {
            condition: "Violent Rain Showers",
            short: "Heavy Showers",
            icon: "🌧️"
        },

        95: {
            condition: "Thunderstorm",
            short: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            condition: "Thunderstorm with Hail",
            short: "Thunderstorm",
            icon: "⛈️"
        },

        99: {
            condition: "Thunderstorm with Heavy Hail",
            short: "Thunderstorm",
            icon: "⛈️"
        }

    };


    return weatherMap[code] || {
        condition: "Unknown Weather",
        short: "Unknown",
        icon: "🌤️"
    };

}


/* ================= LOADING ================= */

function showLoading() {

    loading.classList.remove("hidden");

    weatherDashboard.style.opacity = "0.45";

}


function hideLoading() {

    loading.classList.add("hidden");

    weatherDashboard.style.opacity = "1";

}


/* ================= ERROR ================= */

function showError(message) {

    errorText.textContent = message;

    errorMessage.classList.remove("hidden");

}


function hideError() {

    errorMessage.classList.add("hidden");

}


/* ================= DATE ================= */

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* ================= TIME ================= */

function formatTime(timeString) {

    if (!timeString) {
        return "--:--";
    }

    const date = new Date(timeString);

    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* ================= TEMPERATURE CONVERSION ================= */

function celsiusToFahrenheit(celsius) {

    return (celsius * 9 / 5) + 32;

}


function formatTemperature(value) {

    if (temperatureUnitPreference === "F") {

        return Math.round(
            celsiusToFahrenheit(value)
        );

    }

    return Math.round(value);

}


/* ================= GEOLOCATION API ================= */

async function getCityCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {

        throw new Error(
            "Unable to connect to the location service."
        );

    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {

        throw new Error(
            `We couldn't find "${city}". Please check the city name.`
        );

    }

    return data.results[0];

}


/* ================= WEATHER API ================= */

async function getWeatherData(
    latitude,
    longitude
) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,visibility,surface_pressure,uv_index,is_day&daily=sunrise,sunset&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {

        throw new Error(
            "Unable to retrieve live weather data."
        );

    }

    return await response.json();

}


/* ================= DISPLAY WEATHER ================= */

function displayWeather(
    location,
    weatherData
) {

    currentWeatherData = weatherData;

    currentLocation = location;


    const current =
        weatherData.current;


    const weatherInfo =
        getWeatherInfo(current.weather_code);


    /* ---------- LOCATION ---------- */

    cityName.textContent =
        location.name || "Unknown City";


    countryName.textContent =
        [
            location.admin1,
            location.country
        ]
            .filter(Boolean)
            .join(", ");


    /* ---------- DATE ---------- */

    currentDate.textContent =
        formatDate(current.time);


    /* ---------- WEATHER ---------- */

    weatherIcon.textContent =
        weatherInfo.icon;


    weatherCondition.textContent =
        weatherInfo.condition;


    conditionShort.textContent =
        weatherInfo.short;


    /* ---------- TEMPERATURE ---------- */

    updateTemperatureDisplay();


    /* ---------- HUMIDITY ---------- */

    const humidityValue =
        Math.round(
            current.relative_humidity_2m
        );


    humidity.textContent =
        `${humidityValue}%`;


    humidityCard.textContent =
        `${humidityValue}%`;


    /* ---------- WIND ---------- */

    const windValue =
        Math.round(
            current.wind_speed_10m
        );


    windSpeed.textContent =
        `${windValue} km/h`;


    windCard.textContent =
        `${windValue} km/h`;


    /* ---------- VISIBILITY ---------- */

    const visibilityKm =
        current.visibility
            ? (
                current.visibility / 1000
            ).toFixed(1)
            : "--";


    visibility.textContent =
        `${visibilityKm} km`;


    /* ---------- PRESSURE ---------- */

    pressure.textContent =
        current.surface_pressure
            ? `${Math.round(current.surface_pressure)} hPa`
            : "-- hPa";


    /* ---------- UV ---------- */

    uvIndex.textContent =
        current.uv_index !== undefined
            ? current.uv_index.toFixed(1)
            : "--";


    /* ---------- SUNRISE / SUNSET ---------- */

    if (
        weatherData.daily &&
        weatherData.daily.sunrise
    ) {

        sunrise.textContent =
            formatTime(
                weatherData.daily.sunrise[0]
            );

        sunset.textContent =
            formatTime(
                weatherData.daily.sunset[0]
            );

    }


    /* ---------- WEATHER ANIMATION ---------- */

    updateWeatherAtmosphere(
        current.weather_code,
        current.is_day
    );


    /* ---------- RECENT SEARCH ---------- */

    if (location.name) {

        saveRecentCity(
            location.name
        );

    }


    /* ---------- LAST UPDATED ---------- */

    lastUpdated.textContent =
        new Date().toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/* ================= TEMPERATURE DISPLAY ================= */

function updateTemperatureDisplay() {

    if (!currentWeatherData) {
        return;
    }


    const current =
        currentWeatherData.current;


    const mainTemperature =
        formatTemperature(
            current.temperature_2m
        );


    const feelsTemperature =
        formatTemperature(
            current.apparent_temperature
        );


    temperature.textContent =
        mainTemperature;


    feelsLike.textContent =
        `${feelsTemperature}°`;


    temperatureUnit.textContent =
        temperatureUnitPreference === "C"
            ? "°C"
            : "°F";

}


/* =========================================================
   DYNAMIC WEATHER ATMOSPHERE
========================================================= */

function updateWeatherAtmosphere(
    code,
    isDay
) {

    /* Remove previous weather classes */

    document.body.classList.remove(
        "weather-sunny",
        "weather-cloudy",
        "weather-rain",
        "weather-storm",
        "weather-snow",
        "weather-night"
    );


    /* Clear previous effects */

    weatherEffects.innerHTML = "";


    /* ================= NIGHT ================= */

    if (isDay === 0) {

        document.body.classList.add(
            "weather-night"
        );

        createMoon();

        createStars();

    }


    /* ================= SUNNY ================= */

    if (code === 0) {

        if (isDay !== 0) {

            document.body.classList.add(
                "weather-sunny"
            );

            createSun();

        }

        return;

    }


    /* ================= MOSTLY CLEAR ================= */

    if (code === 1) {

        if (isDay !== 0) {

            document.body.classList.add(
                "weather-sunny"
            );

            createSun();

            createClouds(1);

        } else {

            createClouds(1);

        }

        return;

    }


    /* ================= PARTLY CLOUDY ================= */

    if (code === 2) {

        document.body.classList.add(
            "weather-cloudy"
        );

        if (isDay !== 0) {
            createSun();
        }

        createClouds(3);

        return;

    }


    /* ================= FOG ================= */

    if (
        code === 45 ||
        code === 48
    ) {

        document.body.classList.add(
            "weather-cloudy"
        );

        createClouds(2);

        createFog();

        return;

    }


    /* ================= SNOW ================= */

    if (
        code >= 71 &&
        code <= 75
    ) {

        document.body.classList.add(
            "weather-snow"
        );

        createClouds(3);

        createSnow();

        return;

    }


    /* ================= THUNDERSTORM ================= */

    if (
        code >= 95 &&
        code <= 99
    ) {

        document.body.classList.add(
            "weather-storm"
        );

        createClouds(5);

        createRain(85);

        createLightning();

        return;

    }


    /* ================= RAIN ================= */

    if (
        (code >= 51 && code <= 65) ||
        (code >= 80 && code <= 82)
    ) {

        document.body.classList.add(
            "weather-rain"
        );

        createClouds(4);

        let dropCount = 55;

        if (code === 65 || code === 82) {
            dropCount = 90;
        }

        createRain(dropCount);

        return;

    }


    /* ================= CLOUDY ================= */

    if (code === 3) {

        document.body.classList.add(
            "weather-cloudy"
        );

        createClouds(5);

    }

}


/* ================= CREATE SUN ================= */

function createSun() {

    const sun =
        document.createElement("div");

    sun.className =
        "effect-sun";


    const rays =
        document.createElement("div");

    rays.className =
        "sun-rays";


    sun.appendChild(rays);

    weatherEffects.appendChild(sun);

}


/* ================= CREATE MOON ================= */

function createMoon() {

    const moon =
        document.createElement("div");

    moon.className =
        "effect-moon";

    weatherEffects.appendChild(moon);

}


/* ================= CREATE STARS ================= */

function createStars() {

    for (
        let i = 0;
        i < 55;
        i++
    ) {

        const star =
            document.createElement("span");

        star.className =
            "star";


        star.style.left =
            `${Math.random() * 100}%`;


        star.style.top =
            `${Math.random() * 55}%`;


        star.style.animationDelay =
            `${Math.random() * 3}s`;


        star.style.opacity =
            `${0.3 + Math.random() * 0.7}`;


        weatherEffects.appendChild(star);

    }

}


/* ================= CREATE CLOUDS ================= */

function createClouds(count) {

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const cloud =
            document.createElement("div");

        cloud.className =
            "effect-cloud";


        cloud.classList.add(
            `cloud-${(i % 3) + 1}`
        );


        weatherEffects.appendChild(cloud);

    }

}


/* ================= CREATE RAIN ================= */

function createRain(count) {

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const drop =
            document.createElement("span");

        drop.className =
            "raindrop";


        drop.style.setProperty(
            "--x",
            `${Math.random() * 100}%`
        );


        drop.style.setProperty(
            "--height",
            `${15 + Math.random() * 18}px`
        );


        drop.style.setProperty(
            "--duration",
            `${0.45 + Math.random() * 0.45}s`
        );


        drop.style.setProperty(
            "--delay",
            `${Math.random() * 2}s`
        );


        weatherEffects.appendChild(drop);

    }

}


/* ================= CREATE SNOW ================= */

function createSnow() {

    for (
        let i = 0;
        i < 40;
        i++
    ) {

        const snow =
            document.createElement("span");

        snow.className =
            "snowflake";


        snow.textContent =
            Math.random() > 0.5
                ? "❄"
                : "•";


        snow.style.setProperty(
            "--x",
            `${Math.random() * 100}%`
        );


        snow.style.setProperty(
            "--size",
            `${8 + Math.random() * 14}px`
        );


        snow.style.setProperty(
            "--duration",
            `${5 + Math.random() * 7}s`
        );


        snow.style.setProperty(
            "--delay",
            `${Math.random() * 5}s`
        );


        weatherEffects.appendChild(snow);

    }

}


/* ================= CREATE FOG ================= */

function createFog() {

    const fogOne =
        document.createElement("div");

    fogOne.className =
        "fog-layer fog-one";


    const fogTwo =
        document.createElement("div");

    fogTwo.className =
        "fog-layer fog-two";


    weatherEffects.appendChild(fogOne);

    weatherEffects.appendChild(fogTwo);

}


/* ================= CREATE LIGHTNING ================= */

function createLightning() {

    const lightning =
        document.createElement("div");

    lightning.className =
        "lightning-flash";


    weatherEffects.appendChild(
        lightning
    );

}


/* =========================================================
   SEARCH WEATHER
========================================================= */

async function searchWeather(city) {

    const cleanCity =
        city.trim();


    if (!cleanCity) {

        showError(
            "Please enter a city name."
        );

        return;

    }


    try {

        hideError();

        showLoading();


        const location =
            await getCityCoordinates(
                cleanCity
            );


        const weatherData =
            await getWeatherData(
                location.latitude,
                location.longitude
            );


        displayWeather(
            location,
            weatherData
        );


        cityInput.value =
            location.name;


    } catch (error) {

        console.error(error);


        showError(
            error.message ||
            "Unable to load weather data. Please try again."
        );

    } finally {

        hideLoading();

    }

}


/* ================= REFRESH ================= */

async function refreshWeather() {

    if (!currentLocation) {

        return;

    }


    try {

        hideError();

        showLoading();


        const weatherData =
            await getWeatherData(
                currentLocation.latitude,
                currentLocation.longitude
            );


        displayWeather(
            currentLocation,
            weatherData
        );


    } catch (error) {

        showError(
            "Could not refresh the weather right now."
        );

    } finally {

        hideLoading();

    }

}


/* ================= AUTO REFRESH ================= */

function startAutoRefresh() {

    if (refreshTimer) {

        clearInterval(
            refreshTimer
        );

    }


    refreshTimer =
        setInterval(
            refreshWeather,
            10 * 60 * 1000
        );

}


/* =========================================================
   MY LOCATION
========================================================= */

function useMyLocation() {

    if (!navigator.geolocation) {

        showError(
            "Geolocation is not supported by your browser."
        );

        return;

    }


    showLoading();

    hideError();


    navigator.geolocation.getCurrentPosition(

        async position => {

            try {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                const weatherData =
                    await getWeatherData(
                        latitude,
                        longitude
                    );


                /*
                 * Reverse geocoding gives us a
                 * readable city name.
                 */

                const reverseUrl =
                    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`;


                const reverseResponse =
                    await fetch(
                        reverseUrl
                    );


                let location = {
                    name: "Your Location",
                    country: ""
                };


                if (reverseResponse.ok) {

                    const reverseData =
                        await reverseResponse.json();


                    if (
                        reverseData.results &&
                        reverseData.results.length
                    ) {

                        location =
                            reverseData.results[0];

                    }

                }


                displayWeather(
                    location,
                    weatherData
                );


                cityInput.value =
                    location.name;


            } catch (error) {

                console.error(error);


                showError(
                    "Unable to retrieve weather for your location."
                );

            } finally {

                hideLoading();

            }

        },

        error => {

            hideLoading();


            if (
                error.code ===
                error.PERMISSION_DENIED
            ) {

                showError(
                    "Location permission was denied. Please allow location access."
                );

            } else {

                showError(
                    "Unable to determine your location."
                );

            }

        }

    );

}


/* =========================================================
   TEMPERATURE UNIT
========================================================= */

function setTemperatureUnit(unit) {

    temperatureUnitPreference =
        unit;


    celsiusBtn.classList.toggle(
        "active",
        unit === "C"
    );


    fahrenheitBtn.classList.toggle(
        "active",
        unit === "F"
    );


    updateTemperatureDisplay();

}


/* =========================================================
   RECENT SEARCHES
========================================================= */

function getRecentCities() {

    try {

        return JSON.parse(
            localStorage.getItem(
                RECENT_STORAGE_KEY
            )
        ) || [];

    } catch {

        return [];

    }

}


function saveRecentCity(city) {

    let cities =
        getRecentCities();


    cities =
        cities.filter(
            item =>
                item.toLowerCase() !==
                city.toLowerCase()
        );


    cities.unshift(city);


    cities =
        cities.slice(0, 6);


    localStorage.setItem(
        RECENT_STORAGE_KEY,
        JSON.stringify(cities)
    );


    renderRecentCities();

}


function renderRecentCities() {

    const cities =
        getRecentCities();


    recentSearches.innerHTML = "";


    if (!cities.length) {

        recentSearches.innerHTML =
            `<span style="opacity:.5;font-size:12px;">
                No recent cities yet.
            </span>`;

        return;

    }


    cities.forEach(city => {

        const button =
            document.createElement("button");


        button.className =
            "recent-city";


        button.textContent =
            city;


        button.addEventListener(
            "click",
            () => {

                searchWeather(city);

            }
        );


        recentSearches.appendChild(
            button
        );

    });

}


/* ================= CLEAR RECENT ================= */

clearRecentBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            RECENT_STORAGE_KEY
        );

        renderRecentCities();

    }
);


/* =========================================================
   EVENT LISTENERS
========================================================= */

searchBtn.addEventListener(
    "click",
    () => {

        searchWeather(
            cityInput.value
        );

    }
);


cityInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            searchWeather(
                cityInput.value
            );

        }

    }
);


refreshBtn.addEventListener(
    "click",
    refreshWeather
);


locationBtn.addEventListener(
    "click",
    useMyLocation
);


celsiusBtn.addEventListener(
    "click",
    () => {

        setTemperatureUnit("C");

    }
);


fahrenheitBtn.addEventListener(
    "click",
    () => {

        setTemperatureUnit("F");

    }
);


/* =========================================================
   START APPLICATION
========================================================= */

renderRecentCities();

searchWeather("Mumbai");

startAutoRefresh();