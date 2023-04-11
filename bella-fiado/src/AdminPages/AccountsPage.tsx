import { useState, useEffect, useLayoutEffect, FormEvent } from "react";
import { AccountsServices } from "./AdminServices/AccountsServices";
import { IAccount, IItem, IPayment, Iuser } from "../Interfaces";
import TableComponent from "./Tables/TablesComponent";
import { Loader } from "./Loader_Error/Loader";
import { ErrorMessage } from "./Loader_Error/ErrorMessage";
import { removeAcentosEMaiusculas } from "./stringFunctions";
import { FormComponent } from "./Forms/FormComponent";
import { AxiosResponse } from "axios";
import { DeleteTable } from './deleteTable/DeleteTable'

interface AccountsResponse {
    items: IItem[],
    payments: IPayment[]
    user_id: Iuser
    __v: number,
    _id: string,
}

interface editItemInterface {
    _id: string,
    amount: number,
    date: Date,
    product_name: string
    product_price: string


}

interface editPaymentsInterface {
    _id: string,
    date: string,
    value: string
}

interface AccountsShow {
    _id: string,
    user_id: string,
    user_name: string,
    total_bill: number,
    total_payments: number,
}

export function AccountsPage() {

    //get account by id
    const getAccountItemsById = (_id: string): Promise<editItemInterface[]> => {
        return new Promise((resolve, reject) => {
            AccountsServices.getAccountById(_id)
                .then((response: AxiosResponse<{ account: AccountsResponse }>) => {
                    const itemsWithoutProductId = response.data.account.items.map(item => ({
                        _id: item._id,
                        amount: item.amount,
                        date: item.date,
                        product_name: item.product_id.name,
                        product_price: `R$${item.product_id.price.toFixed(2)}`
                    }));
                    resolve(itemsWithoutProductId);
                })
                .catch(e => {
                    reject(e);
                });
        });
    };

    const getPaymentsById = (_id: string): Promise<editPaymentsInterface[]> => {
        return new Promise((resolve, reject) => {
            AccountsServices.getAccountById(_id)
                .then((response: AxiosResponse<{ account: AccountsResponse }>) => {
                    const paymentsArray = response.data.account.payments.map(payment => ({
                        _id: payment._id,
                        date: String(payment.date).substring(0,10),
                        value: `R$${payment.value.toFixed(2)}`
                    }));
                    resolve(paymentsArray);
                })
                .catch(e => {
                    reject(e);
                });
        });
    };


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
        return data;
    };
    const [payment, setPayments] = useState(0)
    const [getTargetId, setTargetId] = useState('')



    //Page states
    const [openAccountCreateForm, setOpenAccountCreateForm] = useState(false);
    const [load, setLoad] = useState(false);
    const [erro, setErro] = useState<string>('');
    const [selectedAccountData, setSelectedAccountData] = useState<IAccount>()
    const [selectedAccountWindowOpen, setSelectedAccountWindowOpen] = useState(false)
    const [openPaymentWindow, setOpenPaymentWindow] = useState(false)
    const [deleteItemActive, setDeleteItemActive] = useState(false)
    const [deletePaymentActive, setDeletePaymentActive] = useState(false)

    //post states
    const [createAccountId, setCreateAccountId] = useState('');

    useLayoutEffect(() => {
        getAccounts();
    }, []);

    const createNewAccount = (e: React.FormEvent<HTMLFormElement>) => {
        return new Promise<void>((resolve, reject) => {
            console.log(createAccountId)
            AccountsServices.createAccount({ user_id: createAccountId }).then(() => {
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

    const postPayment = (e: React.FormEvent<HTMLFormElement>) => {
        return new Promise<void>((resolve, reject) => {
            AccountsServices.addPaymentToAccount(getTargetId, payment).then(() => {
                getAccounts()
                alert('Pagamento lançado com sucesso.')
                resolve()
            }).catch((e) => {
                setErro(e)
                reject()
            })

        })

    }
    const paymentInput = {
        label: 'Insira o valor do pagamento:',
        name: 'payment',
        id: 'payment',
        inputType: 'number',
        maxLen: 8,
        minLen: 1,
        placeHolder: '5.00',
        onChangeFunction: setPayments,
    }

    const createAccountInput = {
        label: 'Insira o ID do funcionário:',
        name: 'account_id',
        id: 'account_id',
        inputType: 'text',
        maxLen: 100,
        minLen: 1,
        placeHolder: '_id',
        onChangeFunction: setCreateAccountId,
    }

    interface acountAndTotal {
        account: IAccount,
        total: number
    }

    const getItems = (args: AccountsShow) => {
        setLoad(true)
        AccountsServices.getAccountById(args._id).then((a: AxiosResponse<acountAndTotal>) => {
            setSelectedAccountData(a.data.account);
            setSelectedAccountWindowOpen(true)
            setLoad(false)
        }).catch(e => setErro(e))
    }

    const getAccounts = () => {
        setLoad(true);
        AccountsServices.getAccounts()
            .then((response: AxiosResponse<AccountsResponse>) => {
                setAccountsData(Object.values(response.data));
                setLoad(false);
            })
            .catch((error) => {
                console.log(error);
                setLoad(false);
            });
    };

    const deleteItem = (_id: string) => {
        return new Promise<void>((resolve, reject) => {
            AccountsServices.deleteItemFromAccount(getTargetId, _id).then((a) => {
                resolve()
                alert('Item excluído')
                getAccounts()
            }).catch((e) => {
                reject()
                setErro(e)
            })
        })
    }

    const deletePayment = (_id: string) => {
        return new Promise<void>((resolve, reject) => {
            AccountsServices.deletePaymentFromAccount(getTargetId, _id).then((a) => {
                resolve()
                alert('Pagamento excluído')
                getAccounts()
            }).catch((e) => {
                reject()
                setErro(e)
            })
        })
    }

    return (
        <>
            {!load && !selectedAccountWindowOpen && !openPaymentWindow && <div className=" sticky w-full bg-gradient-to-b from-black to-neutral-900 h-16 flex justify-end items-center">
                <button onClick={() => setOpenAccountCreateForm(!openAccountCreateForm)} className=" mr-4 border px-4 py-2 text-xl border-green-400 text-green-400">Criar nova conta</button>
            </div>}

            {
                openAccountCreateForm && <FormComponent title={"Insira o id do usuário"} submitFunction={createNewAccount} cancelFunction={() => setOpenAccountCreateForm(!openAccountCreateForm)} inputs={[createAccountInput]} />
            }

            {
                openPaymentWindow &&
                <FormComponent title={"Insira o valor"} submitFunction={postPayment} cancelFunction={() => setOpenPaymentWindow(false)} inputs={[paymentInput]} />
            }
            {selectedAccountWindowOpen && (
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
                                {selectedAccountData?.items?.map((data) => (
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
                                    <td className=" text-2xl text-red-600  font-bold">R${selectedAccountData?.items?.reduce((total, item) => total + (item.product_id.price * item.amount), 0).toFixed(2)
                                    }</td>


                                </tr>
                                <tr className=" text-center">
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className=" font-semibold text-2xl ">Valor pago:</td>
                                    <td className=" text-2xl text-green-600 font-bold">R${selectedAccountData?.payments?.reduce((total, payment) => total + payment.value, 0).toFixed(2)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <span className=" flex w-full h-fit justify-evenly bg-white">
                        <button
                            className="border shadow bg-red-500 text-white text-2xl py-2 px-4 my-4 mx-auto block"
                            onClick={() => {
                                setSelectedAccountWindowOpen(false);
                                setSelectedAccountData(undefined);
                            }}
                        >
                            Retornar
                        </button>
                        <button className=" border shadow bg-green-500 text-white text-2xl py-2 px-4 my-4 mx-auto block">Lançar item</button>
                    </span>
                </div>)}

            {load && <Loader />}

            {deleteItemActive &&
                <DeleteTable<editItemInterface> getMethod={() => getAccountItemsById(getTargetId)} headers={['Id', 'Quantidade', 'Data', 'Nome do produto', 'Preço']} deleteFunction={deleteItem} cancelFunction={() => setDeleteItemActive(!deleteItemActive)} />
            }

            {deletePaymentActive && 
                <DeleteTable<editPaymentsInterface> getMethod={() => getPaymentsById(getTargetId)} headers={['ID', 'Data', 'Valor', 'Ações']} deleteFunction={deletePayment} cancelFunction={() => setDeletePaymentActive(!deletePaymentActive)}/>
            }

            {erro && <ErrorMessage err={erro} />}

            {
                !load && !selectedAccountWindowOpen && !openPaymentWindow && !deleteItemActive && !deletePaymentActive &&
                <TableComponent<AccountsShow>
                    data={getAccountsData()}
                    headers={['#', 'id', 'id do usuário', 'nome do usuário', 'Valor na conta', 'Valor pago']} onEdit={null} onDelete={null}
                    setTargetId={setTargetId}
                    otherButtons={[{
                        text: 'Adicionar Pagamento',
                        method: () => setOpenPaymentWindow(!openPaymentWindow),
                        color: 'green',

                    }, {
                        text: 'Ver conta',
                        method: getItems,
                        color: 'green',
                    },
                    {
                        text: 'Excluir items',
                        method: () => { setDeleteItemActive(!deleteItemActive) },
                        color: 'red',
                    },
                    {
                        text: 'Excluir pagamentos',
                        method: () => {setDeletePaymentActive(!deletePaymentActive)},
                        color: 'red',
                    },
                    ]
                    }
                />
            }
        </>
    );
}

