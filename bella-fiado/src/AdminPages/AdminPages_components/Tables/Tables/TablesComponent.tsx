import React, { ReactNode, useState } from "react";
import { capitalize } from "../../../stringFunctions";

type ValidReactNode = string | number | boolean | null | undefined | React.ReactElement<any, string | React.JSXElementConstructor<any>>;


interface OtherButton<T> {
    text: string;
    method: (data: T) => void;
    color?: string
}

type TableProps<T extends Record<string, ValidReactNode>> = {
    data: T[],
    headers: string[],
    onEdit?: (() => void) | null,
    onDelete: ((_id: string) => void) | null,
    setTargetId: ((_id: string) => void),
    otherButtons?: OtherButton<T>[] | null
    // otherButtonArgs?: OtherButtonArgs | null
}

function TableComponent<T extends { _id: string }>({ data, headers, onEdit, onDelete, setTargetId, otherButtons }: TableProps<T>) {

    const [isOptionsActive, setIsOptionsActive] = useState<boolean[]>(new Array(data.length).fill(false));


    return (
        <>
            {data.length >= 1 &&
                <table className="border-collapse w-full">
                    <thead>
                        <tr>
                            {headers.map((header: string, index: number) => (
                                <th key={index} className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, index) => (
                            <tr key={index}>
                                <td className="p-3 border border-gray-300">{index}</td>
                                {Object.keys(data[0]).map((key) => {

                                    let renderItem = item[key as keyof T] as ReactNode
                                    if (key == '__v' || key == 'tokens' || key == 'account_id') {
                                        return
                                    }
                                    if (typeof (renderItem) == 'number') {
                                        renderItem = `R$${renderItem.toFixed(2)}`
                                    } else if (typeof (renderItem) == 'string') {
                                        renderItem = capitalize(renderItem)
                                    }

                                    return (
                                        <td key={key} className="p-3 border border-gray-300">{renderItem}</td>
                                    )
                                })}
                                {(onEdit !== null && onDelete !== null && setTargetId !== null) &&
                                    <td className="p-3 border border-gray-300">

                                        <button className="bg-black text-white font-bold py-2 px-4" onClick={() => {
                                            onEdit?.()
                                            setTargetId?.(item._id)
                                        }}>
                                            Editar
                                        </button>
                                        <button className="text-red-500 border-red-500 mx-4 border px-4 py-2" onClick={() => onDelete(item._id)}>
                                            Deletar
                                        </button>
                                    </td>
                                }
                                {otherButtons != null &&
                                    <td className="p-2 border-y flex flex-col justify-center border-gray-300">
                                        <button onClick={() => setIsOptionsActive(prev => prev.map((_, i) => i === index ? !prev[i] : false))} className="text-white bg-black py-2 px-1 ">Ações...</button>
                                        {isOptionsActive[index] && (
                                            <div className="flex flex-col justify-center p-2 ">
                                                {otherButtons?.map((button, i) => {
                                                    return (
                                                        <button key={i} className={` text-white bg-${button.color}-500 border-${button.color}-500 border px-2 mb-1 py-1 opacity-80 hover:opacity-100`} onClick={() => {
                                                            console.log(item._id)
                                                            setTargetId(item._id)
                                                            button.method(item)
                                                        }}>
                                                            {button.text}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </>
    );
};

export default TableComponent;
