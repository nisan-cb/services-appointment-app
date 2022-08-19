import React, { ChangeEvent } from "react";

interface PropsI {
    date: Date | undefined,
    setDate: any
}

function DateSelection({ date, setDate }: PropsI) {
    console.log(date);
    const changeHandler = (e: any) => {
        console.log(e.target.value);
        setDate(e.target.value);
    }

    return (
        <div  >
            Date Selection
            <br></br>
            <input type="date" id="date" name="date" onChange={e => changeHandler(e)}></input>
        </div>
    )
}

export default DateSelection;