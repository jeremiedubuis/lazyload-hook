import { RefObject, useEffect, useRef, useState } from 'react';
import { onIntersect } from './onIntersect';

export type intersectionObserverOptions = {
    root?: HTMLElement | null;
    rootMargin?: string;
    threshold?: number;
};

export const useLazyLoad = (
    intersectionObserverConfig?: intersectionObserverOptions,
    onLazyLoad?: Function,
    ignore?: boolean
): [RefObject<any> | null, boolean] => {
    if (ignore) return [null, true];

    const ref = useRef<any>();
    const [swappedSources, setSwappedSources] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!ref.current || !swappedSources) return;
        let img: HTMLImageElement | null = null;
        if (ref.current.tagName.toLowerCase() === 'picture')
            img = ref.current.getElementsByTagName('img')[0];
        if (ref.current.tagName.toLowerCase() === 'img') img = ref.current as HTMLImageElement;

        if (img !== null) {
            const onLoad = () => {
                if (ref.current) {
                    setIsLoaded(true);
                    if (typeof onLazyLoad === 'function') onLazyLoad();
                }
            };
            if (img.complete) onLoad();
            else {
                img.addEventListener('load', onLoad);
            }
        }
    }, [swappedSources]);

    useEffect(() => {
        ref.current.style.minWidth = '1px';
        ref.current.style.minHeight = '1px';
        const unobserve = onIntersect(
            ref.current,
            () => {
                unobserve();
                if (ref.current.tagName.toLowerCase() === 'picture') {
                    const sources: (HTMLSourceElement | HTMLImageElement)[] = Array.from(
                        ref.current.querySelectorAll('source, img')
                    );
                    sources.forEach((source) => {
                        const srcSet = source.getAttribute('data-srcset');
                        if (srcSet) {
                            source.setAttribute('srcset', srcSet);
                            source.removeAttribute('data-srcset');
                        }
                        const src = source.getAttribute('data-src');
                        if (src) {
                            source.setAttribute('src', src);
                            source.removeAttribute('data-src');
                        }
                    });
                    setSwappedSources(true);
                } else if (ref.current.tagName.toLowerCase() === 'img') {
                    const src = ref.current.getAttribute('data-src');
                    if (src) {
                        ref.current.setAttribute('src', src);
                        ref.current.removeAttribute('data-src');
                        setSwappedSources(true);
                    }
                } else if (typeof onLazyLoad === 'function') {
                    setIsLoaded(true);
                    onLazyLoad();
                }
            },
            intersectionObserverConfig
        );

        return () => unobserve();
    }, []);

    return [ref, isLoaded];
};
