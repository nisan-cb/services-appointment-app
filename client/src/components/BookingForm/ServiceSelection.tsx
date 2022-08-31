import React from "react";
import { DataObj } from './BookingForm'
interface PropsI {
    servicesList: any[],
}

function ServicesSelection({ servicesList }: PropsI) {
    const { appointmentData, setAppointmentData } = React.useContext(DataObj);

    const select = (code: number) => {
        setAppointmentData((prev: any) => ({ ...prev, service: code }))
    }

    return (
        <div id="service-selection">
            <h2>Service Selection</h2>
            <ul>
                {
                    servicesList.map(item => {
                        return <li
                            value={item.code}
                            key={item.code}
                            className={item.code === appointmentData?.service ? 'selected' : ''}
                            onClick={() => { select(item.code) }}

                        >{item.description}</li>
                    })
                }
            </ul>
        </div >
    )
}
export default ServicesSelection;