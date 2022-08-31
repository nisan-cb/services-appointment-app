import React, { useRef } from "react";

interface PropsI {
    data: any
}

export default function Record({ data }: PropsI) {



    return (
        <div className="record"
            draggable
        // onDragStart={e => dragSatrt(e)}
        // onDragEnter={e => dragEnter(e)}
        >
            <span>{data.number}</span>
            <span>{data.city}</span>
            <span>{data.description}</span>
            <span>{data.name}</span>
        </div>
    )
}