import { useLayoutEffect, useState } from "react"
import { capitalize } from "../stringFunctions"

interface deleteTableProps<T> {
    headers: string[],
    deleteFunction: (_id: string) => void
    cancelFunction: () => void
    getMethod: () => Promise<T[]>
}



export function DeleteTable<T extends { _id: string }>({ headers, deleteFunction, cancelFunction, getMethod }: deleteTableProps<T>) {

    const [data, setData] = useState<T[]>([])

    const getData = async () => {
        await getMethod().then((a => {
            console.log(a)
            setData(a)
        })).catch((e) => console.error(e))
    }

    useLayoutEffect(() => {
        getData();
    }, []);

    return (
        <div className=" flex justify-center mt-4">
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
                {data?.map((item, index) => (
                    <tr key={index}>
                        {Object.values(item).map((value: any, index: number) => (
                            <td key={index} className="p-3 border border-gray-300">{value}</td>
                        ))}
                        <td onClick={() => {
                            try {
                                deleteFunction(item._id)
                            } catch {
                                alert("erro ao excluir.")
                            } finally {
                                cancelFunction()
                            }
                        
                        }} className="p-3 border border-gray-300 text-red-500 font-black text-4xl cursor-pointer">X</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}