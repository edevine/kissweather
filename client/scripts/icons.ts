export function toIconName(iconCode: string) {
    switch (iconCode) {
        case '01d': return 'sunny';
        case '01n': return 'clear-night';
        case '02d': return 'mostly-sunny';
        case '02n': return 'mostly-clear-night';
        case '03d': return 'mostly-cloudy';
        case '03n': return 'mostly-cloudy-night';
        case '04d': return 'cloudy';
        case '04n': return 'cloudy';
        case '09d': return 'rain';
        case '09n': return 'rain';
        case '10d': return 'scattered-showers';
        case '10n': return 'scattered-showers-night';
        case '11d': return 'scattered-thunderstorms';
        case '11n': return 'scattered-thunderstorms-night';
        case '13d': return 'scattered-snow';
        case '13n': return 'scattered-snow-night';
        case '50d': return 'wind';
        case '50n': return 'wind';
        default: return '';
    }
}

export default toIconName;