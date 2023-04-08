import React, { ReactNode } from "react";

type ValidReactNode = string | number | boolean | null | undefined | React.ReactElement<any, string | React.JSXElementConstructor<any>>;

type TableProps<T extends Record<string, ValidReactNode>> = {
    data: T[],
    headers: string[],
    onEdit: () => void,
    onDelete: (_id: string) => void,
    setTargetId: (_id:string) => void ,
}

function TableComponent<T extends { _id: string }>({ data, headers, onEdit, onDelete, setTargetId }: TableProps<T>) {

    return (
        <> 
            {data.length >= 1 &&
                <table className="border-collapse w-full">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="p-3 border border-gray-300">{index}</td>
                                {Object.keys(data[0]).slice(0, 3).map((key) => (
                                    <td key={key} className="p-3 border border-gray-300">{item[key as keyof T] as ReactNode}</td>
                                ))}
                                <td className="p-3 border border-gray-300">
                                    <button className="bg-black text-white font-bold py-2 px-4" onClick={() => {
                                        onEdit()
                                        setTargetId(item._id)
                                        }}>
                                        Editar
                                    </button>
                                    <button className="text-red-500 border-red-500 mx-4 border px-4 py-2" onClick={() => onDelete(item._id)}>
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </>
    );
};

export default TableComponent;
