import React, { useState } from "react";
import { DataObj } from './BookingForm';


function DateSelection() {
    const { appointmentData, setAppointmentData } = React.useContext(DataObj);


    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var yearMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    // get today date without time
    let today = new Date(new Date().setHours(0, 0, 0, 0));

    const [dateToDisplay, setDateToDisplay] = useState(new Date(appointmentData.date));
    const [possibleTime, setPossibleTime] = useState<any[]>([]);
    const year = dateToDisplay.getFullYear();
    const month = dateToDisplay.getMonth();


    const getDays = (): Date[] => {
        const daysOfPrevMonth = new Date(year, month, 1).getDay();
        const days = []
        for (let i = 1 - daysOfPrevMonth; i <= 42 - daysOfPrevMonth; i++)
            days.push(new Date(year, month, i));
        return days;
    }

    const updateDate = (d: any) => {
        setAppointmentData((prev: any) => ({
            ...prev,
            date: new Date(d).toLocaleDateString(),
            time: { h: undefined, m: undefined }
        }))

        // fetch possible meeting time in this day
        fetch(`/api/get-possible-meeting-time/${d.toLocaleDateString().replaceAll('/', '-')}`)
            .then(respone => respone.json())
            .then(data => setPossibleTime(data))
            .catch(err => console.log(err));
    }


    const displayDays = (daysArr: Date[]) => {
        const result = [];
        const daysElements = daysArr.map(d => {
            return <td key={d.getTime()}
                id={d.getTime() === today.getTime() ? 'today' : ''}
                className={'day'
                    + ((d.getMonth() === month) ? ' curr-month' : '')
                    + (new Date(appointmentData.date).getTime() === d.getTime() ? ' selected' : '')
                }
                onClick={() => updateDate(d)}
            >{d.getDate()}</td>
        });

        for (let i = 0; i < daysElements.length; i = i + 7) {
            const week = daysElements.slice(i, i + 7);
            const tr = <tr key={i}>{week}</tr>
            result.push(tr);
        }
        return result;
    }

    const nextMonth = () => {
        setDateToDisplay(new Date(year, month + 1));
    }
    const prevMonth = () => {
        setDateToDisplay(new Date(year, month - 1));
    }



    const displayTimes = () => {
        const result: JSX.Element[] = [];

        possibleTime.forEach((t, i) => {
            const h = t.h < 10 ? `0${t.h}` : `${t.h}`;
            const m = t.m < 10 ? `0${t.m}` : `${t.m}`;
            result.push(<li
                key={i}
                className={(t.h === appointmentData.time.h && t.m === appointmentData.time.m) ? 'selected' : ''}
                onClick={() => setAppointmentData((prev: any) => ({ ...prev, time: t }))} >{h + ':' + m}</li>);
        });
        return result;

    }

    return (
        <>
            <h2>Date and Time Selection</h2>
            <div id="date-time-selection">
                <div id="date-selection">
                    <div className="title">
                        <p>{yearMonths[month]} {year} </p>
                        <button id='next' onClick={nextMonth}>↓</button>
                        <button id='prev' onClick={prevMonth}>↑</button>
                    </div>

                    <table>
                        <tbody>
                            <tr>
                                {weekdays.map(day => <th key={day} >{day}</th>)}
                            </tr>
                            {displayDays(getDays())}
                        </tbody>
                    </table>

                </div>

                <div id='time-selection'>
                    <ul>
                        {displayTimes()}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default DateSelection;