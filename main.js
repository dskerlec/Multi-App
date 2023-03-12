"use strict";
// Import functions from maps.js
import { updateGeocoding, updateWeatherUrl } from "./maps.js";
// Import object of weather description objects containing code and corresponding image
import weatherDescriptions from "./weatherDescriptions.js";
//Import weather classes
import { DailyWeather, HourlyWeather, getPrecipitation, getTemp, getWeatherCode, getWindSpeed, getPrecipSum, getSunrise, getSunset } from "./weather.js";

//query selectors for updating html
const todayDiv = document.querySelector("#dailyOne");
const tomorrowDiv = document.querySelector("#dailyTwo");
const overmorrowDiv = document.querySelector("#dailyThree");
const nowDiv = document.querySelector("#hourlyOne");
const nextHoursDiv = document.querySelector("#hourlyTwo");
const laterHoursDiv = document.querySelector("#hourlyThree");
const todayImg = document.querySelector("#dayOneImg");
const tomorrowImg = document.querySelector("#dayTwoImg");
const overmorrowImg = document.querySelector("#dayThreeImg");
const nowImg = document.querySelector("#nowImg");
const nextHoursImg = document.querySelector("#nextHoursImg");
const laterHoursImg = document.querySelector("#laterHoursImg");

//date stuff for getting current time stamps
let date = new Date();
// let dayIndex = date.getDay();
let hour = getCurrentHour(date);


//store weather data result in variable
let weatherData;

//weather data variables to be set
let zeroForecast = new DailyWeather(0);
let oneForecast = new DailyWeather(1);
let twoForecast = new DailyWeather(2);

let nowForecast = new HourlyWeather(hour);
let nextForecast = new HourlyWeather(hour + 3);
let laterForecast = new HourlyWeather(hour + 6);
let forecasts = [zeroForecast, oneForecast, twoForecast, nowForecast, nextForecast, laterForecast];

function fetchWeather(apiUrl) {
  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      weatherData = data;
      forecasts.forEach(setWeatherData);
      forecasts.forEach(updateImageInformation);
      forecasts.forEach(displayWeatherData);
    })
    .catch((error) => console.error(error));
}

function setWeatherData(forecast){
  if (forecast.type === "Daily"){
    let date = new Date(getDay(weatherData, forecast.dayClassification));
    forecast.date = date.toDateString();
    forecast.highTemp = getTemp(weatherData, forecast.type, forecast.dayClassification, "max");
    forecast.lowTemp = getTemp(weatherData, forecast.type, forecast.dayClassification, "min");
    forecast.weatherCode = getWeatherCode(weatherData, forecast.type, forecast.dayClassification);
    forecast.precipChance = getPrecipitation(weatherData,forecast.type, forecast.dayClassification);
    forecast.precipSum = getPrecipSum(weatherData, forecast.dayClassification);
    let sunriseTime = new Date(getSunrise(weatherData, forecast.dayClassification));
    let sunsetTime = new Date(getSunset(weatherData, forecast.dayClassification));
    forecast.sunrise = sunriseTime.toLocaleTimeString();
    forecast.sunset = sunsetTime.toLocaleTimeString();
  }
  else if (forecast.type === "Hourly"){
    let time = new Date(getHour(weatherData, forecast.timeClassification));
    forecast.time = time.toLocaleString();
    forecast.temp = getTemp(weatherData, forecast.type, forecast.timeClassification);
    forecast.precipChance = getPrecipitation(weatherData, forecast.type, forecast.timeClassification);
    forecast.weatherCode = getWeatherCode(weatherData, forecast.type, forecast.timeClassification);
    forecast.windSpeed = getWindSpeed(weatherData, forecast.timeClassification);
  }
  forecast.conditionsDescription = (weatherDescriptions[forecast.weatherCode]).description;
  forecast.conditionsImg = (weatherDescriptions[forecast.weatherCode]).image;
}

function updateImageInformation(forecast) {
  let img = getCorrespondingImg(forecast);
  img.src = forecast.conditionsImg;
  img.alt = `${(weatherDescriptions[forecast.weatherCode]).description} icon`
  img.style.display = "block";
}

function displayWeatherData(forecast) {
  let div = getCorrespondingDiv(forecast);
  let img = getCorrespondingImg(forecast);
  if (forecast.type === "Daily") {
        //TODO: only show precipSum if precipChance > 50%
    div.innerHTML = `${forecast.date}:<br>High Temperature: ${forecast.highTemp}°F<br>Low Temperature: ${forecast.lowTemp}°F<br>${forecast.conditionsDescription} with ${forecast.precipChance}% chance of precipitation of about ${forecast.precipSum} inches.<br>Sunrise at ${forecast.sunrise} and sunset at ${forecast.sunset}.`;
  }
  else {
    div.innerHTML = `On ${forecast.time} :<br>Temperature: ${forecast.temp}°F<br>Precipitation Chance:${forecast.precipChance}%<br>and ${forecast.windSpeed} mph winds`;
  }
  div.appendChild(img);
}

function getCorrespondingDiv(forecast) {
  if (forecast.type === "Daily") {
    switch (forecast.dayClassification) {
      case 0:
        return todayDiv;
      case 1: 
        return tomorrowDiv;
      case 2:
        return overmorrowDiv;
      default:
      //error
    }
  }
  else {
    switch (forecast.timeClassification)
    {
      case hour:
        return nowDiv;
      case hour + 3:
        return nextHoursDiv;
      case hour + 6:
        return laterHoursDiv;
    }
  }
}

function getCorrespondingImg(forecast) {
  if (forecast.type === "Daily") {
    switch (forecast.dayClassification) {
      case 0:
        return todayImg;
      case 1: 
        return tomorrowImg;
      case 2:
        return overmorrowImg;
      default:
      //error
    }
  }
  else {
    switch (forecast.timeClassification)
    {
      case hour:
        return nowImg;
      case hour + 3:
        return nextHoursImg;
      case hour + 6:
        return laterHoursImg;
    }
  }
}

function getCurrentHour(date) {
  return date.getHours();
}

function getDay(data, dayIndex) {
  return data.daily.time[dayIndex];
}

function getHour(data, hourIndex) {
  return data.hourly.time[hourIndex];
}

// This button updates the longitutde/latitude in the query url
var userInput = document.getElementById("address-input");
var searchBtn = document.getElementById("searchWeather");

searchBtn.addEventListener("click", () => {
  updateGeocoding(userInput.value)
    .then((newCoordinates) => {
      let updatedUrl = updateWeatherUrl(
        newCoordinates.latitude,
        newCoordinates.longitude
      ).apiWeatherUrl;
      fetchWeather(updatedUrl);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
