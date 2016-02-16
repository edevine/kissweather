const zipCodeInput: HTMLInputElement = <any> document.getElementById('zipcode');
const locationOutput: HTMLElement = document.getElementById('location');
const currentTempOutput: HTMLElement = document.getElementById('current-temp');

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
    }
});