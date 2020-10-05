import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { useLazyLoad } from './useLazyLoad';
import type { intersectionObserverOptions } from './useLazyLoad';

export type LazyLoadProps = {
    children: ReactNode;
    options?: intersectionObserverOptions;
    onLazyLoad?: Function;
};

export const LazyLoad: React.FC<LazyLoadProps> = ({ children, options, onLazyLoad }) => {
    const [display, setDisplay] = useState(false);
    const [ref] = useLazyLoad(options, () => {
        setDisplay(true);
        if (typeof onLazyLoad === 'function') onLazyLoad();
    });

    return <div ref={ref}>{display && children}</div>;
};
