import React, { useRef } from "react";

interface PropsI {
    data: any
}

export default function Record({ data }: PropsI) {

    const dragItem = useRef();
    const dragOverItem = useRef();

    const dragSatrt = (e: any) => {
        console.log("start drag")
        console.log(e.target)
    }

    const dragEnter = (e: any) => {
        // dragOverItem.current = position;
        console.log(e.target);
    };

    return (
        <div className="record"
            draggable
            onDragStart={e => dragSatrt(e)}
        // onDragEnter={e => dragEnter(e)}
        >
            <span>{data.number}</span>
            <span>{data.city}</span>
            <span>{data.description}</span>
            <span>{data.name}</span>
        </div>
    )
}