import React from "react";
import {Picture} from "./Picture";

export const App = () =>
    <>
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
    </>;
