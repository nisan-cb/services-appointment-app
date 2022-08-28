import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import './BookingForm.scss';
import BranchSelection from './BranchSelection';
import ClientDetails from './ClientDetails';
import DateSelection from './DateSelection';
import ServicesSelection from './ServiceSelection';


interface FormProps {
    servicesList: any[],
    branchesList: any[],
    setMsg: Dispatch<SetStateAction<string>>,
    submitHandler: (e: any, appiontmentData: any) => void
}

export const dataContext = createContext({});

function BookingForm({ servicesList, branchesList, setMsg, submitHandler }: FormProps) {
    const [currentStep, setCurrentStep] = useState(1);

    // appointment data
    const [service, setService] = useState<number | null>(null);
    const [branch, setBranch] = useState<number | null>(null);
    const [id, setId] = useState<string | undefined>('');
    const [name, setName] = useState<string | undefined>('');
    const [phoneNumber, setPhoneNunber] = useState<string | undefined>('');
    const [date, setDate] = useState<Date | undefined>(new Date(new Date().setHours(0, 0, 0, 0)));
    const [time, setTime] = useState<any>({ h: undefined, m: undefined });

    // go back to previous step
    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    }

    // proceed to the next step
    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    }

    const submit = (e: any) => {
        console.log(date?.toLocaleDateString());
        submitHandler(e, {
            service: service,
            branch: branch,
            client_id: id,
            client_name: name,
            phone_number: phoneNumber,
            date: date?.toLocaleDateString(),
            time: time
        })
    }

    // check which step to display
    const getCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <ServicesSelection servicesList={servicesList} setService={setService} service={service}></ServicesSelection>
            case 2:
                return <BranchSelection branchesList={branchesList} setBranch={setBranch} branch={branch}></BranchSelection>
            case 3:
                return <DateSelection date={date} time={time} setTime={setTime} setDate={setDate}></DateSelection>
            case 4:
                return <ClientDetails clientData={{ id, name, phoneNumber }} seters={{ setId, setName, setPhoneNunber }}></ClientDetails>
            default:
                return <></>
        }
    }

    return (
        // <dataContext.Provider value={ }>
        <div id="booking-form">
            {getCurrentStep()}
            <div className='btn-area'>
                {currentStep > 1 ? <span onClick={prevStep} className='btn prev'>Prev</span> : <></>}
                {currentStep < 4 ? <span onClick={nextStep} className='btn next'>Next</span> : <></>}
                {currentStep === 4 ? <span onClick={submit} className='btn submit'>Submit</span> : <></>}
            </div>
        </div>
        // </dataContext.Provider>
    )

}


export default BookingForm;