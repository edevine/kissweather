const secondsInDay = 24 * 60 * 60;

const zipCodeInput = document.getElementById<HTMLInputElement>('zipcode');
const locationOutput = document.getElementById<HTMLElement>('location');
const currentTempOutput = document.getElementById<HTMLElement>('current-temp');

const dailyForecastTable = document.getElementById<HTMLTableElement>('daily-forecast');
const dailyForecastTableBody = dailyForecastTable.querySelector<HTMLBodyElement>('tbody');
const dailyForecastRowTemplate = dailyForecastTableBody.querySelector<HTMLTableRowElement>('tr');
dailyForecastRowTemplate.parentNode.removeChild(dailyForecastRowTemplate);

const hourlyForecastTable = document.getElementById<HTMLTableElement>('hourly-forecast');
const hourlyForecastTableBody = hourlyForecastTable.querySelector<HTMLBodyElement>('tbody');
const hourlyForecastRowTemplate = hourlyForecastTableBody.querySelector<HTMLTableRowElement>('tr');
hourlyForecastRowTemplate.parentNode.removeChild(hourlyForecastRowTemplate);

zipCodeInput.addEventListener('change', () => {
    let zipCode = zipCodeInput.value;
    if (/^\d{5}$/.test(zipCode)) {
        fetch('http://kissweather.com/data/weather?zip=' + zipCode + ',us')
        .then(response => response.json())
        .then((currentWeather: CurrentWeather) => {
            if (currentWeather.cod === 200) {
                locationOutput.textContent = currentWeather.name + ', ' + currentWeather.sys.country.toUpperCase();
                currentTempOutput.textContent = (currentWeather.main.temp * (9 / 5) - 459.67).toFixed(0);
            }
            else {
                locationOutput.textContent = '';
                currentTempOutput.textContent = '';
            }
        });
        
        fetch('http://kissweather.com/data/forecast/daily?zip=' + zipCode + ',us')
        .then(response => response.json())
        .then((forecast: DailyForecast) => {
            dailyForecastTableBody.innerHTML = "";
            let lastDate = '';
            for (let i = 0; i < forecast.list.length; i++) {
                let row = dailyForecastRowTemplate.cloneNode(true);
                row.children[0].textContent = toDateStamp(forecast.list[i].dt);
                row.children[1].textContent = toFahrenheit(forecast.list[i].temp.max).toFixed(0) + ' / ' + toFahrenheit(forecast.list[i].temp.min).toFixed(0);
                dailyForecastRowTemplate.appendChild(row);
            }
        });
        
        fetch('http://kissweather.com/data/forecast?zip=' + zipCode + ',us')
        .then(response => response.json())
        .then((forecast: HourlyForecast) => {
            hourlyForecastTableBody.innerHTML = "";
            let lastDate = '';
            for (let i = 0; i < forecast.list.length; i++) {
                let row = hourlyForecastRowTemplate.cloneNode(true);
                
                let [date, time] = forecast.list[i].dt_txt.split(' ');
                if (lastDate !== date) {
                    lastDate = date;
                    row.children[0].textContent = date;
                }
                row.children[1].textContent = time;
                row.children[2].textContent = toFahrenheit(forecast.list[i].main.temp).toFixed(0);
                hourlyForecastTable.appendChild(row);
            }
        });
    }
});

function toFahrenheit(kelvin: number) {
    return kelvin * (9 / 5) - 459.67;
}

function isMidnight(utcSeconds: number) {
    return utcSeconds % secondsInDay === 0;
}

function toDateStamp(utcSeconds: number) {
    let date = new Date(utcSeconds * 1000);
    return String(date.getFullYear()) + '-' + String(date.getMonth() + 1) + '-' + String(date.getDate());
}