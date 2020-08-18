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
