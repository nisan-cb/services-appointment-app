import React, { ChangeEvent, ReactElement, ReactHTMLElement, useEffect, useState } from "react";
import Record from "./record";

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


function WeeklyCalendar() {
    const currentDate: Date | string = formatDate(new Date());

    const [firstDay, setFirstDay] = useState<Date | string>(currentDate);
    const [week, setWeek] = useState<Day[]>();
    const [records, setRecords] = useState<any[]>();


    useEffect(() => {
        setFirstDay(getFirstDayOfTheWeek(currentDate));
        const weekDays = getWeek(currentDate);
        console.log(weekDays);
        // setWeek(getWeek(firstDay));

    }, []);

    useEffect(() => {
        // setWeek(getWeek(firstDay));
        const start: Date = new Date(firstDay);
        const end = new Date(start.setDate(start.getDate() + 7))
        console.log('start :', firstDay)
        console.log('end :', end)

        // if (!week?.length) return;
        fetch(`${base_url}/api/records/${firstDay}/${formatDate(end)}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setWeek(data)

            })
            .catch(err => console.log(err));

    }, [firstDay])



    const displayWeek = () => {
        return (

            <>
                {
                    week?.map(day => {
                        return <div
                            key={day.date}
                            className={(day.date === currentDate) ? 'today day' : 'day'}
                        >{day.date}
                            {
                                day.records.map(record => {
                                    return <Record key={record.number} data={record}></Record>
                                })

                            }
                        </div>
                    })
                }

            </>
        )
    }

    const getPrev = () => {
        const currentFirstDay: Date = new Date(firstDay!);
        const newFirstDay = new Date(currentFirstDay.setDate(currentFirstDay.getDate() - 7));
        console.log(newFirstDay)
        setFirstDay(formatDate(newFirstDay));
    }

    const getNext = () => {
        const currentFirstDay: Date = new Date(firstDay!);
        const newFirstDay = new Date(currentFirstDay.setDate(currentFirstDay.getDate() + 7));
        console.log(newFirstDay)
        setFirstDay(formatDate(newFirstDay));
    }
    return (
        <>
            <div id='panel'>
                <button id="prev-btn" onClick={getPrev}>prev</button>
                <button id="next-btn" onClick={(getNext)}>next</button>
            </div>
            <div id="weeklyCalendar">
                {displayWeek()}

            </div>
        </>
    )
}

// get first day date in same week like d 
function getFirstDayOfTheWeek(d: Date | string) {
    const date = new Date(d);
    const result = new Date(date.setDate(date.getDate() - date.getDay()));
    return formatDate(result);
}

// get all the week
function getWeek(d: Date | string): Day[] {
    const result: Day[] = [];
    const sunday = new Date(getFirstDayOfTheWeek(d));
    result.push({
        date: formatDate(sunday),
        records: []
    });
    console.log(sunday)
    while (sunday.setDate(sunday.getDate() + 1) && sunday.getDay() !== 0)
        result.push({ date: formatDate(new Date(sunday)), records: [] });
    return result;
}

function formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = d.getMonth() < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
    const day = d.getDate();

    return `${year}-${month}-${day}`
}



export default WeeklyCalendar;

