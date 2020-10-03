import { RefObject } from 'react';
export declare type intersectionObserverOptions = {
    root?: HTMLElement | null;
    rootMargin?: string;
    threshold?: number;
};
export declare const useIntersectionObserver: ({ root, rootMargin, threshold }?: intersectionObserverOptions) => [RefObject<HTMLElement>, boolean, Function];
