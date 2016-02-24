interface OWMCurrentWeather {
    coord: {
        lon: number;
        lat: number;
    };
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    main: {
        temp: number;
        humidity: number;
        pressure: number;
        temp_min: number;
        temp_max: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    id: number;
    name: string;
    cod: number;
    wind: {
        speed: number;
        deg: number;
    };
}

interface OWMHourlyForecast {
    city: {
        id: number;
        name: string;
        country: string;
        coord: {
            lon: number;
            lat: number;
        };
        population: number;
        sys: {
            pod: string;
        };
    };
    cod: string;
    message: number;
    cnt: number;
    list: OWMHourlyForecastEntry[];
}

interface OWMHourlyForecastEntry {
    dt: number;
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        deg: number;  
    };
    dt_txt: string;
}

interface OWMDailyForecast {
    city: {
        id: number;
        name: string;
        country: string;
        coord: {
            lon: number;
            lat: number;
        };
        population: number;
    };
    cnt: number;
    cod: string;
    list: OWMDailyForecastEntry[];
}

interface OWMDailyForecastEntry {
    clouds: number;
    deg: number;
    dt: number;
    humidity: number;
    pressure: number;
    rain: number;
    snow: number;
    speed: number;
    temp: {
        day: number;
        eve: number;
        max: number;
        min: number;
        morn: number;
        night: number;
    };
    weather: Array<{
        description: string;
        icon: string;
        id: number;
        main: string;
    }>;
}