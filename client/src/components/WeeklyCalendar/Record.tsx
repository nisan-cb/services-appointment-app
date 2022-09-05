import React from "react";
import { Target } from './WeeklyCalendar'

interface PropI {
    data: any;
}



function Record({ data }: PropI) {
    const { draggedRecord, currRecord, setCurrRecord, statusTypes, setWeek } = React.useContext(Target);

    const dragStart = (e: any) => {
        draggedRecord.current = {
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

    const deleteRecord = (e: any) => {
        fetch(`/api/delete-record/${data.number}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(msgRes => {
                if (msgRes.msg === true)
                    setWeek((prev: any) => ({
                        ...prev,
                        [data.date]: { ...prev[data.date], [data.time]: undefined }
                    }))
            })
            .then(err => console.log(err));
    }

    const actions = () => {
        return (
            <ul className="status-type-list">
                {statusTypes.map((s: string) => <li key={s} onClick={() => updateStatus(s)}>{s}</li>)}
                <li className="delete-record-btn" onClick={e => deleteRecord(e)}>Delete</li>
            </ul>
        );
    }



    const updateStatus = (newStatus: string) => {
        fetch(`/api/update-record-status/${data.number}/${newStatus}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            })
            .then(response => response.json())
            .then(msgObj => {
                if (msgObj.msg === true) {
                    data = { ...data, 'status': newStatus }
                    setWeek((prev: any) => ({
                        ...prev,
                        [data.date]: { ...prev[data.date], [data.time]: { ...data, 'status': newStatus } }
                    }))
                }
            })
            .catch(err => console.log(err));

    }
    // const sendMsg = () => {
    //     console.log('send msg')
    // }

    return (
        <div className={"record " + (data.status).replace(' ', '-')}
            draggable
            onDragStart={(e) => dragStart(e)}
            onClick={e => onClick(e)}
            onMouseDown={(e: any) => e.target.classList.add('in-air')}
            onMouseUp={(e: any) => e.target.classList.remove('in-air')}
        >
            <span>
                <p>Name: {data.name}</p>
                <p>Phone: {data.phone_number}</p>
                <p>Branch: {data.city}</p>
                <p>Service: {data.description}</p>
            </span>
            {currRecord === data.number ? actions() : undefined}
            <div className="tooltip">{data.status}</div>
        </div >
    )
}

export default Record;


