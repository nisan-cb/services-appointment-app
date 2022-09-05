import React, { useEffect, useRef, useState } from "react";
import { w3cwebsocket } from "websocket";
import RecordContainer from "./RecordContainer";
import MyDate from "../../classes/date";
import './weeklyCalendar.scss'
import Record from "./Record";
import AddPopUP from "../AddPopUp/AddPopUp";

const clientWS = new w3cwebsocket(`wss://${window.location.host}/websocket`);
// const clientWS = new w3cwebsocket(`ws://localhost:4000/websocket`);

export const Target = React.createContext<any>(undefined);

function WeeklyCalendar() {
    const currentDate: string = MyDate.dateToString(new Date());

    // state of message
    const [msg, setMsg] = useState<string>('');
    // state of first day to display
    const [firstDay, setFirstDay] = useState<Date | string>(MyDate.getFirstDayOfTheWeek(currentDate));
    // data structure of week include records
    const [week, setWeek] = useState<any>(getWeek(currentDate));
    // time range to display in left side
    const [timeRange, setTimeRange] = useState<string[]>(getTimeRange());
    // list of all status types
    const [statusTypes, setStatusTypes] = useState<string[]>([]);
    // add new record pop-up
    const [addFlag, setAddFlag] = useState<boolean>(false);

    // current record that draged
    const draggedRecord = useRef();
    const [currRecord, setCurrRecord] = useState(1);

    // current record container
    const currentContainer = useRef<any>({ date: undefined, time: undefined });


    useEffect(() => {
        // web socket
        clientWS.onopen = () => {
            console.log('WebSocket Client Connected');
        }
        clientWS.onmessage = (message) => {
            const newRecord = JSON.parse(message.data as string);
            setWeek((prev: any) => ({
                ...prev,
                [newRecord.date]: { ...prev[newRecord.date], [newRecord.time]: newRecord }
            }))
        };


        // get all status options
        fetch('/api/status-options')
            .then(res => res.json())
            .then(data => setStatusTypes(data))
            .catch(err => console.log(err));

    }, []);

    useEffect(() => {
        const start: Date = new Date(firstDay);
        const end = new Date(start.setDate(start.getDate() + 6))

        // fetch records between 2 dates 
        fetch(`/api/records/${firstDay}/${MyDate.dateToString(end)}`)
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
                                                <RecordContainer date={date} time={time} >
                                                    {week[date][time] ? <Record data={week[date][time]}></Record> : undefined}
                                                </RecordContainer>
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

    const addPopUp = () => {
        if (!currentContainer.current) return <></>
        return <AddPopUP date={currentContainer.current.date} time={currentContainer.current.time}></AddPopUP>
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
            <Target.Provider value={{ currentContainer, draggedRecord, setMsg, currRecord, setCurrRecord, statusTypes, setWeek, setAddFlag }}>
                <div id="weeklyCalendar">
                    {displayWeek()}
                    {displayMsg()}
                    {addFlag ? addPopUp() : undefined}
                </div>
            </Target.Provider>
        </>

    )
}


// more fonctions 

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


export default WeeklyCalendar;

