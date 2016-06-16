import { toCardinalDirection, toFahrenheit, toMPH, toTime } from 'units';
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
    
    return (dailyForecastEntry: DailyConditions) => {
        let now  = new Date();
        let date = new Date(dailyForecastEntry.time * 1000);
        
        dayElement.textContent = toDayOfWeek(date.getDay(), now.getDay());
        dateElement.textContent = toMonth(date) + ' ' + date.getDate();
        weatherIconElement.src = '/icons/' + toIconName(dailyForecastEntry.icon) + '.svg';
        weatherIconElement.alt = dailyForecastEntry.description;
        weatherIconElement.title = dailyForecastEntry.description;
        highTempElement.textContent = toFahrenheit(dailyForecastEntry.temp.max).toFixed(0);
        lowTempElement.textContent = toFahrenheit(dailyForecastEntry.temp.min).toFixed(0);
        
        return templateElement.cloneNode(true);
    }
}

export function prepareCurrentConditionsTemplate(templateElement: HTMLElement, currentTimeElement: HTMLSpanElement) {
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
    
    return (current: CurrentConditions) => {
        if (templateElement.parentElement == null) {
            parentElement.appendChild(templateElement);
        }
        
        let date = new Date(current.time * 1000);
        let sunrise = new Date(current.sunrise * 1000);
        let sunset = new Date(current.sunset * 1000);
        
        currentTimeElement.textContent = toTime(date);
        weatherIconElement.src = '/icons/' + toIconName(current.icon) + '.svg';
        weatherIconElement.alt = current.description;
        weatherIconElement.title = current.description;
        temperatureElement.textContent = toFahrenheit(current.temp).toFixed(0) + '\u00B0';
        descriptionElement.textContent = current.description;
        windElement.textContent = 'Wind ' + toCardinalDirection(current.wind.direction) + ' ' + toMPH(current.wind.speed).toFixed(0) + ' mph '
        humidityElement.textContent = current.humidity.toFixed(0) + '%';
        pressureElement.textContent = current.pressure.toFixed(0) + ' hpa';
        sunriseElement.textContent = toTime(sunrise);
        sunsetElement.textContent = toTime(sunset);
    }
}

export function createHourlyRow(conditions: HourlyConditions, index: number): DocumentFragment {
    const fragment = document.createDocumentFragment();

    const date = new Date(conditions.time * 1000);
    const isNewDay = date.getHours() <= 2 && index !== 0;
    
    if (isNewDay) {
        const tr = fragment.appendChild(document.createElement('tr'));
        const th = tr.appendChild(document.createElement('th'));
        th.textContent = toDayOfWeek(date.getDay(), new Date().getDay());
        th.colSpan = 5;
        th.className = 'hourly-day';
    }

    const tr = fragment.appendChild(document.createElement('tr'));
    tr.className ='hourly-hour';
    
    tr.appendChild(document.createElement('td')).textContent = toTime(date);
    tr.appendChild(document.createElement('td')).textContent = toFahrenheit(conditions.temp).toFixed(0) + '\u00B0';
    tr.lastElementChild.className = 'hourly-temp';
    tr.appendChild(document.createElement('td')).appendChild(document.createElement('img')).src = '/icons/' + toIconName(conditions.icon) + '.svg';
    tr.lastElementChild.className = 'hourly-icon';
    tr.appendChild(document.createElement('td')).textContent = conditions.description;
    tr.appendChild(document.createElement('td')).textContent = conditions.humidity.toFixed(0) + '%';
    tr.lastElementChild.className = 'hourly-humidity';

    return fragment;
}
