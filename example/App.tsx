import React, { useState } from "react";
import {Picture} from "./Picture";
import { useLazyLoad } from '../lib';

export const App = () => {
    const [ display, setDisplay ] = useState(false);
    const [ sectionDisplay, setSectionDisplay ] = useState(false);
    const [ref] = useLazyLoad({}, () => setSectionDisplay(true));

    return <>
        <section>
            <Picture src="https://picsum.photos/id/0/300/300" />
            <Picture src="https://picsum.photos/id/1/300/300" />
            <Picture src="https://picsum.photos/id/2/300/300" />
        </section>
        <section>
            <Picture src="https://picsum.photos/id/10/300/300" />
            <Picture src="https://picsum.photos/id/11/300/300" />
            <Picture src="https://picsum.photos/id/12/300/300" />
        </section>
        <section>
            {!display && <button onClick={() => setDisplay(true)}>Display</button>}
            {display && <Picture src="https://picsum.photos/id/13/300/300" />}
        </section>
        <section ref={ref}>
            { sectionDisplay && <Picture src="https://picsum.photos/id/12/300/300" /> }
        </section>
    </>;
}
