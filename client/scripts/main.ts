import requestData from 'request';
import * as templates from 'templates';
import * as units from 'units';
import toIconName from 'icons';

let locationInput = document.getElementById<HTMLInputElement>('location');

let currentConditionsContent = document.querySelector<HTMLElement>('.current-conditions-content');
let renderCurrentConditions = templates.prepareCurrentConditionsTemplate(currentConditionsContent);

let dailyForecastList = document.getElementById<HTMLUListElement>('daily-forecast');
let renderDailyCard = templates.prepareDailyCardTemplate(dailyForecastList.querySelector<HTMLLIElement>('li'));

function handleCurrentWeather(weather: CurrentWeather) {
    locationInput.value = weather.name + ', ' + weather.sys.country.toUpperCase() + ' ' + lastZipCode;
    renderCurrentConditions(weather);
}

function handleDailyForecast(dailyForecast: DailyForecast) {
    dailyForecastList.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        dailyForecastList.appendChild(renderDailyCard(dailyForecast.list[i]));
    }
}

let lastZipCode: string = null;
locationInput.addEventListener('change', () => {
    let matches = /(\d{5})/.exec(locationInput.value)
    if (matches != null) {
        if (lastZipCode !== matches[1]) {
            lastZipCode = matches[1];
            requestData('weather', lastZipCode).then(handleCurrentWeather);
            requestData('forecast/daily', lastZipCode).then(handleDailyForecast);
        }
    }
    else {
        lastZipCode = '';
        locationInput.value = '';
        dailyForecastList.innerHTML = '';
        if (currentConditionsContent.parentElement) {
            currentConditionsContent.parentElement.removeChild(currentConditionsContent);
        }
    }
});