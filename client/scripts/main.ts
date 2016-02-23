import * as templates from 'templates';
import * as units from 'units';
import toIconName from 'icons';

let locationInput = document.getElementById<HTMLInputElement>('location');

let currentConditionsContent = document.querySelector<HTMLElement>('.current-conditions-content');
let currentTimeElement = document.querySelector<HTMLSpanElement>('.current-time');
let renderCurrentConditions = templates.prepareCurrentConditionsTemplate(currentConditionsContent, currentTimeElement);

let dailyForecastList = document.getElementById<HTMLUListElement>('daily-forecast');
let renderDailyCard = templates.prepareDailyCardTemplate(dailyForecastList.querySelector<HTMLLIElement>('li'));

let lastZipCode: string = null;

function toJson(response: Response) {
    return response.json();
}

function renderView(weather: Weather) {
    locationInput.value = weather.current.name + ', ' + weather.current.sys.country.toUpperCase() + ' ' + lastZipCode;
    renderCurrentConditions(weather.current);
    dailyForecastList.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        dailyForecastList.appendChild(renderDailyCard(weather.dailyForecast.list[i]));
    }
}

locationInput.addEventListener('change', () => {
    let matches = /(\d{5})/.exec(locationInput.value)
    if (matches != null) {
        if (lastZipCode !== matches[1]) {
            lastZipCode = matches[1];
            fetch('http://api.kissweather.com/us/' + lastZipCode).then(toJson).then(renderView);
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
});