import React from "react";
import { Target } from './WeeklyCalendar'

interface PropI {
    data: any;
    date: string;
    time: string;
}

function RecordContainer({ data, date, time }: PropI) {
    console.log(data);
    const { target, setMsg } = React.useContext(Target);


    const dragStart = (e: any) => {
        // e.preventDefault();
        console.log(e.target);
    };

    const dragEnter = (e: any) => {
        e.preventDefault();
        // console.log('target ', e)
        target.current = {
            el: e.target,
            date: date,
            time: time
        };
    };
    const onDrop = (e: any) => {
        // e.preventDefault();
        console.log('dropped');
        if (target.current.el.dataset.target !== 'true') return;
        target.current.el.append(e.target);

        // send request to update date and time
        fetch(`/api/update-date-time/${data.number}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                destDate: target.current.date,
                destTime: target.current.time
            })
        })
            .then(response => response.json())
            .then(data => setMsg(data.msg))
            .catch(err => console.log(err))


    };


    const recordData = () => {
        if (data)
            return (
                <div className="record"
                    draggable
                    onDragStart={(e) => dragStart(e)}
                >
                    <span>
                        <p>Name: {data.name}</p>
                        <p>Phone: {data.phone_number}</p>
                        <p>Service: {data.description}</p>
                    </span>
                </div>
            )
        else return
    }
    return (
        <div className="record-container"
            data-target={data ? false : true}
            onDragEnter={(e) => dragEnter(e)}
            onDragEnd={(e) => onDrop(e)}
        >
            {recordData()}
        </ div>
    )
}

export default RecordContainer;