import type { intersectionObserverOptions } from './useLazyLoad';

const ios = [];

function fireCallbacks(entries: IntersectionObserverEntry[], _id: number) {
    const io = ios.find(({ id }) => id === _id);
    io.callbacks
        .filter(({ el }) => entries.find((e) => e.target === el && e.isIntersecting))
        .forEach(({ callback }) => callback());
}

const getIntersectionObserver = (_options: intersectionObserverOptions = {}) => {
    let io = ios.find(
        ({ options }) =>
            options === _options ||
            (_options.rootMargin === options.rootMargin &&
                _options.threshold === options.threshold &&
                _options.root === options.root)
    );
    if (!io) {
        const id = ios.length;
        io =
            ios[
                ios.push({
                    id,
                    instance: new IntersectionObserver(entries => fireCallbacks(entries, id), _options),
                    options: _options,
                    callbacks: []
                }) - 1
            ];
    }

    return io;
};

export const onIntersect = (
    _el: HTMLElement,
    _callback: Function,
    options: intersectionObserverOptions
) => {
    if (typeof IntersectionObserver === 'undefined' || !IntersectionObserver)  {
        _callback();
        return () => {};
    }
    const io = getIntersectionObserver(options);
    let callback;

    const unobserve = () => {
        io.instance.unobserve(_el);
        const callbackIndex = io.callbacks.findIndex(({ el }) => el === _el);
        if (callbackIndex > -1) io.callbacks.splice(callbackIndex, 1);
    };

    callback = () => {
        _callback();
        unobserve();
    };

    io.callbacks.push({ el: _el, callback });
    io.instance.observe(_el);

    return unobserve;
};
