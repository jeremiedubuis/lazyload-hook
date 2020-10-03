import { RefObject, useEffect, useRef, useState } from 'react';
import isEqual from 'lodash.isequal';

export type intersectionObserverOptions = {
    root?: HTMLElement | null;
    rootMargin?: string;
    threshold?: number;
};

type intersectionObserversArray = [IntersectionObserver, intersectionObserverOptions, Function[]];

let intersectionObservers: intersectionObserversArray[] = [];

const intersectionObserverCallback: IntersectionObserverCallback = function (
    this: IntersectionObserver,
    entries: IntersectionObserverEntry[]
) {
    const io = intersectionObservers.find(([observer]) => observer === this);
    if (io) io[2].forEach((cb) => cb(entries));
};

const getIntersectionObserver = (
    callback: IntersectionObserverCallback,
    options: intersectionObserverOptions
): IntersectionObserver => {
    const io = intersectionObservers.find(([io, _options]) => isEqual(options, _options));
    if (io) {
        io[2].push(callback);
        return io[0];
    }
    intersectionObservers.push([
        new IntersectionObserver(intersectionObserverCallback, options),
        options,
        [callback]
    ]);
    return intersectionObservers[intersectionObservers.length - 1][0];
};

export const useIntersectionObserver = ({
    root = null,
    rootMargin = '0px',
    threshold = 0.0
}: intersectionObserverOptions = {}): [RefObject<HTMLElement>, boolean, Function] => {
    const ref = useRef<any>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const unregister = useRef<Function | null>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    useEffect(() => {
        const callback = (entries: IntersectionObserverEntry[]) => {
            setIsIntersecting(
                !!entries.find(
                    ({ isIntersecting, target }) => isIntersecting && target === ref.current
                )
            );
        };

        observer.current = getIntersectionObserver(callback, {
            root,
            rootMargin,
            threshold
        });

        unregister.current = () => {
            if (ref.current && observer.current) {
                observer.current.unobserve(ref.current);
                const io = intersectionObservers.find(([io]) => io === observer.current);
                if (io) {
                    // race condition on IntersectionObserver callback firing on first load
                    setTimeout(function () {
                        io[2].splice(io[2].indexOf(callback), 1);
                    }, 0);
                }
            }
        };

        if (ref.current) {
            observer.current.observe(ref.current);
        }

        return () => {
            if (unregister.current) unregister.current();
        };
    }, []);

    return [
        ref,
        isIntersecting,
        () => {
            if (unregister.current) unregister.current();
        }
    ];
};
