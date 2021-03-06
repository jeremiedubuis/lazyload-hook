#lazyload-hook

## Install
```
npm install --save lazyload-hook
```

## Usage

```
import * as React from 'react';

import { useLazyLoad } from 'lazyload-hook';

const options = {
  root: null,
  rootMargin: "0px",
  thresholds: [0.0],
};
const Example = () => {
  const [ref] = useLazyload(options);
  return (
    <img ref={ref} data-src="https://picsum.photos/id/0/300/300" alt="" />
  )
}
```

Also works with data-srcset.

## Usage on non image components

```
import React, { useState } from "react";
import { useLazyLoad } from 'lazyload-hook';
import Component from './Component';

const options = {
  root: null,
  rootMargin: "0px",
  thresholds: [0.0],
};
const Example = () => {
  const [displayContent, setDisplayContent] = useState(false);
  const [ref] = useLazyload(options, () => setDisplayContent(true);
  return (
    <div ref={ref}>
        { displayContent && <Component /> }
    </div>
  )
}
```

## Using the LazyLoad compoennt

```
import React from "react";
import { LazyLoad } from 'lazyload-hook';
import Component from './Component';

const options = {
  root: null,
  rootMargin: "0px",
  thresholds: [0.0],
};
const Example = () => 
    <LazyLoad options={options}>
        <Component />
    </LazyLoad>
```

## Caveats

When using this hook for a dynamically updating component be sure to give unique IDs to lazyloaded components or dynamically updated parents.
