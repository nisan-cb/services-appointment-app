import React from "react";
import Record from "./Record";
import { Target } from './WeeklyCalendar'

interface PropI {
    date: string;
    time: string;
    children: React.ReactNode;
}

function RecordContainer({ date, time, children }: PropI) {
    const { draggedRecord, setMsg, setCurrRecord, setWeek } = React.useContext(Target);

    const onDrop = (e: any) => {
        console.log('dropped');
        console.log(draggedRecord);
        draggedRecord.current.el.classList.remove('in-air')
        // check if valid cell
        if (e.target.dataset.target !== 'true') return;
        // remember prev date and time
        const prevDate = draggedRecord.current.data.date
        const prevTime = draggedRecord.current.data.time
        console.log('prev : ', prevDate, prevTime);
        console.log('new : ', date, time);
        draggedRecord.current.data = { ...draggedRecord.current.data, 'date': date, 'time': time }
        // update new cell
        setWeek((prev: any) => ({
            ...prev,
            [date]: { ...prev[date], [time]: draggedRecord.current.data },
        }))
        // update prev cell
        setWeek((prev: any) => ({
            ...prev,
            [prevDate]: { ...prev[prevDate], [prevTime]: undefined }
        }))
        // send request to update date and time
        fetch(`/api/update-date-time/${draggedRecord.current.data.number}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destDate: date,
                destTime: time
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.msg === true)
                    setMsg('update completed');
                else
                    setMsg('update failed');
            })
            .catch(err => {
                console.log(err)
            });
    };


    return (
        <div className="record-container"
            data-target={children ? false : true}
            onDragOver={e => { e.preventDefault() }}
            onDrop={e => onDrop(e)}
            onClick={e => setCurrRecord(undefined)}
        >
            {children}
        </ div>
    )
}

export default RecordContainer;