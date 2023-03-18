export class DailyWeather {
    constructor(dayClassification, date, highTemp, lowTemp, weatherCode, conditionsDescription, conditionsImg, precipChance, precipSum, sunrise, sunset) {
      this.type = "Daily";
      this.dayClassification = dayClassification;
      this.date = date;
      this.highTemp = highTemp;
      this.lowTemp = lowTemp;
      this.weatherCode = weatherCode;
      this.conditions = conditionsDescription;
      this.conditionsImg = conditionsImg;
      this.precipChance = precipChance;
      this.precipSum = precipSum;
      this.sunrise = sunrise;
      this.sunset = sunset;
    }
  }

export class HourlyWeather {
    constructor(timeClassification, time, temp, precipChance, weatherCode, conditionsDescription,conditionsImg, windSpeed) {
        this.type = "Hourly";
        this.timeClassification = timeClassification;
        this.time = time;
        this.temp = temp;
        this.precipChance = precipChance;
        this.weatherCode = weatherCode;
        this.conditionsDescription = conditionsDescription;
        this.conditionsImg = conditionsImg;
        this.windSpeed = windSpeed;
    }
  }

export function getPrecipitation(data, forecastType, timeInterval) {
  switch (forecastType) {
    case "Daily":
        return data.daily.precipitation_probability_max[timeInterval];
    case "Hourly":
      return data.hourly.precipitation_probability[timeInterval];
    default:
    //error
  }
  }
  
export function getTemp(data, forecastType, timeInterval, dailyType) {
    switch (forecastType) {
      case "Daily":
        if (dailyType === "max")
          return data.daily.temperature_2m_max[timeInterval];
        else return data.daily.temperature_2m_min[timeInterval];
      case "Hourly":
        return data.hourly.temperature_2m[timeInterval];
      default:
      //error
    }
  }
  
export function getWeatherCode(data, forecastType, timeInterval) {
      switch (forecastType) 
      {
        case "Daily":
            return data.daily.weathercode[timeInterval];
        case "Hourly":
          return data.hourly.weathercode[timeInterval];
        default:
          //error
      }
  }

export function getWindSpeed(data, timeInterval) {
  return data.hourly.windspeed_10m[timeInterval];
}

export function getPrecipSum(data, timeInterval) {
  return data.daily.precipitation_sum[timeInterval];
}

export function getSunrise(data, timeInterval) {
  return data.daily.sunrise[timeInterval];
}

export function getSunset(data, timeInterval) {
  return data.daily.sunset[timeInterval];
}