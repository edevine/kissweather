export function requestData(dataSource: 'weather', zipCode: string): Promise<CurrentWeather>;
export function requestData(dataSource: 'forecast/daily', zipCode: string): Promise<DailyForecast>;
export function requestData(dataSource: 'forecast', zipCode: string): Promise<HourlyForecast>;
export function requestData(dataSource: string, zipCode: string): Promise<any>;
export function requestData(dataSource: string, zipCode: string): Promise<any> {
    return fetch('http://kissweather.com/data/' + dataSource + '?zip=' + zipCode + ',us').then(response => {
        switch (response.status) {
            case 200: return response.json();
            case 429: return requestData(dataSource, zipCode);
            default: throw new Error(response.statusText);
        }
    });
}
export default requestData;