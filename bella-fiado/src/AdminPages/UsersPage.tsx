import { useState, useEffect, useLayoutEffect } from "react";
import { UserServices } from "./AdminServices/UserServices";
import { Iuser } from "../Interfaces"
import TableComponent from "./Tables/TablesComponent";
import { Loader } from "./Loader_Error/Loader";
import { ErrorMessage } from "./Loader_Error/ErrorMessage";
import { removeAcentosEMaiusculas } from "./stringFunctions";

export function UsersPage() {

    const [usersData, setUsersData] = useState<Iuser[]>([]);
    const [openUserForm, setOpenUserForm] = useState(false);
    const [load, setLoad] = useState(false);


    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [erro, setErro] = useState<string>('')

    useLayoutEffect(() => {
        getUsers();
    }, []);

    const createNewUser = (e: React.FormEvent<HTMLFormElement>) => {
        setOpenUserForm(false);
        e.preventDefault();
        try {
            UserServices.createUser(removeAcentosEMaiusculas(newUsername), removeAcentosEMaiusculas(newPassword)).then(a => { 
                getUsers()
            });
        } catch (e) {
            console.error(e)
        } finally {
            alert('Usuário criado com sussesso! ') 
        }
    }

    const editUser = (user: Iuser) => {
        let newUserName = prompt('Insira o novo nome de usuário (Clique em cancelar para manter o anterior).') || user.username
        let newPassword = prompt('Insira a nova senha (Clique em cancelar para manter o anterior).') || user.password

        if (newUserName.length <= 8 && newPassword.length <= 4) {
            UserServices.updateUser(user._id, removeAcentosEMaiusculas(newUserName), removeAcentosEMaiusculas(newPassword)).then(() => {
                alert('Usuário Editado!')
                getUsers()
            }).catch((e) => setErro(String(e)))
        } else {
            alert('Atenção: Respeite o limite de até 8 caractéres para nome de usuário, e 4 caractéres para senha.')
        }
    }

    const deleteUser = (_id: string) => {
        let deletar = confirm('Tem certeza que deseja excluir o usuário de id ' + _id + '?')
        if (deletar) {
            UserServices.deleteUserById(_id).then(() => {
                getUsers();
                alert('Usuário deletado.')
            })
        }

    }

    const getUsers = () => {
        setLoad(true);
        UserServices.getUsers()
            .then((response) => {
                const { account_id, tokens, ...resposta } = response.data
                setUsersData(Object.values(resposta));
            })
            .catch(error => {
                console.error(error)
            }).finally(() =>{
                setLoad(false);
            })
        
    }

    return (<>
        <div className=" sticky w-full bg-gradient-to-b from-black to-neutral-900 h-16 flex justify-end items-center">
            <button onClick={() => setOpenUserForm(!openUserForm)} className=" mr-4 border px-4 py-2 text-xl border-green-400 text-green-400">Criar novo usuário</button>
        </div>
        {openUserForm &&
            <div className=" relative z-10 w-screen flex justify-center items-center">
                <form onSubmit={createNewUser} className="bg-white border border-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3 mt-16">
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
                            Nome de usuário (1 - 8 caracteres):
                        </label>
                        <input
                            onChange={e => setNewUsername(e.target.value)}
                            type="text"
                            id="username"
                            name="username"
                            maxLength={8}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                            Senha (1 - 4 caracteres):
                        </label>
                        <input
                            onChange={e => setNewPassword(e.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            maxLength={4}
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
                            onClick={() => setOpenUserForm(!openUserForm)}
                            className=" text-black font-bold py-2 px-4 border border-black"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        }

        {load && <Loader />}
        {(usersData.length <= 1 && !load) && <h1 className=" text-neutral-600 font-light text-4xl">Não foram encontrados dados :(</h1>}
        {(erro.length > 1) && <ErrorMessage err={erro} />}
        {
            !openUserForm &&
            <TableComponent<Iuser> data={usersData} headers={['#', 'ID', 'USUÁRIO', 'SENHA', 'AÇÕES']} onEdit={editUser} onDelete={deleteUser} />
        }
    </>)
}
