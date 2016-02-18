import requestData from 'request';
import * as templates from 'templates';
import * as units from 'units';

let zipCodeInput = document.getElementById<HTMLInputElement>('zipcode');

let locationOutput = document.getElementById<HTMLElement>('location');
let currentTempOutput = document.getElementById<HTMLElement>('current-temp');

let dailyForecastList = document.getElementById<HTMLUListElement>('daily-forecast');
let renderDailyCard = templates.prepareDailyCardTemplate(dailyForecastList.querySelector<HTMLLIElement>('li'));

function renderHeader(weather: CurrentWeather) {
    locationOutput.textContent = weather.name + ', ' + weather.sys.country.toUpperCase();
    currentTempOutput.textContent = (weather.main.temp * (9 / 5) - 459.67).toFixed(0);
}

function renderDailyForecast(dailyForecast: DailyForecast) {
    dailyForecastList.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        dailyForecastList.appendChild(renderDailyCard(dailyForecast.list[i]));
    }
}

zipCodeInput.addEventListener('change', () => {
    let zipCode = zipCodeInput.value;
    if (/^\d{5}$/.test(zipCode)) {
        requestData('weather', zipCode).then(renderHeader);
        requestData('forecast/daily', zipCode).then(renderDailyForecast);
    }
});