import React from "react";

import './thankPage.scss'


interface PropsI {
    msg: string
}

function ThankPage({ msg }: PropsI) {

    return (
        <section id="thank">
            <h2>{msg}</h2>
        </section>
    )
}

export default ThankPage;

