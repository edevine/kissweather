import { toCardinalDirection, toFahrenheit, toMPH, toTime } from 'units';
import toIconName from 'icons';

const currentConditionsContent = document.querySelector<HTMLElement>('.current-conditions-content');

const dailyForecastCardTemplate = document.getElementById<DailyForecastListElement>('daily-forecast').children[0];
dailyForecastCardTemplate.parentNode.removeChild(dailyForecastCardTemplate);
dailyForecastCardTemplate.style.removeProperty('display');

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

export function prepareCurrentConditionsTemplate(templateElement: HTMLElement, currentTimeElement: HTMLSpanElement) {
    const parentElement = templateElement.parentElement;
    if (parentElement != null) {
        parentElement.removeChild(templateElement);
    }
    templateElement.style.removeProperty('display');
    
    const weatherIconElement = templateElement.querySelector<HTMLImageElement>('.current-weather-icon');
    const temperatureElement = templateElement.querySelector<HTMLParagraphElement>('.current-temp');
    const descriptionElement = templateElement.querySelector<HTMLParagraphElement>('.current-description');
    const windElement = templateElement.querySelector<HTMLParagraphElement>('.current-wind');
    const humidityElement = templateElement.querySelector<HTMLParagraphElement>('.current-humidity');
    const pressureElement = templateElement.querySelector<HTMLParagraphElement>('.current-pressure');
    const sunriseElement = templateElement.querySelector<HTMLParagraphElement>('.current-sunrise');
    const sunsetElement = templateElement.querySelector<HTMLParagraphElement>('.current-sunset');
    
    return (current: CurrentConditions) => {
        if (templateElement.parentElement == null) {
            parentElement.appendChild(templateElement);
        }
        
        const date = new Date(current.time * 1000);
        const sunrise = new Date(current.sunrise * 1000);
        const sunset = new Date(current.sunset * 1000);
        
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

export function createDailyCard(dailyForecastEntry: DailyConditions) {
    const now = new Date();
    const date = new Date(dailyForecastEntry.time * 1000);

    const li = dailyForecastCardTemplate.cloneNode(true);

    li.children[0].textContent = toDayOfWeek(date.getDay(), now.getDay());
    li.children[1].textContent = toMonth(date) + ' ' + date.getDate();
    li.children[2].src = '/icons/' + toIconName(dailyForecastEntry.icon) + '.svg';
    li.children[2].alt = dailyForecastEntry.description;
    li.children[2].title = dailyForecastEntry.description;
    li.children[3].innerHTML =
        toFahrenheit(dailyForecastEntry.temp.max).toFixed(0) + '&deg; / ' +
        toFahrenheit(dailyForecastEntry.temp.min).toFixed(0) + '&deg;';

    return li;
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
