import * as fs from 'fs';
import * as http from 'http';
import * as url from 'url';
import * as fetch from 'node-fetch';
import { toWeather } from './weather';

const appId = process.argv[2];
const pathFormat = /^\/us\/(\d{5})$/;

http.createServer((request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    let pathArgs = pathFormat.exec(request.url);
    if (pathArgs != null) {
        let zipCode = pathArgs[1];
        
        Promise.all<OWMCurrentWeather | OWMDailyForecast | OWMHourlyForecast>([
            requestData('weather', zipCode),
            requestData('forecast/daily', zipCode),
            requestData('forecast', zipCode)
        ]).then((data: [OWMCurrentWeather, OWMDailyForecast, OWMHourlyForecast]) => {
            let weather = toWeather(data[0], data[1], data[2]);
            response.setHeader('Content-Type', 'application/json');
            response.writeHead(200);
            response.end(JSON.stringify(weather));
        }).catch(error => {
            console.error(error);
            response.writeHead(500, JSON.stringify(error));
            response.end();
        });
    }
    else {
        response.writeHead(404);
        response.end();
    }
}).listen(8081);

function requestData(dataSource: 'weather', zipCode: string): Promise<OWMCurrentWeather>;
function requestData(dataSource: 'forecast/daily', zipCode: string): Promise<OWMDailyForecast>;
function requestData(dataSource: 'forecast', zipCode: string): Promise<OWMHourlyForecast>;
function requestData(dataSource: string, zipCode: string): Promise<any>;
function requestData(dataSource: string, zipCode: string): Promise<any> {
    return fetch('http://api.openweathermap.org/data/2.5/' + dataSource + '?cnt=10&zip=' + zipCode + ',us' + '&appid=' + appId).then(response => {
        switch (response.status) {
            case 200: return response.json();
            case 429: return requestData(dataSource, zipCode);
            default: throw new Error(response.statusText);
        }
    });
}
