import { intersectionObserverOptions } from './useIntersectionObserver';
import { RefObject } from 'react';
export declare const useLazyLoad: (intersectionObserverConfig?: intersectionObserverOptions, onLazyLoad?: Function) => [RefObject<any>, boolean];
