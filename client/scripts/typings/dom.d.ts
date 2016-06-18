interface Document {
    createElement<Element extends HTMLElement>(tagName: string): Element;
    getElementById<Node extends HTMLElement>(elementId: string): Node;
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

interface Node {
    appendChild<Element extends Node>(newChild: Element): Element;
}
