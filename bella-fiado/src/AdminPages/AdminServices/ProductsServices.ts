import axios from "axios"
const PRODS_URL = 'https://bella-fiado-api-victobonetti.vercel.app/products'

interface Iprod {
    name: string,
    price: number
}

export class ProductsServices {
     static async getProducts() {
        return await axios.get(PRODS_URL)
    }

    static async createProduct(prodData:Iprod){
        return await axios.post(PRODS_URL, prodData)
    }

    static async editProduct(_id:string, prodData:Iprod){
        return await axios.put(`${PRODS_URL}/${_id}`, prodData)
    }

    static async deleteProduct(_id:string){
        return await axios.delete(`${PRODS_URL}/${_id}`)
    }    
}