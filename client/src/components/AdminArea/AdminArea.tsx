import React from "react";
import WeeklyCalendar from "../WeeklyCalendar/WeeklyCalendar";

import './adminArea.scss'

function AdminArea() {
    console.log('admin component');

    // const changeStatus = (target: any, record: any) => {
    //     console.log('change')
    //     const newStatus = target.value;
    //     const recordNumber = record.number
    //     fetch(`/api/update-record-status/${recordNumber}/${newStatus}`,
    //         {
    //             method: 'PUT',
    //             headers: { 'Content-Type': 'application/json' },
    //         })
    //         .then(response => {
    //             console.log('res')
    //         }) 
    // }

    return (
        <section id="adminArea">
            <WeeklyCalendar></WeeklyCalendar>
        </section>
    )
}

export default AdminArea;

