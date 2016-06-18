interface DailyForecastListElement extends HTMLUListElement {
    children: HTMLCollectionOf<DailyForecastItemElement>;
}

interface DailyForecastItemElement extends HTMLLIElement {
    children: HTMLCollection & {
        0: HTMLParagraphElement;
        1: HTMLParagraphElement;
        2: HTMLImageElement;
        3: HTMLParagraphElement;
    };
    cloneNode(deep?: boolean): DailyForecastItemElement;
}
