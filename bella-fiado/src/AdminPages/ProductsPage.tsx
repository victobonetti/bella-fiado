import { useEffect, useLayoutEffect, useState } from "react";
import { ProductsServices } from "./AdminServices/ProductsServices";
import { Iproducts } from "../Interfaces";
import TableComponent from "./Tables/TablesComponent";
import { excluirLetras } from "./stringFunctions";
import { Loader } from "./Loader_Error/Loader";



export function ProductsPage() {

    const [prodsData, setProdsData] = useState<Iproducts[]>([]);
    const [load, setLoad] = useState(false)

    const [newProductName, setNewProductName] = useState('')
    const [newProductPrice, setNewProductPrice] = useState('')

    const [newEditName, setNewEditName] = useState('')
    const [newEditPrice, setNewEditPrice] = useState(0)

    const [openProductForm, setOpenProductForm] = useState(false)

    const getProducts = () => {
        setLoad(true)
        ProductsServices.getProducts()
            .then((response) => {
                const { __v, ...resposta } = response.data
                console.log(Object.values(resposta))
                setProdsData(Object.values(resposta));
            })
            .catch(error => {
                alert(error)
            }).finally(() => {
                setLoad(false)
            })
    };

    useLayoutEffect(() => {
        getProducts()
    }, [])

    const deleteProduct = (_id: string) => {
        ProductsServices.deleteProduct(_id).then(() => {
            getProducts()
            alert('Produto foi excluído com sucesso.')
        })
    }

    const editProduct = (_id: string) => {
        ProductsServices.editProduct(_id, {
            name: 'teste',
            price: 77.77
        }).then(() => {
            getProducts()
            alert('Produto foi editado com sucesso.')
        })
    }

    const creatNewProduct = () => {
        ProductsServices.createProduct({
            name: 'teste',
            price: 77.78
        }).then(() => {
            getProducts()
            alert('Produto foi criado com sucesso.')

        })
    }

    return (
        <>
            <div className=" sticky w-full bg-gradient-to-b from-black to-neutral-900 h-16 flex justify-end items-center">
                <button onClick={() => setOpenProductForm(!openProductForm)} className=" mr-4 border px-4 py-2 text-xl border-green-400 text-green-400">Criar novo poduto</button>
            </div>
            {
                openProductForm &&
                <div className="relative z-10 w-screen flex justify-center items-center">
                    <form onSubmit={creatNewProduct} className="bg-white border border-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3 mt-16">
                        <div className="mb-4">
                            <label htmlFor="product-name" className="block text-gray-700 font-bold mb-2">
                                Nome do Produto:
                            </label>
                            <input
                                onChange={e => setNewProductName(e.target.value)}
                                type="text"
                                id="product-name"
                                name="product-name"
                                maxLength={50}
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="product-price" className="block text-gray-700 font-bold mb-2">
                                Preço:
                            </label>
                            <input
                                onChange={e => setNewProductPrice(e.target.value)}
                                type="number"
                                id="product-price"
                                name="product-price"
                                step="0.01"
                                min="0.01"
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-black text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                            >
                                Enviar
                            </button>
                            <button
                                onClick={() => setOpenProductForm(!openProductForm)}
                                className="text-black font-bold py-2 px-4 border border-black"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            }
            {(!openProductForm) &&
                <TableComponent data={prodsData} headers={['#', 'id', 'nome', 'preço', 'ações']} onEdit={() => editProduct} onDelete={() => deleteProduct} />
            }
            {load && < Loader />}
        </>
    )
}