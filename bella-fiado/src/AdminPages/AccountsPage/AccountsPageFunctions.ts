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