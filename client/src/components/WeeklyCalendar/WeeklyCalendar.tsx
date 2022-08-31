import { time } from "console";
import React, { useEffect, useRef, useState } from "react";
import Record from "./record";
import RecordContainer from "./RecordContainer";

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
    const currentDate: Date | string = formatDate(new Date());

    const target = useRef();
    const [msg, setMsg] = useState<string>('msg')
    const [firstDay, setFirstDay] = useState<Date | string>(getFirstDayOfTheWeek(currentDate));
    const [week, setWeek] = useState<any>(getWeek(currentDate));
    const [timeRange, setTimeRange] = useState<string[]>(getTimeRange());


    useEffect(() => {
        // setWeek(getWeek(firstDay));
        const start: Date = new Date(firstDay);
        const end = new Date(start.setDate(start.getDate() + 6))
        console.log(firstDay, ' - ', formatDate(end));

        // if (!week?.length) return;
        // fetch records between w dates 
        fetch(`${base_url}/api/records/${firstDay}/${formatDate(end)}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setWeek(data.dict)
                setTimeRange(data.timeRange)

            })
            .catch(err => console.log(err));

    }, [firstDay]);

    const displayWeek = () => {
        return (

            <>

                <table>
                    <tbody>
                        <tr>
                            <th >'......'</th>
                            {
                                Object.keys(week).map(day => {
                                    return <th key={day}>{day}</th>
                                })

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


            </>
        )
    }

    const getPrev = () => {
        const currentFirstDay: Date = new Date(firstDay!);
        const newFirstDay = new Date(currentFirstDay.setDate(currentFirstDay.getDate() - 7));
        setFirstDay(formatDate(newFirstDay));

    }

    const getNext = () => {
        console.log('next')
        const currentFirstDay: Date = new Date(firstDay!);
        const newFirstDay = new Date(currentFirstDay.setDate(currentFirstDay.getDate() + 7));
        setFirstDay(formatDate(newFirstDay));
    }

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
    return formatDate(result);
}

// get all the week
function getWeek(d: Date | string) {
    const result: any = {};
    const sunday = new Date(getFirstDayOfTheWeek(d));
    result[formatDate(sunday)] = {}
    while (sunday.setDate(sunday.getDate() + 1) && sunday.getDay() !== 0)
        result[formatDate(sunday)] = {}
    // result.push({ date: formatDate(new Date(sunday)), records: [] });
    return result;
}

function formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = d.getMonth() < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
    const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();

    return `${year}-${month}-${day}`
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

