interface CurrentWeather {
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
}