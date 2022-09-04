import React, { createContext, Dispatch, SetStateAction, useState } from 'react';
import './BookingForm.scss';
import BranchSelection from './BranchSelection';
import ClientDetails from './ClientDetails';
import DateSelection from './DateSelection';
import ServicesSelection from './ServiceSelection';

export const DataObj = createContext<any>(undefined);

interface FormProps {
    servicesList: any[],
    branchesList: any[],
    setMsg: Dispatch<SetStateAction<string>>,
    submitHandler: (e: any, appiontmentData: any) => void
}


function BookingForm({ servicesList, branchesList, setMsg, submitHandler }: FormProps) {
    const [currentStep, setCurrentStep] = useState(1);

    const [appointmentData, setAppointmentData] = useState<any>({
        service: undefined,
        branch: undefined,
        id: undefined,
        name: undefined,
        phoneNumber: undefined,
        date: new Date(),
        time: undefined
    });

    // go back to previous step
    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    }

    // proceed to the next step
    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    }

    const submit = (e: any) => {
        submitHandler(e, appointmentData)
    }

    // check which step to display
    const getCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <ServicesSelection servicesList={servicesList}></ServicesSelection>
            case 2:
                return <BranchSelection branchesList={branchesList}></BranchSelection>
            case 3:
                return <DateSelection ></DateSelection>
            case 4:
                return <ClientDetails ></ClientDetails>
            default:
                return <></>
        }
    }

    return (
        <DataObj.Provider value={{ appointmentData, setAppointmentData }}>
            <div id="booking-form">
                {getCurrentStep()}
                <div className='btn-area'>
                    {currentStep > 1 ? <span onClick={prevStep} className='btn prev'>Prev</span> : <></>}
                    {currentStep < 4 ? <span onClick={nextStep} className='btn next'>Next</span> : <></>}
                    {currentStep === 4 ? <span onClick={submit} className='btn submit'>Submit</span> : <></>}
                </div>
            </div>
        </DataObj.Provider>
    )

}


export default BookingForm;