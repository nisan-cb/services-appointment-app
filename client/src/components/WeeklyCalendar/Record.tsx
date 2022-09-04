import React, { useState } from "react";
import { Target } from './WeeklyCalendar'

import statusIcon from '../../images/status.png'
import drag from '../../images/drag.png'
import msgIcon from '../../images/msg.png'
import { dblClick } from "@testing-library/user-event/dist/click";

interface PropI {
    data: any;
}



function Record({ data }: PropI) {
    const { currentRecord, currRecord, setCurrRecord, statusTypes, setWeek } = React.useContext(Target);
    console.log(data);
    const dragStart = (e: any) => {
        currentRecord.current = {
            el: e.target,
            data: data
        }
    };

    const onClick = (e: any) => {
        e.stopPropagation();
        if (currRecord === data.number)
            setCurrRecord(undefined);
        else
            setCurrRecord(data.number);
    }

    const actions = () => {
        return (
            <ul className="status-type-list">
                {statusTypes.map((s: string) => <li key={s} onClick={() => updateStatus(s)}>{s}</li>)}
            </ul>
        );
    }

    const call = () => {
        console.log('calling')
    }
    const updateStatus = (newStatus: string) => {
        console.log('status')
        fetch(`/api/update-record-status/${data.number}/${newStatus}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(response => response.json())
            .then(msgObj => {
                console.log(msgObj)
                console.log(data)
                if (msgObj.msg === true) {
                    data = { ...data, ['status']: newStatus }
                    setWeek((prev: any) => ({
                        ...prev,
                        [data.date]: { ...prev[data.date], [data.time]: { ...data, ['status']: newStatus } }
                    }))
                }
            })
            .catch(err => console.log(err));

    }
    const sendMsg = () => {
        console.log('send msg')
    }

    return (
        <div className={"record " + (data.status).replace(' ', '-')}
            draggable
            onDragStart={(e) => dragStart(e)}
            onClick={e => onClick(e)}
            onMouseDown={(e: any) => e.target.classList.add('in-air')}
            onMouseUp={(e: any) => e.target.classList.remove('in-air')}
        >
            <span>
                <p>No: {data.number}</p>
                <p>Name: {data.name}</p>
                <p>Phone: {data.phone_number}</p>
                <p>Branch: {data.city}</p>
                <p>Service: {data.description}</p>
            </span>
            {currRecord === data.number ? actions() : undefined}
        </div >
    )
}

export default Record;