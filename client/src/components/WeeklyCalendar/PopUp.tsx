import React from "react";

interface PropsI {
    // children: React.ReactNode
    recordData: any;
}

function PopUp({ recordData }: PropsI) {

    return (
        <div className="pop-up">
            <tr >
                <td>Order Number</td>

                <td>{recordData.number}</td>
            </tr>
            <tr >
                <td>Name</td>
                <td>{recordData.name}</td>
            </tr>
            <tr >
                <td>Phon Number</td>
                <td>{recordData.phone_number}</td>
            </tr>
            <tr >
                <td>Branch</td>
                <td>{recordData.city}</td>
            </tr>
            <tr >
                <td>Service</td>
                <td>{recordData.description}</td>
            </tr>
            <tr >
                <td>status</td>
                <td>{recordData.status}</td>
            </tr>

        </div>
    )
}

export default PopUp;