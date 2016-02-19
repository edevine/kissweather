import * as units from 'units';
import toIconName from 'icons';

function toDayOfWeek(day: number): string;
function toDayOfWeek(day: number, today: number): string;
function toDayOfWeek(day: number, today?: number) {
    if (arguments.length > 1 && day === today) {
        return 'Today';
    }
    switch (day) {
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
        default: throw new TypeError('Invalid day of week: ' + String(day));
    }
}

function toMonth(date: Date) {
    switch (date.getMonth()) {
        case 0: return 'Jan';
        case 1: return 'Feb';
        case 2: return 'Mar';
        case 3: return 'Apr';
        case 4: return 'May';
        case 5: return 'Jun';
        case 6: return 'Jul';
        case 7: return 'Aug';
        case 8: return 'Sep';
        case 9: return 'Oct';
        case 10: return 'Nov';
        case 11: return 'Dec';
        default: throw new TypeError('Invalid date: ' + String(date));    }
}

export function prepareDailyCardTemplate(templateElement: HTMLLIElement) {
    if (templateElement.parentElement != null) {
        templateElement.parentElement.removeChild(templateElement);
    }
    
    let dayElement = templateElement.querySelector('.daily-day');
    let dateElement = templateElement.querySelector('.daily-date');
    let weatherIconElement = templateElement.querySelector<HTMLImageElement>('.daily-weather-icon');
    let highTempElement = templateElement.querySelector('.daily-high-temp');
    let lowTempElement = templateElement.querySelector('.daily-low-temp');
    
    return (dailyForecastEntry: DailyForecastEntry) => {
        let now  = new Date();
        let date = new Date(dailyForecastEntry.dt * 1000);
        
        dayElement.textContent = toDayOfWeek(date.getDay(), now.getDay());
        dateElement.textContent = toMonth(date) + ' ' + date.getDate();
        weatherIconElement.src = '/icons/' + toIconName(dailyForecastEntry.weather[0].icon) + '.svg';
        weatherIconElement.alt = dailyForecastEntry.weather[0].description;
        weatherIconElement.title = dailyForecastEntry.weather[0].description;
        highTempElement.textContent = units.toFahrenheit(dailyForecastEntry.temp.max).toFixed(0);
        lowTempElement.textContent = units.toFahrenheit(dailyForecastEntry.temp.min).toFixed(0);
        
        return templateElement.cloneNode(true);
    }
}

export function prepareCurrentConditionsTemplate(templateElement: HTMLElement) {
    let parentElement = templateElement.parentElement;
    if (parentElement != null) {
        parentElement.removeChild(templateElement);
    }
    
    let weatherIconElement = templateElement.querySelector<HTMLImageElement>('.current-weather-icon');
    let temperatureElement = templateElement.querySelector<HTMLParagraphElement>('.current-temp');
    let descriptionElement = templateElement.querySelector<HTMLParagraphElement>('.current-description');
    let windElement = templateElement.querySelector<HTMLParagraphElement>('.current-wind');
    let humidityElement = templateElement.querySelector<HTMLParagraphElement>('.current-humidity');
    let pressureElement = templateElement.querySelector<HTMLParagraphElement>('.current-pressure');
    let sunriseElement = templateElement.querySelector<HTMLParagraphElement>('.current-sunrise');
    let sunsetElement = templateElement.querySelector<HTMLParagraphElement>('.current-sunset');
    
    return (weather: CurrentWeather) => {
        if (templateElement.parentElement == null) {
            parentElement.appendChild(templateElement);
        }
        let sunrise = new Date(weather.sys.sunrise * 1000);
        let sunset = new Date(weather.sys.sunset * 1000);
        
        weatherIconElement.src = '/icons/' + toIconName(weather.weather[0].icon) + '.svg';
        weatherIconElement.alt = weather.weather[0].description;
        weatherIconElement.title = weather.weather[0].description;
        temperatureElement.textContent = units.toFahrenheit(weather.main.temp).toFixed(0) + '\u00B0';
        descriptionElement.textContent = weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1);
        windElement.textContent = 'Wind ' + units.toCardinalDirection(weather.wind.deg) + ' ' + units.toMPH(weather.wind.speed).toFixed(0) + ' mph '
        humidityElement.textContent = weather.main.humidity.toFixed(0) + '%';
        pressureElement.textContent = weather.main.pressure.toFixed(0) + ' hpa';
        sunriseElement.textContent = units.toTime(sunrise);
        sunsetElement.textContent = units.toTime(sunset);
    }
}