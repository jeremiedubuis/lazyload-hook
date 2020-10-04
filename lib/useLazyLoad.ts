import { useIntersectionObserver, intersectionObserverOptions } from './useIntersectionObserver';
import { RefObject, useEffect, useState } from 'react';

export const useLazyLoad = (
    intersectionObserverConfig?: intersectionObserverOptions,
    onLazyLoad?: Function
): [RefObject<any>, boolean] => {
    const [ref, isIntersecting, unobserve] = useIntersectionObserver(intersectionObserverConfig);
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
                setIsLoaded(true);
                if (typeof onLazyLoad === 'function') onLazyLoad();
            };
            if (img.complete) onLoad();
            else img.addEventListener('load', onLoad);
        }
    }, [swappedSources]);

    useEffect(() => {
        if (isLoaded || !ref.current) return;
        if (isIntersecting) {
            unobserve(ref.current);
            if (ref.current.tagName.toLowerCase() === 'picture') {
                const sources = Array.from(ref.current.querySelectorAll('source, img'));
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
        }
    }, [isLoaded, isIntersecting]);

    return [ref, isLoaded];
};
