import React, { ChangeEvent, ReactElement, ReactHTMLElement, useEffect, useState } from "react";

import './thankPage.scss'

const base_url = window.location.origin;

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

