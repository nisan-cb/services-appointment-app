import React from "react";

interface PropsI {
    data: any
}

export default function Record({ data }: PropsI) {


    return (
        <div className="record">
            <span>{data.number}</span>
            <span>{data.city}</span>
            <span>{data.description}</span>
            <span>{data.name}</span>
        </div>
    )
}