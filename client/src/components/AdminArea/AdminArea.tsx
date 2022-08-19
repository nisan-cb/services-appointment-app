import React, { ChangeEvent, ReactElement, ReactHTMLElement, useEffect, useState } from "react";

import './adminArea.scss'

const base_url = window.location.origin;

interface ChangObj {
    target: HTMLSelectElement,
    record: any
}

function AdminArea() {

    const [records, setRecords] = useState<any[]>([]);
    const [statusTypes, setStatusTypes] = useState<string[]>([]);
    const [popup, setPopup] = useState<boolean>(false);
    const [changObj, setChangeObg] = useState<ChangObj>();

    useEffect(() => {
        fetch(`${base_url}/api/status-options`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(typeof data);
                setStatusTypes(data);
            })
            .catch(err => console.log(err));

        fetch(`${base_url}/api/records`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(typeof data);
                setRecords(data)
            })
            .catch(err => console.log(err));




    }, []);


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
        <>
            admin area
            <table>

                <tbody>
                    <tr>
                        <th>No</th>
                        <th>City</th>
                        <th>Name</th>
                        <th>Phone number</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    {
                        records.map(record => {
                            return <tr key={record.number}>
                                <td>{record.number}</td>
                                <td>{record.city}</td>
                                <td>{record.name}</td>
                                <td>{record.phone_number}</td>
                                <td>{record.description}</td>
                                {/* <td>{record.status}</td> */}

                                <td>
                                    <select defaultValue={record.status} onChange={(e) => {
                                        setChangeObg({ 'target': e.target, 'record': record })
                                        setPopup(true)
                                    }
                                    }>
                                        {
                                            statusTypes.map(s => {
                                                return <option key={s} value={s}>{s}</option>
                                            })
                                        }
                                    </select>
                                </td>
                                <td>delete edit</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
            {popup ? popUp() : ''}
        </>
    )
}

export default AdminArea;

