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
    const [records, setRecords] = useState<any[]>([]);
    const [statusTypes, setStatusTypes] = useState<string[]>([]);
    const [popup, setPopup] = useState<boolean>(false);
    const [changObj, setChangeObg] = useState<ChangObj>();

    // useEffect(() => {
    //     fetch(`${base_url}/api/status-options`)
    //         .then(response => response.json())
    //         .then(data => {
    //             setStatusTypes(data);
    //         })
    //         .catch(err => console.log(err));

    // }, []);


    const popUp = () => {
        console.log('popup')
        console.log(changObj)
        return (
            <div className="popup">
                <h3>Are you sure you want to change record status?</h3>
                <button onClick={() => {
                    changObj!.target.value = changObj!.record.status;
                    setPopup(false)
                }}>No</button>
                <button onClick={() => {
                    changeStatus(changObj?.target, changObj?.record)
                    setPopup(false);
                }
                }>Yes</button>
            </div>
        )
    }
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
            {popup ? popUp() : ''}
        </section>
    )
}

export default AdminArea;

