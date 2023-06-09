import axios from "axios"
const ACCOUNTS_URL = 'https://bella-fiado-api-victobonetti.vercel.app/accounts'

import { IAccount, IItem, postItem } from "../../Interfaces";



export class AccountsServices {
    static async getAccounts() {
        return await axios.get(ACCOUNTS_URL)
    }

    static async getAccountById(_id: string) {
        return await axios.get(`${ACCOUNTS_URL}/${_id}`)
    }

    static async getUserAccounts(_id: string) {
        return await axios.get(`${ACCOUNTS_URL}/getUserAccount/${_id}`)
    }

    

    static async addItemToAccount(accountId: string, itemsData: postItem[]) {
        const requests = itemsData.map(item => axios.post(`${ACCOUNTS_URL}/addItem/${accountId}`, {
            product_id: item.product_id,
            amount: item.amount
        }));
        try {
            await Promise.all(requests);
        } catch (error) {
            throw new Error(`Failed to add items to account ${accountId}: ${error}`);
        }
    }

    static async deleteItemFromAccount(accountId:string, item_id:string){
        return await axios.delete(`${ACCOUNTS_URL}/deleteItem/${accountId}/${item_id}`)
    }

    static async addPaymentToAccount(accountId: string, value: number) {

        const dateNow = new Date()
        dateNow.setHours(dateNow.getHours() - 3);

        return await axios.post(`${ACCOUNTS_URL}/addPayment/${accountId}`, {
            value: value,
            date: dateNow,
        })
    }

    static async deletePaymentFromAccount(accountId:string, payment_id:string){
        return await axios.delete(`${ACCOUNTS_URL}/deletePayment/${accountId}/${payment_id}`)
    }


    static async createAccount(accountData: IAccount) {
        return await axios.post(ACCOUNTS_URL, accountData)
    }

    static async deleteAccount(_id:string){
        return await axios.delete(`${ACCOUNTS_URL}/${_id}`)
    }

}