import { useEffect, useState } from "react";
import { ProductsServices } from "./AdminServices/ProductsServices";
import { Iproducts } from "../Interfaces";
import TableComponent from "./Tables/TablesComponent";



export function ProductsPage() {

    const [prodsData, setProdsData] = useState<Iproducts[]>([]);

    useEffect(() => {
        ProductsServices.getProducts()
            .then((response) => {
                setProdsData(response.data);
            })
            .catch(error => {
                console.error(error)
            });
    }, []);

    const deleteProduct = (_id: string) => {
        ProductsServices.deleteProduct(_id)
    }

    const editProduct = (_id: string) => {
        ProductsServices.editProduct(_id, {
            name: 'teste',
            price: 77.77
        })
    }

    return (
        <TableComponent data={prodsData} headers={['a', 'b', 'c', 'd', 'e']} onEdit={() => editProduct} onDelete={() => deleteProduct} />    
    )
}