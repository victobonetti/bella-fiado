import axios from "axios"

const USERS_URL = 'https://bella-fiado-api-victobonetti.vercel.app/users/'
const PRODS_URL = 'https://bella-fiado-api-victobonetti.vercel.app/products/'

export class AdminServices {
    static async getUsers() {
        try {
            const response = await axios.get(USERS_URL)
            return response.data
        } catch (error) {
            return error
        }
    }

    static async getProducts() {
        try {
            const response = await axios.get(PRODS_URL)
            return response.data
        } catch (error) {
            return error
        }
    }

    static async createUser(username:string, password:string){
        return await axios.post(USERS_URL, {username : username, password : password})
    }
}
