import { useState } from "react";
import { IAccount } from "../../Interfaces";
import { Chart } from "./Chart";

type AccountBillWindowProps = {
    selectedAccountData: IAccount,
    setSelectedAccountWindowOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedAccountData: React.Dispatch<React.SetStateAction<IAccount | undefined>>,
    [propName: string]: any, // allow any additional props
};

export function AccountBillWindow(props: AccountBillWindowProps) {

    const [chartActive, setChartActive] = useState(false)

    return (
        <>
            {!chartActive &&
                <div className="w-full h-full bg-neutral-300 text-black-200">

                    <div className=" h-96 border-b-2 border-black">
                        <table className=" select-none table-auto w-full text-left">
                            <thead className=" text-center">
                                <tr className="bg-gray-900 text-white">
                                    <th className="py-4">Data</th>
                                    <th className="py-4">Nome do produto</th>
                                    <th className="py-4">Preço do produto</th>
                                    <th className="py-4">Quantidade do produto</th>
                                    <th className="py-4">Total</th>

                                </tr>
                            </thead>
                            <tbody>
                                {props.selectedAccountData?.items?.map((data) => (
                                    <tr key={data.product_id._id} className=" hover:opacity-90 text-center bg-gray-800 text-gray-200">
                                        <td>{String(data?.date).substring(0, 10)}</td>
                                        <td className="py-2 px-4">{data.product_id.name}</td>
                                        <td className="py-2 px-4">R${data.product_id.price.toFixed(2)}</td>
                                        <td className="py-2 px-4">{data.amount}</td>
                                        <td className="py-2 px-4">
                                            R${(Number(data.product_id.price) * Number(data.amount)).toFixed(2)}
                                        </td>

                                    </tr>
                                ))}
                                <tr className=" text-center">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className=" font-semibold text-2xl ">TOTAL:</td>
                                    <td className=" text-2xl text-red-600  font-bold">R${props.selectedAccountData?.items?.reduce((total, item) => total + (item.product_id.price * item.amount), 0).toFixed(2)
                                    }</td>


                                </tr>
                                <tr className=" text-center">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className=" font-semibold text-2xl ">Valor pago:</td>
                                    <td className=" text-2xl text-green-600 font-bold">R${props.selectedAccountData?.payments?.reduce((total, payment) => total + payment.value, 0).toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <span className=" flex w-full h-fit justify-evenly bg-white">
                        <button
                            className="border shadow bg-red-500 text-white text-2xl py-2 px-4 my-4 mx-auto block"
                            onClick={() => {
                                props.setSelectedAccountWindowOpen(false);
                                props.setSelectedAccountData(undefined);
                            }}
                        >
                            Retornar
                        </button>
                        <button onClick={() => {
                            setChartActive(!chartActive)
                            console.log(props.selectedAccountData)
                        }
                        } className=" border shadow bg-green-500 text-white text-2xl py-2 px-4 my-4 mx-auto block">Lançar item</button>
                    </span>


                </div >
            }

            {chartActive && <Chart _id={props.selectedAccountData._id} />}
        </>
    )
}