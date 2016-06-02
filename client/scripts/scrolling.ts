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

    
export function enableKeyboardScrolling(element: HTMLElement) {
    let scheduledAnimationFrame: number = null;
    let departed: number = null;
    let destination: number = null;
    let eta: number = null;

    function cancelKeyboardScrolling() {
        cancelAnimationFrame(scheduledAnimationFrame);
        scheduledAnimationFrame = null;
        destination = null;
        eta = null;
    }
    
    function scroll(time: number) {
        if (time >= eta) {
            element.scrollLeft = destination;
            scheduledAnimationFrame = null;
            destination = null;
            eta = null;
            return;
        }
        element.scrollLeft = destination - (eta - time) / 250 * (destination - departed);
        scheduledAnimationFrame = requestAnimationFrame(scroll);
    }
    
    element.addEventListener('mousedown', cancelKeyboardScrolling);
    element.addEventListener('touchstart', cancelKeyboardScrolling);
    
    window.addEventListener('keydown', event => {
        if (event.keyCode !== 37 && event.keyCode !== 39) {
            return;
        }
        
        departed = element.scrollLeft;
        const position = destination != null ? destination : departed;
        const newDestination = event.keyCode === 37
            ? Math.max((Math.ceil((position) / 84) - 1) * 84, 0) // Left
            : Math.min((Math.floor((position) / 84) + 1) * 84, element.scrollWidth - element.clientWidth); // Right
        
        if (destination !== newDestination) {
            destination = newDestination;
            eta = performance.now() + 250;
            if (scheduledAnimationFrame == null) {
                scheduledAnimationFrame = requestAnimationFrame(scroll);
            }
        }
    });
    
}
