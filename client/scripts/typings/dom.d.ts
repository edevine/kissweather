interface Document {
    getElementById<Node extends Element>(elementId: string): Node;
}

interface NodeSelector {
    querySelector<Node extends Element>(selectors: string): Node;
    querySelectorAll<Node extends Element>(selectors: string): NodeListOf<Node>;
}

interface Element {
    cloneNode(deep?: boolean): Element;
}

interface HTMLElement {
    cloneNode(deep?: boolean): HTMLElement;
}