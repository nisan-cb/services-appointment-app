import React from "react";
import { JsxChild } from "typescript";
import { Target } from './WeeklyCalendar'

interface PropI {
    // data: any;
    date: string;
    time: string;
    children: React.ReactNode;
}

function RecordContainer({ date, time, children }: PropI) {
    const { target, currentRecord, setMsg, setCurrRecord } = React.useContext(Target);

    const dragEnter = (e: any) => {
        e.preventDefault();
        target.current = {
            el: e.target,
            date: date,
            time: time
        };
    };

    const onDrop = (e: any) => {
        console.log('dropped');
        e.target.classList.remove('in-air')
        if (target.current.el.dataset.target !== 'true') return;
        const prevContainer = e.target.parentNode;
        target.current.el.append(e.target);

        // send request to update date and time
        fetch(`/api/update-date-time/${currentRecord.current.data.number}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destDate: target.current.date,
                destTime: target.current.time
            })
        })
            .then(response => response.json())
            .then(data => {
                prevContainer.setAttribute('data-target', 'true');
                setMsg(data.msg)
            })
            .catch(err => {
                // if impossible update yhen return to prev cell
                prevContainer.append(e.target);
                console.log(err)
            });
    };


    return (
        <div className="record-container"
            data-target={children ? false : true}
            onDragEnter={(e) => dragEnter(e)}
            onDragOver={e => { e.preventDefault() }}
            onDragEnd={(e) => onDrop(e)}
            onClick={e => setCurrRecord(undefined)}
        >
            {children}
        </ div>
    )
}

export default RecordContainer;