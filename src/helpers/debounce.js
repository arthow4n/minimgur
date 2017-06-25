export default function debounce(fn, throttle = 300, context = null) {
    let timer;
    return (...args) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
           fn.apply(context, args);
        }, throttle);
    }
}
