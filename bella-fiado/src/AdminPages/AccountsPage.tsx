import { useState, useEffect, useLayoutEffect } from "react";
import { AccountsServices } from "./AdminServices/AccountsServices";
import { IAccount, IItem, IPayment, Iuser } from "../Interfaces";
import TableComponent from "./Tables/TablesComponent";
import { Loader } from "./Loader_Error/Loader";
import { ErrorMessage } from "./Loader_Error/ErrorMessage";
import { removeAcentosEMaiusculas } from "./stringFunctions";
import { FormComponent } from "./Forms/FormComponent";
import { AxiosResponse } from "axios";

interface AccountsResponse {
    items: IItem[],
    payments: IPayment[]
    user_id: Iuser
    __v: number,
    _id: string,
}

interface AccountsShow {
    _id: string,
    user_id: string,
    user_name: string,
    total_bill: number,
    total_payments: number,
}

export function AccountsPage() {

    //Get data states
    const [accountsData, setAccountsData] = useState<AccountsResponse[]>([]);
    const getAccountsData = (): AccountsShow[] => {
        const data: AccountsShow[] = accountsData.map((ac) => {
            return {
                _id: ac._id,
                user_id: ac.user_id._id,
                user_name: ac.user_id.username,
                total_bill: ac.items.reduce((total, item) => {
                    const price = item.product_id.price
                    const amount = item.amount;
                    return total + (price * amount);
                }, 0),
                total_payments: ac.payments.reduce((total, item) => {
                    const value = item.value
                    return total + value
                }, 0)
            };
        });
        console.log(data)
        return data;
    };

    //Page states
    const [openAccountCreateForm, setOpenAccountCreateForm] = useState(false);
    const [openAccountEditForm, setOpenAccountEditForm] = useState(false);
    const [load, setLoad] = useState(false);
    const [erro, setErro] = useState<string>('');
    const [selectedAccountData, setSelectedAccountData] = useState<IAccount>()
    const [selectedAccountWindowOpen, setSelectedAccountWindowOpen] = useState(false)

    //post states
    const [newAccountId, setNewAccountId] = useState('');
    const [newUserId, setNewUserId] = useState('');
    const [newItems, setNewItems] = useState<IItem[]>([]);

    //put states
    const [newEditItems, setNewEditItems] = useState<IItem[]>([]);

    useLayoutEffect(() => {
        getAccounts();
    }, []);

    const createNewAccount = (e: React.FormEvent<HTMLFormElement>) => {
        return new Promise<void>((resolve, reject) => {
            const accountData: IAccount = {
                user_id: newUserId
            };
            AccountsServices.createAccount(accountData).then(() => {
                getAccounts();
                resolve();
            }).catch((err) => {
                setErro(String(err));
                reject();
            });
        });
    };

    // const editAccount = (e: React.FormEvent<HTMLFormElement>) => {
    //     return new Promise<void>((resolve, reject) => {
    //         AccountsServices.addItemToAccount(newAccountId, newEditItems).then(() => {
    //             getAccounts();
    //             resolve();
    //         }).catch((err) => {
    //             setErro(String(err));
    //             reject();
    //         });
    //     });
    // };

    const postPayment = (args: AccountsShow) => {
        let payment = Number(prompt('Digite o valor que deseja lançar como pagamento.'))
        if ((payment > 0) && (payment <= args.total_bill)) {
            AccountsServices.addPaymentToAccount(args._id, payment).then(() => {
                getAccounts()
                alert('Pagamento lançado com sucesso.')
            })
        } else {
            alert('Dado de input inválido.')
        }
    }

    interface acountAndTotal {
        account: IAccount,
        total: number
    }

    const getItems = (args: AccountsShow) => {
        AccountsServices.getAccountById(args._id).then((a: AxiosResponse<acountAndTotal>) => {
            console.log(a.data.account)
            setSelectedAccountData(a.data.account);
            setSelectedAccountWindowOpen(true)
        }).catch(e => alert(e))
    }

    const getAccounts = () => {
        setLoad(true);
        AccountsServices.getAccounts()
            .then((response: AxiosResponse<AccountsResponse>) => {
                console.log(Object.values(response.data))
                setAccountsData(Object.values(response.data));
                setLoad(false);
            })
            .catch((error) => {
                console.log(error);
                setLoad(false);
            });
    };

    return (
        <>
            {selectedAccountWindowOpen && (
                <div className="w-full bg-neutral-700 text-gray-200 p-4">
                    <div className="h-96">
                        <table className=" select-none table-auto w-full text-left">
                            <thead>
                                <tr className="bg-gray-900 text-white">
                                    <th className="py-4">Nome do produto</th>
                                    <th className="py-4">Preço do produto</th>
                                    <th className="py-4">Quantidade do produto</th>
                                    <th className="py-4">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedAccountData?.items?.map((data) => (
                                    <tr key={data.product_id._id} className="bg-gray-800 text-gray-200">
                                        <td className="py-2 px-4">{data.product_id.name}</td>
                                        <td className="py-2 px-4">R${data.product_id.price.toFixed(2)}</td>
                                        <td className="py-2 px-4">{data.amount}</td>
                                        <td className="py-2 px-4">
                                            R${(Number(data.product_id.price) * Number(data.amount)).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                <tr><td></td>
                                    <td></td>
                                    <td></td>
                                    <td className=" bg-black">TOTAL: R$28.00</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <button
                        className="border border-red-500 text-red-500 text-2xl py-2 px-4 mt-4 mx-auto block"
                        onClick={() => {
                            setSelectedAccountWindowOpen(false);
                            setSelectedAccountData(undefined);
                        }}
                    >
                        Retornar
                    </button>
                </div>)
            }
            {load && <Loader />}
            {erro && <ErrorMessage err={erro} />}
            {
                !load && !selectedAccountWindowOpen &&
                <TableComponent<AccountsShow>
                    data={getAccountsData()}
                    headers={['#', 'id', 'id do usuário', 'nome do usuário', 'Valor na conta', 'Valor pago']} onEdit={null} onDelete={null}
                    setTargetId={() => null}
                    otherButtons={[{
                        text: 'Adicionar Pagamento',
                        method: postPayment,
                        color: 'blue',

                    }, {
                        text: 'Ver lista',
                        method: getItems,
                        color: 'red',
                    }
                    ]
                    }
                />
            }
        </>
    );
}

