import React from "react";

interface PropsI {
    clientData: any,
    seters: any
}

function ClientDetails({ clientData, seters }: PropsI) {

    return (
        <div  >
            client details
            <label htmlFor="id">
                <p>Id</p>
                <input type="text" placeholder="id" name="id" onChange={e => seters.setId(e.target.value)} value={clientData.id} />
            </label>
            <label htmlFor="name">
                <p>name</p>
                <input type="text" placeholder="name" name="name" onChange={e => seters.setName(e.target.value)} value={clientData.name} />
            </label>
            <label htmlFor="phoneNumber">
                <p>Phone number</p>
                <input type="text" placeholder="phone number" name="phoneNumber" onChange={e => seters.setPhoneNunber(e.target.value)} value={clientData.phoneNumber} />
            </label>
        </div>
    )
}

export default ClientDetails;