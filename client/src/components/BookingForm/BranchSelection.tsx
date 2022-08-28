import React, { Dispatch, SetStateAction } from "react";

interface PropsI {
    branchesList: any[],
    setBranch: Dispatch<SetStateAction<number | null>>,
    branch: number | null,
}

function BranchSelection({ branchesList, setBranch, branch }: PropsI) {

    console.log('branches')
    const select = (code: number) => {
        setBranch(code);
    }


    return (
        <div id="bramch-selection">
            <h2>Branch Selection</h2>
            <ul>
                {
                    branchesList.map(item => {
                        return <li
                            value={item.code}
                            key={item.code}
                            className={item.code === branch ? 'selected' : ''}
                            onClick={() => select(item.code)}
                        >{item.city}</li>

                    })
                }
            </ul>
        </div>
    )
}

export default BranchSelection;