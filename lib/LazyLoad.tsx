import React, { useState } from 'react';
import { useLazyLoad } from './useLazyLoad';
import type { intersectionObserverOptions } from './useIntersectionObserver';

export const LazyLoad = (
    children,
    intersectionObserverConfig?: intersectionObserverOptions,
    onLazyLoad?: Function
) => {
    const [display, setDisplay] = useState(false);
    const [ref] = useLazyLoad(intersectionObserverConfig, () => {
        setDisplay(true);
        if (typeof onLazyLoad === 'function') onLazyLoad();
    });

    return <div ref={ref}>
        {display && children}
    </div>;
};