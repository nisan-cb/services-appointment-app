import React, { useContext } from "react";
import { DataObj } from './BookingForm';
interface PropsI {
    branchesList: any[],
}

function BranchSelection({ branchesList }: PropsI) {
    const { appointmentData, setAppointmentData } = useContext(DataObj);

    const select = (code: number) => {
        setAppointmentData((prev: any) => ({ ...prev, branch: code }))
    }


    return (
        <div id="bramch-selection">
            <h2>Branch Selection</h2>
            <ul>
                {
                    branchesList.map(item => {
                        return <li
                            value={item.code}
                            key={item.code}
                            className={item.code === appointmentData.branch ? 'selected' : ''}
                            onClick={() => select(item.code)}
                        >{item.city}</li>

                    })
                }
            </ul>
        </div>
    )
}

export default BranchSelection;