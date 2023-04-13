import { useLayoutEffect, useState } from "react";
import { ProductsServices } from "../AdminServices/ProductsServices";
import { IItem, Iproducts, postItem } from "../../Interfaces";
import { AccountsServices } from "../AdminServices/AccountsServices";
import { capitalize } from "../stringFunctions";
import { Loader } from "../AdminPages_components/Loader_Error/Loader_Error/Loader";

interface iChart {
    _id: string,
    cancelFunction: () =>void
}



export function Chart(props: iChart) {

    const [load, setLoad] = useState(false)
    const [prodsData, setProdsData] = useState<Iproducts[]>([])
    const [selectedItems, setSelectedItems] = useState<postItem[]>([])
    const [total, setTotal] = useState(0)

    useLayoutEffect(() => {
        getProducts()
    }, [])

    const getProducts = () => {
        setLoad(true)
        ProductsServices.getProducts()
            .then((response) => {
                const { __v, ...resposta } = response.data
                setProdsData(Object.values(resposta));
            })
            .catch(error => {
                alert(error)
            }).finally(() => {
                setLoad(false)
            })
    };

    const addProducts = () => {
        setLoad(true)
        AccountsServices.addItemToAccount(props._id, selectedItems).then(() => {
            alert('Sucesso!')
            window.location.href = window.location.origin + '/admin/pannel/accounts';
        }).catch((e) => {
            alert(e)
        }).finally(() => {
            setLoad(false)
        })
    }

    const updateChartItems = (prod: Iproducts, amount: number) => {
        let newItems = [...selectedItems, {
            product_id: prod,
            amount: amount
        }]
        setSelectedItems(newItems)
        setTotal(total + (prod.price * amount))
    }

    return (

        <div className=" flex ">
            {!load &&
                <><table className="w-2/3 h-full overflow-y-scroll text-left border border-gray-400">
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-4 py-2">Nome</th>
                            <th className="border border-gray-400 px-4 py-2">Preço</th>
                            <th className="border border-gray-400 px-4 py-2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prodsData?.map((prod) => (
                            <tr className=" hover:bg-slate-200" key={prod._id}>
                                <td className=" border-r border-gray-400 px-4 py-2">{prod.name}</td>
                                <td className=" border-r border-gray-400 px-4 py-2">R${prod.price.toFixed(2)}</td>
                                <td className=" border-r border-gray-400 px-4 py-2">
                                    <button onClick={() => {
                                        updateChartItems(prod, 1);
                                    } }
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Adicionar à conta
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table><div className=" w-1/3 bg-slate-100 p-4 flex flex-col items-center ">
                        <h1 className=" text-2xl mb-4">Items selecionados</h1>
                        <ul className=" w-full p-2 bg-slate-200 border h-96 overflow-y-scroll">
                            {selectedItems.map((item) => {
                                return (
                                    <li className=" select-none w-full border-b border-black hover:bg-slate-300 ">
                                        <p className=" text-gray-800">{capitalize(item.product_id.name)}</p>
                                        <p className=" font-semibold text-gray-800">R${item.product_id.price.toFixed(2)}</p></li>
                                );
                            })}
                        </ul>
                        <h2 className=" mt-4 text-2xl font-semibold">TOTAL: {`R$${total.toFixed(2)}`}</h2>
                        <span className=" w-full pt-4 flex justify-evenly items-center">
                            <button onClick={props.cancelFunction} className=" shadow border-red-500 text-red-500 border py-2 px-4 cursor-pointer">Cancelar</button>
                            <button onClick={addProducts} className=" shadow bg-green-500 text-white py-2 px-4 cursor-pointer">Confirmar</button>
                        </span>
                    </div></>
            }
            {load && <Loader />}
        </div >

    )
}