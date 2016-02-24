interface Weather {
    location: {
        city: string;
        country: string;
    };
    current: CurrentConditions;
    daily: DailyConditions[];
    hourly: HourlyConditions[];
}

interface CurrentConditions {
    time: number;
    description: string;
    icon: string;
    temp: number;
    humidity: number;
    pressure: number;
    sunrise: number;
    sunset: number;
    wind: {
        speed: number;
        direction: number;
    };
}

interface DailyConditions {
    time: number;
    description: string;
    icon: string;
    humidity: number;
    pressure: number;
    temp: {
        day: number;
        eve: number;
        max: number;
        min: number;
        morn: number;
        night: number;
    };
    wind: {
        speed: number;
        direction: number;
    };
}

interface HourlyConditions {
    time: number;
    description: string;
    icon: string;
    humidity: number;
    pressure: number;
    temp: number;
    wind: {
        speed: number;
        direction: number;
    };
}