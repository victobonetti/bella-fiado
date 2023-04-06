import axios from "axios"
const ACCOUNTS_URL = 'https://bella-fiado-api-victobonetti.vercel.app/accounts/'

interface Iitem {
    _id: string
    product_id: string
    amount: number
}

interface IcreateAccount {
    user_id: string,
    items: Array<Iitem>
}

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

    static async addItemToAccount(accountId: string, itemData: Iitem) {
        return await axios.post(`${ACCOUNTS_URL}/addItem/${accountId}`, {
            _id: itemData._id,
            product_id: itemData.product_id,
            amount: itemData.amount
        })
    }

    static async addPaymentToAccount(accountId: string, value: number) {

        const dateNow = new Date()
        dateNow.setHours(dateNow.getHours() - 3);

        return await axios.post(`${ACCOUNTS_URL}/addPayment/${accountId}`, {
            value: value,
            date: dateNow,
        })
    }

    static async createAccount(accountData: IcreateAccount) {
        return await axios.post(ACCOUNTS_URL, accountData)
    }

}