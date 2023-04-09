import { useState, useEffect, useLayoutEffect } from "react";
import { AccountsServices } from "./AdminServices/AccountsServices";
import { IAccount, IItem, IPayment, Iuser } from "../Interfaces";
import TableComponent from "./Tables/TablesComponent";
import { Loader } from "./Loader_Error/Loader";
import { ErrorMessage } from "./Loader_Error/ErrorMessage";
import { removeAcentosEMaiusculas } from "./stringFunctions";
import { FormComponent } from "./Forms/FormComponent";
import { AxiosResponse } from "axios";

interface returnMethods {
    _id:string,
    billPrice: number,
    paidPrice: number
}

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

    //post states
    const [newAccountId, setNewAccountId] = useState('');
    const [newUserId, setNewUserId] = useState('');
    const [newItems, setNewItems] = useState<IItem[]>([]);

    //put states
    const [newEditItems, setNewEditItems] = useState<IItem[]>([]);

    useLayoutEffect(() => {
        getAccounts();
    }, []);

    const createAccountInputs = [
        {
            label: 'ID do usuário:',
            name: 'user_id',
            id: 'user_id',
            inputType: 'text',
            placeHolder: '',
            onChangeFunction: setNewUserId,
            maxLen: 100,
            minLen: 1,
        },
        {
            label: 'Items:',
            name: 'items',
            id: 'items',
            inputType: 'items',
            placeHolder: '',
            onChangeFunction: setNewItems,
            maxLen: 100,
            minLen: 1,
        },
    ];

    const editAccountInputs = [
        {
            label: 'Items:',
            name: 'items',
            id: 'items',
            inputType: 'items',
            placeHolder: '',
            onChangeFunction: setNewEditItems,
            maxLen: 100,
            minLen: 0,
        },
    ];


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

    const editAccount = (e: React.FormEvent<HTMLFormElement>) => {
        return new Promise<void>((resolve, reject) => {
            AccountsServices.addItemToAccount(newAccountId, newEditItems).then(() => {
                getAccounts();
                resolve();
            }).catch((err) => {
                setErro(String(err));
                reject();
            });
        });
    };

    const postPayment = (id: string) => {
        let payment = Number(prompt('Digite o valor que deseja lançar como pagamento.'))
        if (payment) {
            AccountsServices.getAccountById(id).then((acc: AxiosResponse<IAccount>) => {
                AccountsServices.addPaymentToAccount(id, payment).then(() => {
                    getAccounts()
                    alert('Pagamento lançado com sucesso.')
                })
            })
        } else {
            alert('Dado de input inválido.')
        }
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
            {openAccountCreateForm && (
                <FormComponent
                    inputs={createAccountInputs}
                    submitFunction={createNewAccount}
                    cancelFunction={() => setOpenAccountCreateForm(false)}
                    title="Criar Conta"
                />
            )}
            {openAccountEditForm && (
                <FormComponent
                    inputs={editAccountInputs}
                    submitFunction={editAccount}
                    cancelFunction={() => setOpenAccountEditForm(false)}
                    title="Editar Conta"
                />
            )}
            {load && <Loader />}
            {erro && <ErrorMessage err={erro} />}
            {!load &&
                <TableComponent<AccountsShow, returnMethods> 
                    data={getAccountsData()}
                    headers={['#', 'id', 'id do usuário', 'nome do usuário', 'Valor na conta', 'Valor pago']} onEdit={null} onDelete={null}
                    setTargetId={() => null}
                    otherButtons={[{
                        text: 'Adicionar Pagamento',
                        method: postPayment

                    }, {
                        text: 'Excluir pagamento',
                        method: postPayment
                    }
                    ]
                    }
                />
            }
        </>
    );
}

