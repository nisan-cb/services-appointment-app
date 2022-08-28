import React, { Dispatch, SetStateAction } from "react";
interface PropsI {
    servicesList: any[],
    setService: Dispatch<SetStateAction<null | number>>,
    service: number | null
}

function ServicesSelection({ servicesList, setService, service }: PropsI) {
    console.log('services ')
    const select = (code: number) => {
        setService(code);
    }

    return (
        <div id="service-selection">
            <h2>Service Selection</h2>
            <ul>
                {
                    servicesList.map(item => {
                        return <li
                            value={item.code}
                            key={item.code}
                            className={item.code === service ? 'selected' : ''}
                            onClick={() => { select(item.code) }}

                        >{item.description}</li>
                    })
                }
            </ul>
        </div >
    )
}
export default ServicesSelection;