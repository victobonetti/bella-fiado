import { AxiosResponse } from "axios"
import { IAccount, IItem, IPayment, Iuser } from "../../Interfaces"
import { AccountsServices } from "../AdminServices/AccountsServices"

export interface AccountsResponse {
    items: IItem[],
    payments: IPayment[]
    user_id: Iuser
    __v: number,
    _id: string,
}

export interface editItemInterface {
    _id: string,
    amount: number,
    date: Date,
    product_name: string
    product_price: string


}

export interface editPaymentsInterface {
    _id: string,
    date: string,
    value: string
}

export interface AccountsShow {
    _id: string,
    user_id: string,
    user_name: string,
    total_bill: number,
    total_payments: number,
}

export interface acountAndTotal {
    account: IAccount,
    total: number
}

export const externalCreateNewAccount = (createAccountId: string, getAccounts: () => void) => {
    return new Promise<void>((resolve, reject) => {
        console.log(createAccountId)
        AccountsServices.createAccount({ user_id: createAccountId }).then(() => {
            getAccounts();
            resolve();
        }).catch((err) => {
            alert(String(err));
            reject();
        });
    });
}

export const externalPostPayment = (getTargetId:string, payment:number, getAccounts: () => void) => {
    return new Promise<void>((resolve, reject) => {
        AccountsServices.addPaymentToAccount(getTargetId, payment).then(() => {
            getAccounts()
            alert('Pagamento lançado com sucesso.')
            resolve()
        }).catch((e) => {
            alert(e)
            reject()
        })

    })
}

export const externalGetAccountsData = (response: AccountsResponse[]): AccountsShow[] => {
    const data: AccountsShow[] = response.map((account) => {
        return {
            _id: account._id,
            user_id: account.user_id._id,
            user_name: account.user_id.username,
            total_bill: account.items.reduce((total, item) => {
                const price = item.product_id.price
                const amount = item.amount;
                return total + (price * amount);
            }, 0),
            total_payments: account.payments.reduce((total, item) => {
                const value = item.value
                return total + value
            }, 0)
        };
    });
    return data;
};

export const getAccountItemsById = (_id: string): Promise<editItemInterface[]> => {
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

export const getPaymentsById = (_id: string): Promise<editPaymentsInterface[]> => {
    return new Promise((resolve, reject) => {
        AccountsServices.getAccountById(_id)
            .then((response: AxiosResponse<{ account: AccountsResponse }>) => {
                const paymentsArray = response.data.account.payments.map(payment => ({
                    _id: payment._id,
                    date: String(payment.date).substring(0, 10),
                    value: `R$${payment.value.toFixed(2)}`
                }));
                resolve(paymentsArray);
            })
            .catch(e => {
                reject(e);
            });
    });
}

export const externalGetItems = (args: AccountsShow, setLoad: (value: React.SetStateAction<boolean>) => void, setSelectedAccountData: React.Dispatch<React.SetStateAction<IAccount | undefined>>,setSelectedAccountWindowOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoad(true)
    AccountsServices.getAccountById(args._id).then((a: AxiosResponse<acountAndTotal>) => {
        setSelectedAccountData(a.data.account);
        setSelectedAccountWindowOpen(true)
        setLoad(false)
    }).catch(e => alert(e))
}

export const externalDeleteItem = (_id: string, getTargetId:string, getAccounts: () => void) => {
    return new Promise<void>((resolve, reject) => {
        AccountsServices.deleteItemFromAccount(getTargetId, _id).then((a) => {
            resolve()
            alert('Item excluído')
            getAccounts()
        }).catch((e) => {
            reject()
            alert(e)
        })
    })
}

export const externalDeletePayments = (_id: string, getTargetId:string, getAccounts: () => void) => {
    return new Promise<void>((resolve, reject) => {
        AccountsServices.deletePaymentFromAccount(getTargetId, _id).then((a) => {
            resolve()
            alert('Pagamento excluído')
            getAccounts()
        }).catch((e) => {
            reject()
            alert(e)
        })
    })
}