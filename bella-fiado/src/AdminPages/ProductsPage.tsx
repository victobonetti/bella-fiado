import { useEffect, useState } from "react";
import { AdminServices } from "./AdminServices/AdminServices";
import Iproducts from "../Interfaces";

export function ProductsPage(){
    
    const [prodsData, setProdsData] = useState<Iproducts[]>([]);

    useEffect(() => {
        AdminServices.getProducts()
            .then(response => {
                setProdsData(response);
            })
            .catch(error => {
                console.error(error)
            });
    }, []);

    return (<div>
        <table className="border-collapse w-full">
            <thead>
                <tr>
                    <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300">#</th>
                    <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300">Nome</th>
                    <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300">ID</th>
                    <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300">Preço</th>
                    <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300">Editar</th>
                </tr>
            </thead>
            <tbody>
                {prodsData?.map((prod:Iproducts, index:number) => {
                    return (
                        <tr className="hover:bg-gray-100">
                            <td className="p-3 border border-gray-300 ">{index}</td>
                            <td className="p-3 border font-semibold border-gray-300">{prod.name}</td>
                            <td className="p-3 border border-gray-300">{prod._id}</td>
                            <td className="p-3 border border-gray-300">R${prod.price.toFixed(2)}</td>
                            <td className="p-3 border border-gray-300">
                                <button className=" bg-black text-white font-bold py-2 px-4">
                                    Editar
                                </button>
                            </td>
                        </tr>
                    )
                })
                }
            </tbody>
        </table>
    </div>)
}