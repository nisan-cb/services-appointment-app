import React, { useEffect, useState } from "react";
import BookingForm from "../BookingForm/BookingForm";
import './appointmentPage.scss'

const base_url = window.location.origin;

function AppiontmentPage() {
    const [servicesList, setServicesList] = useState<any[]>([]);
    const [branchesList, setBranchesList] = useState<any[]>([]);
    const [msg, setMsg] = useState<string>('msg');


    useEffect(() => {
        // get all services type from server
        fetch(`${base_url}/api/services`)
            .then(response => response.json())
            .then(data => { setServicesList(data) })
            .catch(err => console.log(err));

        // get all branches from server
        fetch(`${base_url}/api/branches`)
            .then(response => response.json())
            .then(data => setBranchesList(data))
            .catch(err => console.log(err));
    }, []);

    // run when click on submit
    const submitHandler = (e: any, appiontmentData: any) => {
        e.preventDefault();
        // sent POST request to server
        fetch(`${base_url}/api/insertNewRecord`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appiontmentData)
        })
            .then(response => response.json())
            .then(data => setMsg(data.msg))
            .catch(err => console.log(err));
    }


    const displayMsg = (msg: string) => {
        if (msg !== '') {
            setTimeout(() => {
                setMsg('');
            }, 4000);
            return <div id='msg'> {msg}</div>
        }

    }

    const goToAdminArea = () => {
        window.open(`${base_url}/admin`, '_blank')?.focus();
    }


    return (
        <section>
            appiontment page
            <button id="btn-admin" onClick={goToAdminArea}>Admin</button>
            <BookingForm
                servicesList={servicesList}
                branchesList={branchesList}
                setMsg={setMsg}
                submitHandler={submitHandler}
            ></BookingForm>
            {displayMsg(msg)}
        </section >
    )
}

export default AppiontmentPage;