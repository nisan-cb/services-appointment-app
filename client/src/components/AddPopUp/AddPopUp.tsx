import React, { ReactNode, useEffect, useRef, useState } from "react";
import { JsxElement } from "typescript";
import './addPopUp.scss'
import { Target } from '../WeeklyCalendar/WeeklyCalendar'

interface PropI {
    date: string;
    time: string;
}

function AddPopUP({ date, time }: PropI) {
    const { setAddFlag } = React.useContext(Target);


    const [servicesList, setSercivesList] = useState<any[]>([]);
    const [branchesList, setBranchesList] = useState<any[]>([]);
    const [clientList, setClientsList] = useState<any[]>([]);

    const [anyClientData, setAnyClinetData] = useState<string>('');
    const [top5results, setTop5results] = useState<any[]>([])

    const recordData = useRef<any>({ id: undefined, service: undefined, branch: undefined });

    useEffect(() => {
        fetch('/api/services')
            .then(res => res.json())
            .then(data => setSercivesList(data))
            .catch(err => console.log(err));

        fetch('/api/branches')
            .then(res => res.json())
            .then(data => setBranchesList(data))
            .catch(err => console.log(err));

        fetch('/api/clients')
            .then(res => res.json())
            .then(data => setClientsList(data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        const firstChar = Number(anyClientData.slice(0, 1));
        let filterList = [];
        if (isNaN(firstChar))  //string
            filterList = clientList.filter(c => c.name.startsWith(anyClientData));
        else  // number
            filterList = clientList.filter(c => c.phone_number.startsWith(anyClientData));


        filterList = filterList.slice(0, 5);
        setTop5results(filterList)
    }, [anyClientData]);

    const createRecord = () => {
        const { id, branch, service } = recordData.current;
        recordData.current = { ...recordData.current, 'date': date, 'time': time }
        if (!id || !branch || !service) return;
        fetch('/api/addRecord', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recordData.current)
        })
            .then(res => res.json())
            .then(data => setAddFlag(false))
            .catch(err => console.log(err));

    }



    return (
        <div className="add-popup">
            <h3>{date} {time} </h3>
            <div id='search'>

                <input
                    type="text"
                    placeholder="Any client data "
                    value={anyClientData}
                    onChange={e => setAnyClinetData(e.target.value)}
                />
                <div id="results">
                    {
                        top5results.map(c => {
                            return <span key={c.id}
                                onClick={e => {
                                    recordData.current = { ...recordData.current, 'id': c.id }
                                    setAnyClinetData(`${c.name}  ${c.phone_number}`)
                                }}
                            >{c.name}  {c.phone_number}</span>
                        })
                    }
                </div>
            </div>

            <select name="service" id="" defaultValue={0}
                onChange={(e) => { recordData.current = { ...recordData.current, 'service': e.target.value } }}
            >
                <option value={0} disabled >select service type</option>
                {servicesList.map((s) => <option
                    key={s.code} value={s.code}
                >{s.description}</option>)}
            </select>

            <select name="branches" id="" defaultValue={0}
                onChange={(e) => recordData.current = { ...recordData.current, 'branch': e.target.value }}
            >
                <option value={0} disabled>select city</option>
                {branchesList.map((b) => <option
                    key={b.code} value={b.code}
                >{b.city}</option>)}
            </select>

            <button onClick={() => createRecord()}>Submit</button>
        </div>
    )
}


export default AddPopUP