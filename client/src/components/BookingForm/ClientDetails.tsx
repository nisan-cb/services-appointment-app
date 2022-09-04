import React from "react";
import { DataObj } from './BookingForm';


function ClientDetails() {
    const { appointmentData, setAppointmentData } = React.useContext(DataObj);

    const update = (e: any) => {
        setAppointmentData((prev: any) => (
            {
                ...prev,
                [e.target.name]: e.target.value
            }
        ))
    }

    return (
        <div id='client-data-box' >

            <h2>Client Details</h2>
            <label htmlFor="id">
                <p>Id</p>
                <input type="text" placeholder="id" name="id" onChange={e => update(e)} value={appointmentData.id || ''} />
            </label>
            <label htmlFor="name">
                <p>Name</p>
                <input type="text" placeholder="name" name="name" onChange={e => update(e)} value={appointmentData.name || ''} />
            </label>
            <label htmlFor="phoneNumber">
                <p>Phone number</p>
                <input type="text" placeholder="phone number" name="phoneNumber" onChange={e => update(e)} value={appointmentData.phoneNumber || ''} />
            </label>
        </div>
    )
}

export default ClientDetails;