import { time } from "console";
import React, { useEffect, useRef, useState } from "react";
import Record from "./record";
import RecordContainer from "./RecordContainer";
import MyDate from "../../classes/date";
import './weeklyCalendar.scss'

const base_url = window.location.origin;

interface ChangObj {
    target: HTMLSelectElement,
    record: any
}
interface Day {
    date: string,
    records: any[]
}

export const Target = React.createContext<any>(undefined);

function WeeklyCalendar() {
    console.log('weekly calendar renderd')
    const currentDate: string = MyDate.dateToString(new Date);

    // state of message
    const [msg, setMsg] = useState<string>('msg');
    // state of first day to display
    const [firstDay, setFirstDay] = useState<Date | string>(MyDate.getFirstDayOfTheWeek(currentDate));
    // data structure of week include records
    const [week, setWeek] = useState<any>(getWeek(currentDate));
    // time range to display in left side
    const [timeRange, setTimeRange] = useState<string[]>(getTimeRange());

    //reference to target cell
    const target = useRef();


    useEffect(() => {
        const start: Date = new Date(firstDay);
        const end = new Date(start.setDate(start.getDate() + 6))

        // fetch records between 2 dates 
        fetch(`${base_url}/api/records/${firstDay}/${MyDate.dateToString(end)}`)
            .then(response => response.json())
            .then(data => {
                setWeek(data.dict)
                setTimeRange(data.timeRange)

            })
            .catch(err => console.log(err));

    }, [firstDay]);

    const displayWeek = () => {
        return (
            <table>
                <tbody>
                    <tr>
                        <th >...</th>
                        {
                            Object.keys(week).map(day => <th key={day}>{day}</th>)
                        }
                    </tr>
                    {
                        timeRange.map((time: string) => {
                            return (
                                <tr key={time}>
                                    <td className="time-td"><span>{time}</span></td>
                                    {
                                        Object.keys(week).map((date: string) => {
                                            return <td key={date} className={date === currentDate ? 'today' : ''}>
                                                <RecordContainer date={date} time={time} data={week[date][time]}></RecordContainer>
                                            </td>
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

        )
    }

    // get prev week
    const getPrev = () => {
        const currentFirstDay: Date = new Date(firstDay!);
        const newFirstDay = new Date(currentFirstDay.setDate(currentFirstDay.getDate() - 7));
        setFirstDay(MyDate.dateToString(newFirstDay));
    }

    // get next week
    const getNext = () => {
        const currentFirstDay: Date = new Date(firstDay);
        const newFirstDay = new Date(currentFirstDay.setDate(currentFirstDay.getDate() + 7));
        setFirstDay(MyDate.dateToString(newFirstDay));
    }

    // display message if exist
    const displayMsg = () => {
        if (msg === '') return <></>
        setTimeout(() => {
            setMsg('');
        }, 3000)

        return <div id='msg'>{msg}</div>
    }


    // return jsx
    return (
        <>
            <div id='panel'>
                <button id="prev-btn" onClick={getPrev}>prev</button>
                <div id='info'>?
                    <span>
                        Try drag and drop records to another cell
                        in order to update date and time in DB.
                    </span>
                </div>
                <button id="next-btn" onClick={(getNext)}>next</button>
            </div>
            <Target.Provider value={{ target, setMsg }}>
                <div id="weeklyCalendar">
                    {displayWeek()}
                    {displayMsg()}
                </div>
            </Target.Provider>
        </>

    )
}


// more fonctions 

// get first day date in same week like d 
function getFirstDayOfTheWeek(d: Date | string) {
    const date = new Date(d);
    const result = new Date(date.setDate(date.getDate() - date.getDay()));
    return MyDate.dateToString(result);
}

// get all the week
function getWeek(d: string) {
    const result: any = {};
    const sunday = new Date(MyDate.getFirstDayOfTheWeek(new Date(d)));
    result[MyDate.dateToString(sunday)] = {}
    while (sunday.setDate(sunday.getDate() + 1) && sunday.getDay() !== 0)
        result[MyDate.dateToString(sunday)] = {}
    return result;
}



function getTimeRange() {
    const result: string[] = [];
    for (let i = 6; i <= 23; i++) {
        const h = i < 10 ? `0${i}` : i;
        result.push(`${h}:00`);
        result.push(`${h}:30`);
    }
    return result;

}
function timeFormat(t: any) {
    const h = t.hour < 10 ? `0${t.hour}` : t.hour
    const m = t.minuts < 10 ? `0${t.minuts}` : t.minuts
    return `${h}:${m}`;
}



export default WeeklyCalendar;

