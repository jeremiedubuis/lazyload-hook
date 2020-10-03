import React from 'react';
import { useLazyLoad } from '../lib';

export const Picture = ({ src }) => {
    let [ref] = useLazyLoad({ rootMargin: '200px' });
    return <img ref={ref} data-src={src} alt="" />;
};
