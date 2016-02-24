export function toWeather(current: OWMCurrentWeather, daily: OWMDailyForecast, hourly: OWMHourlyForecast): Weather {
    return {
        location: {
            city: current.name,
            country: current.sys.country.toUpperCase()
        },
        current: {
            time: current.main.temp,
            description: current.weather[0].description.charAt(0).toUpperCase() + current.weather[0].description.slice(1),
            icon: current.weather[0].icon,
            temp: current.main.temp,
            humidity: current.main.humidity,
            pressure: current.main.pressure,
            sunrise: current.sys.sunrise,
            sunset: current.sys.sunset,
            wind: {
                speed: current.wind.speed,
                direction: current.wind.deg
            }
        },
        daily: daily.list.map(toDaily),
        hourly: hourly.list.map(toHourly)
    };
}

function toDaily(daily: OWMDailyForecastEntry): DailyConditions {
    return {
        time: daily.dt,
        description: daily.weather[0].description.charAt(0).toUpperCase() + daily.weather[0].description.slice(1),
        icon: daily.weather[0].icon,
        temp: daily.temp,
        humidity: daily.humidity,
        pressure: daily.pressure,
        wind: {
            speed: daily.speed,
            direction: daily.deg
        }
    };
}

function toHourly(hourly: OWMHourlyForecastEntry): HourlyConditions {
    return {
        time: hourly.dt,
        description: hourly.weather[0].description.charAt(0).toUpperCase() + hourly.weather[0].description.slice(1),
        icon: hourly.weather[0].icon,
        temp: hourly.main.temp,
        humidity: hourly.main.humidity,
        pressure: hourly.main.pressure,
        wind: {
            speed: hourly.wind.speed,
            direction: hourly.wind.deg
        }
    };
}
