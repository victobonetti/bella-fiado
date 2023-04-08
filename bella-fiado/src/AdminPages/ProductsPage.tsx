import { FormEvent, useEffect, useLayoutEffect, useState } from "react";
import { ProductsServices } from "./AdminServices/ProductsServices";
import { Iproducts } from "../Interfaces";
import TableComponent from "./Tables/TablesComponent";
import { excluirLetras, removeAcentosEMaiusculas } from "./stringFunctions";
import { Loader } from "./Loader_Error/Loader";
import { FormComponent } from "./Forms/FormComponent";
import { ErrorMessage } from "./Loader_Error/ErrorMessage";



export function ProductsPage() {


    //Get data states
    const [ProductsData, setProductsData] = useState<Iproducts[]>([]);

    //Page states
    const [openProductCreateForm, setOpenProductCreateForm] = useState(false);
    const [openProductEditForm, setOpenProductEditForm] = useState(false);
    const [load, setLoad] = useState(false);
    const [erro, setErro] = useState<string>('')

    //post states
    const [newProductName, setNewProductName] = useState('');
    const [newPrice, setNewPrice] = useState(0);

    //put states
    const [newEditProductname, setNewEditProductname] = useState('');
    const [newEditPrice, setNewEditPrice] = useState(0);
    const [getTargetId, setTargetId] = useState('')

    const getProducts = () => {
        setLoad(true)
        ProductsServices.getProducts()
            .then((response) => {
                const { __v, ...resposta } = response.data
                setProductsData(Object.values(resposta));
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
        let deletar = confirm('Tem certeza que deseja excluir o produto de id ' + _id + '?')
        if (deletar) {
            ProductsServices.deleteProduct(_id).then(() => {
                getProducts()
            }).catch((err) => {
                setErro(err)
            })
        }
    }

    const editProduct = (event: FormEvent<HTMLFormElement>) => {
        return new Promise<void>((resolve, reject) => {
            ProductsServices.editProduct(getTargetId, {
                name: removeAcentosEMaiusculas(newEditProductname),
                price: excluirLetras(String(newEditPrice)),
            }).then(() => {
                getProducts()
                resolve()
            }).catch((err) => {
                setErro(err)
                reject()
            })
        })

    }

    const creatNewProduct = () => {
        return new Promise<void>((resolve, reject) => {
            ProductsServices.createProduct({
                name: removeAcentosEMaiusculas(newProductName),
                price: excluirLetras(String(newPrice))
            }).then(() => {
                getProducts()
                resolve()
            }).catch((err) => {
                setErro(err)
                reject()
            })
        })
    }

    const editProductInput = [
        {
            label: 'Nome do produto:',
            name: 'name',
            id: 'name',
            inputType: 'text',
            maxLen: 16,
            minLen: 1,
            placeHolder: 'Insira o nome do produto.',
            onChangeFunction: setNewEditProductname,
        },
        {
            label: 'Preço:',
            name: 'price',
            id: 'price',
            inputType: 'number',
            maxLen: 6,
            minLen: 1,
            placeHolder: 'Insira o preço do produto.',
            onChangeFunction: setNewEditPrice,
        },
    ]

    const createProductInput = [
        {
            label: 'Nome do produto:',
            name: 'name',
            id: 'name',
            inputType: 'text',
            maxLen: 16,
            minLen: 1,
            placeHolder: 'Insira o nome do produto.',
            onChangeFunction: setNewProductName,
        },
        {
            label: 'Preço:',
            name: 'price',
            id: 'price',
            inputType: 'number',
            maxLen: 6,
            minLen: 1,
            placeHolder: 'Insira o preço do produto.',
            onChangeFunction: setNewPrice,
        },
    ]

    return (
        <>
            <div className=" sticky w-full bg-gradient-to-b from-black to-neutral-900 h-16 flex justify-end items-center">
                <button onClick={() => setOpenProductCreateForm(!openProductCreateForm)} className=" mr-4 border px-4 py-2 text-xl border-green-400 text-green-400">Criar novo produto</button>
            </div>
            {!load && !openProductCreateForm && !openProductEditForm &&
                <TableComponent<Iproducts> data={ProductsData} headers={['#', 'id', 'nome', 'preço', 'ações']}
                    onEdit={() => setOpenProductEditForm(!openProductEditForm)} onDelete={() => deleteProduct} setTargetId={setTargetId} />
            }
            {openProductEditForm &&
                <FormComponent<Iproducts> title={"Editar produto"}
                    submitFunction={editProduct}
                    cancelFunction={() => setOpenProductEditForm(false)}
                    inputs={editProductInput} />
            }
            {
                openProductCreateForm &&
                <FormComponent<Iproducts> title={"Criar produto"}
                    submitFunction={creatNewProduct}
                    cancelFunction={() => setOpenProductCreateForm(false)}
                    inputs={createProductInput} />

            }
            {(ProductsData.length <= 1 && !load) && <h1 className=" text-neutral-600 font-light text-4xl">Não foram encontrados dados...</h1>}
            {erro && <ErrorMessage err={erro} />}
            {load && < Loader />}
        </>
    )
}