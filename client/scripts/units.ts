export function toFahrenheit(kelvin: number) {
    return kelvin * (9 / 5) - 459.67;
}

export function toTime(date: Date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    
    return String(hours === 0 ? 12 : hours < 12 ? hours : hours - 12) + ':' +
        (minutes < 10 ? '0' : '') + String(minutes) +
        (hours < 12 ? ' am' : ' pm');
}

export function toMPH(metersPerSecond: number) {
    return metersPerSecond * 2.23694;
}

export function toCardinalDirection(degrees: number) {
    switch (Math.round(degrees / 45)) {
        case 0: return 'N';
        case 1: return 'NE';
        case 2: return 'E';
        case 3: return 'SE';
        case 4: return 'S';
        case 5: return 'SW';
        case 6: return 'W';
        case 7: return 'NW';
        default: return 'N';
    }
}