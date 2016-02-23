import * as fs from 'fs';
import * as http from 'http';
import * as url from 'url';
import * as fetch from 'node-fetch';

const appId = process.argv[2];
const pathFormat = /^\/us\/(\d{5})$/;

http.createServer((request, response) => {
    let pathArgs = pathFormat.exec(request.url);
    if (pathArgs != null) {
        let zipCode = pathArgs[1];
        
        Promise.all<CurrentWeather | DailyForecast>([
            requestData('weather', zipCode),
            requestData('forecast/daily', zipCode)
        ]).then((data: [CurrentWeather, DailyForecast]) => {
            let weather: Weather = {
                current: data[0],
                dailyForecast: data[1]  
            };
            response.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            response.end(JSON.stringify(weather));
        }).catch(error => {
            response.writeHead(500, JSON.stringify(error), {
                'Access-Control-Allow-Origin': '*'
            });
            response.end();
        });
    }
    else {
        response.writeHead(400, {
            'Access-Control-Allow-Origin': '*'
        });
        response.end();
    }
}).listen(8081);

function requestData(dataSource: 'weather', zipCode: string): Promise<CurrentWeather>;
function requestData(dataSource: 'forecast/daily', zipCode: string): Promise<DailyForecast>;
function requestData(dataSource: 'forecast', zipCode: string): Promise<HourlyForecast>;
function requestData(dataSource: string, zipCode: string): Promise<any>;
function requestData(dataSource: string, zipCode: string): Promise<any> {
    return fetch('http://api.openweathermap.org/data/2.5/' + dataSource + '?zip=' + zipCode + ',us' + '&appid=' + appId).then(response => {
        switch (response.status) {
            case 200: return response.json();
            case 429: return requestData(dataSource, zipCode);
            default:
                console.error(JSON.stringify(response));
                throw new Error(response.statusText);
        }
    });
}