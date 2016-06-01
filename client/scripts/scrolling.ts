export function enableDailyScrolling(element: HTMLElement) {
    // Mouse events:
    let lastMouseEvent: MouseEvent = null;
    
    element.addEventListener('mousedown', event => {
        event.preventDefault();
        document.documentElement.classList.add('grabbing');
        lastMouseEvent = event;
    });
    
    window.addEventListener('mousemove', event => {
        if (lastMouseEvent != null) {
            event.preventDefault();
            element.scrollLeft = element.scrollLeft + lastMouseEvent.clientX - event.clientX;
            lastMouseEvent = event;
        }
    });
    
    const onMouseEnd = () => {
        document.documentElement.classList.remove('grabbing');
        lastMouseEvent = null;
    };
    window.addEventListener('mouseup', onMouseEnd);
    window.addEventListener('blur', onMouseEnd);
    
    // Touch events:
    let lastTouch: Touch = null;
    
    element.addEventListener('touchstart', event => {
        event.preventDefault();
        lastTouch = event.touches[0];
    });
    
    window.addEventListener('touchmove', (event: TouchEvent) => {
        if (lastTouch != null) {
            event.preventDefault();
            const touch = event.touches[0];
            element.scrollLeft = element.scrollLeft + lastTouch.clientX - touch.clientX;
            document.documentElement.scrollTop = document.documentElement.scrollTop + lastTouch.clientY - touch.clientY;
            lastTouch = touch;
        }
    });
    
    const onTouchEnd = () => { lastTouch = null; };
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);
    window.addEventListener('blur', onTouchEnd);
}
