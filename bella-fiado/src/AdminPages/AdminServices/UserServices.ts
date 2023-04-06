import axios from "axios"

const USERS_URL = 'https://bella-fiado-api-victobonetti.vercel.app/users/'


export class UserServices {
    static async getUsers() {
        return await axios.get(USERS_URL)
    }

    static async createUser(username: string, password: string) {
        return await axios.post(USERS_URL, { username: username, password: password })
    }

    static async updateUser(_id: string ,username: string, password: string) {
        return await axios.put(`${USERS_URL}/edit/${_id}`, { username: username, password: password })
    }

    static async getUserById(_id: string) {
        return await axios.post(USERS_URL, { _id: _id })
    }

    static async deleteUserById(_id: string) {
        const urlDelete = `${USERS_URL}/${_id}`;
        return await axios.delete(urlDelete);
    }
}
