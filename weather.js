"use strict";
// Import functions from maps.js
import { updateGeocoding, updateWeatherUrl } from "./maps.js";
// Import object of weather description objects containing code and corresponding image
import weatherDescriptions from "./weatherDescriptions.js";
//Import weather classes
import { DailyWeather, HourlyWeather, getPrecipitation, getTemp, getWeatherCode, getWindSpeed, getPrecipSum, getSunrise, getSunset } from "./weatherFunctions.js";

//query selectors for updating html
const dailySunDiv = document.querySelector("#dailySun");
const dailyMonDiv = document.querySelector("#dailyMon");
const dailyTueDiv = document.querySelector("#dailyTue");
const dailyWedDiv = document.querySelector("#dailyWed");
const dailyThuDiv = document.querySelector("#dailyThu");
const dailyFriDiv = document.querySelector("#dailyFri");
const dailySatDiv = document.querySelector("#dailySat");

const dailySunImg = document.querySelector("#daySunImg");
const dailyMonImg = document.querySelector("#dayMonImg");
const dailyTueImg = document.querySelector("#dayTueImg");
const dailyWedImg = document.querySelector("#dayWedImg");
const dailyThuImg = document.querySelector("#dayThuImg");
const dailyFriImg = document.querySelector("#dayFriImg");
const dailySatImg = document.querySelector("#daySatImg");

// const nowDiv = document.querySelector("#hourlyOne");
// const nextHoursDiv = document.querySelector("#hourlyTwo");
// const laterHoursDiv = document.querySelector("#hourlyThree");

// const nowImg = document.querySelector("#nowImg");
// const nextHoursImg = document.querySelector("#nextHoursImg");
// const laterHoursImg = document.querySelector("#laterHoursImg");

//date stuff for getting current time stamps
let date = new Date();
let dayIndex = date.getDay();
let hour = getCurrentHour(date);


//store weather data result in variable
let weatherData;

//weather data variables to be set
let sundayForecast = new DailyWeather(0);
let mondayForecast = new DailyWeather(1);
let tuesdayForecast = new DailyWeather(2);
let wednesdayForecast = new DailyWeather(3);
let thursdayForecast = new DailyWeather(4);
let fridayForecast = new DailyWeather(5);
let saturdayForecast = new DailyWeather(6);

// let nowForecast = new HourlyWeather(hour);
// let nextForecast = new HourlyWeather(hour + 3);
// let laterForecast = new HourlyWeather(hour + 6);
let forecasts = [sundayForecast, mondayForecast, tuesdayForecast, wednesdayForecast, thursdayForecast, fridayForecast, saturdayForecast];

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
    let date = new Date(getDay(weatherData, forecast.dayClassification).replace(/-/g, '\/'));
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
  if (forecast.dayClassification == dayIndex)
  {
    div.classList.add("today");
  }
  if (forecast.type === "Daily") {
        //TODO: only show precipSum if precipChance > 50%
    div.textContent = `${forecast.date}: High Temperature: ${forecast.highTemp}°F Low Temperature: ${forecast.lowTemp}°F ${forecast.conditionsDescription} with ${forecast.precipChance}% chance of precipitation of about ${forecast.precipSum} inches. Sunrise at ${forecast.sunrise} and sunset at ${forecast.sunset}.`;
  }
  else {
    div.textContent = `On ${forecast.time} Temperature: ${forecast.temp}°F Precipitation Chance:${forecast.precipChance}% and ${forecast.windSpeed} mph winds`;
  }
  div.appendChild(img);
}
//this needs to be updated hardcoded to sunday rn
function getCorrespondingDiv(forecast) {
  if (forecast.type === "Daily") {
    switch (forecast.dayClassification) {
      case 0:
        return dailySunDiv;
      case 1:
        return dailyMonDiv;
      case 2: 
        return dailyTueDiv;
      case 3:
        return dailyWedDiv;
      case 4:
        return dailyThuDiv;
      case 5:
        return dailyFriDiv;
      case 6:
        return dailySatDiv;
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
        return dailySunImg;
      case 1:
        return dailyMonImg;
      case 2: 
        return dailyTueImg;
      case 3:
        return dailyWedImg;
      case 4:
        return dailyThuImg;
      case 5:
        return dailyFriImg;
      case 6:
        return dailySatImg;
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
