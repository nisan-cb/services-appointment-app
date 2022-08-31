import React, { ChangeEvent, ReactElement, ReactHTMLElement, useEffect, useState } from "react";
import WeeklyCalendar from "../WeeklyCalendar/WeeklyCalendar";

import './adminArea.scss'

const base_url = window.location.origin;

interface ChangObj {
    target: HTMLSelectElement,
    record: any
}

function AdminArea() {
    console.log('admin component');

    const changeStatus = (target: any, record: any) => {
        console.log('change')
        const newStatus = target.value;
        const recordNumber = record.number
        fetch(`${base_url}/api/update-record-status/${recordNumber}/${newStatus}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(response => {
                console.log('res')
            })

    }

    return (
        <section id="adminArea">
            <WeeklyCalendar></WeeklyCalendar>
        </section>
    )
}

export default AdminArea;

