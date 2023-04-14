import { useEffect, useLayoutEffect, useState } from "react";
import { AccountsServices } from "../AdminPages/AdminServices/AccountsServices";
import { UserServices } from "../AdminPages/AdminServices/UserServices";
import { IAccount } from "../Interfaces";
import { AxiosResponse } from "axios";
import { capitalize } from "../AdminPages/stringFunctions";
import { Loader } from "../AdminPages/AdminPages_components/Loader_Error/Loader_Error/Loader";

export function HelloPage() {

    const [accountsData, setAccountsData] = useState<IAccount[]>([]);
    const [load, setLoad] = useState(false);
    const [itemsTableActive, setItemsTableActive] = useState(false);

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const name = params.get('username');

    useEffect(() => {

        if (id) {
            setLoad(true)
            AccountsServices.getUserAccounts(id).then((response: AxiosResponse<IAccount[]>) => {
                setAccountsData(Object.values(response.data));
            }).catch(() => {
                alert('Erro ao acessar contas.')
            }).finally(() => {
                setLoad(false)
            })
        }
    }, [])


    return (<>
        {!load &&
            <div className=" p-4 min-h-screen bg-gray-800 text-gray-100 flex justify-center">
                <div className=" w-full  md:w-1/2">
                    <h1 className=" text-4xl ">Olá, {name ? capitalize(name) : name}.</h1>
                    <p className=" text-2xl font-thin">Seja bem-vindo de volta à sua conta Fiado.</p>
                    
                        {accountsData?.map((item) => {
                            return (
                                <div className=" rounded-xl p-8 mt-4 flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 text-neutral-700  ">
                                    <h1 className=" w-full text-start text-2xl font-bold">Conta</h1>
                                    <h2 className=" ml-2 w-full text-start">Foram pagos R${item.payments?.reduce((total, payment) => {
                                        return total + payment.value;
                                    }, 0).toFixed(2)}</h2>
                                    <h2 className=" ml-2 w-full text-start ">O valor total da conta é R${item.items?.reduce((total, price) => {
                                        return total + (price.amount * price.product_id.price)
                                    }, 0).toFixed(2)}</h2>
                                    <button onClick={() => setItemsTableActive(!itemsTableActive)} className=" transition-all hover:scale-105 shadow-lg rounded-lg bg-blue-400 text-gray-100 py-2 mt-4 px-4 text-xl self-start">Ver itens...</button>

                                    {itemsTableActive &&
                                        <table className=" w-full mt-4 table-auto border border-gray-400">
                                            <thead>
                                                <tr>
                                                    <th className=" text-sm lg:px-4 lg:py-2">Data</th>
                                                    <th className=" text-sm lg:px-4 lg:py-2">Produto</th>
                                                    <th className=" text-sm lg:px-4 lg:py-2">Preço</th>
                                                    <th className=" text-sm lg:px-4 lg:py-2">Quantidade</th>
                                                    <th className=" text-sm lg:px-4 lg:py-2">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody >

                                                {item.items?.map((item, index) => {
                                                    return (
                                                        <tr key={index} className="  text-center">
                                                            <td className=" text-sm border border-gray-400 lg:px-4 lg:py-2">{String(item.date).slice(0,10)}</td>
                                                            <td className=" text-sm border border-gray-400 lg:px-4 lg:py-2">{item.product_id.name}</td>
                                                            <td className=" text-sm border border-gray-400 lg:px-4 lg:py-2">R${item.product_id.price.toFixed(2)}</td>
                                                            <td className=" text-sm border border-gray-400 lg:px-4 lg:py-2">{item.amount}</td>
                                                            <td className=" text-sm border border-gray-400 lg:px-4 lg:py-2">R${(item.product_id.price * item.amount).toFixed(2)}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    }

                                </div>
                            )
                        })}
                        {accountsData.length < 1 &&
                            <h1 className=" text-black text-2xl">Parabéns! Você não tem nada no seu fiado.</h1>
                        }
                    </div>
                </div>
        }
        {load && <Loader />}
    </>
    )
}