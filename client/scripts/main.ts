import { prepareCurrentConditionsTemplate, prepareDailyCardTemplate, createHourlyRow } from 'templates';
import toIconName from 'icons';
import { enableDailyScrolling, enableKeyboardScrolling } from 'scrolling';

let locationInput = document.getElementById<HTMLInputElement>('location');

let currentConditionsContent = document.querySelector<HTMLElement>('.current-conditions-content');
let currentTimeElement = document.querySelector<HTMLSpanElement>('.current-time');
let renderCurrentConditions = prepareCurrentConditionsTemplate(currentConditionsContent, currentTimeElement);

let dailyForecastList = document.getElementById<HTMLUListElement>('daily-forecast');
let createDailyCard = prepareDailyCardTemplate(dailyForecastList.querySelector<HTMLLIElement>('li'));

const hourlyForecastTable = document.getElementById<HTMLTableSectionElement>('hourly-forecast');

let lastZipCode: string = null;

function appendChild(parent: Node, child: Node) {
    parent.appendChild(child);
    return parent;
}

function renderView(weather: Weather) {
    locationInput.value = weather.location.city + ', ' + weather.location.country + ' ' + lastZipCode;
    renderCurrentConditions(weather.current);
    dailyForecastList.innerHTML = "";
    hourlyForecastTable.innerHTML = "";
    
    weather.daily.map(createDailyCard).reduce(appendChild, dailyForecastList);
    weather.hourly.map(createHourlyRow).reduce(appendChild, hourlyForecastTable);
}

const xhr = new XMLHttpRequest();

locationInput.addEventListener('change', () => {
    let matches = /(\d{5})/.exec(locationInput.value);
    if (matches != null) {
        if (lastZipCode !== matches[1]) {
            lastZipCode = matches[1];
            xhr.open('GET', 'http://api.kissweather.com/us/' + lastZipCode);
            xhr.send();
        }
    }
    else {
        lastZipCode = '';
        locationInput.value = '';
        dailyForecastList.innerHTML = '';
        currentTimeElement.textContent = '';
        if (currentConditionsContent.parentElement) {
            currentConditionsContent.parentElement.removeChild(currentConditionsContent);
        }
    }
    locationInput.blur();
});

xhr.onreadystatechange = event => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        renderView(JSON.parse(xhr.responseText));
    }
};

locationInput.addEventListener('keydown', event => {
    // Prevent keyboard scrolling of daily forecast
    event.stopPropagation();
});

enableDailyScrolling(dailyForecastList);
enableKeyboardScrolling(dailyForecastList);
