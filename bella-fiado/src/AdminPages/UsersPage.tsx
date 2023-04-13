import { useState, useEffect, useLayoutEffect } from "react";
import { UserServices } from "./AdminServices/UserServices";
import { Iuser } from "../Interfaces"
import TableComponent from "./AdminPages_components/Tables/Tables/TablesComponent";
import { Loader } from "./AdminPages_components/Loader_Error/Loader_Error/Loader";
import { ErrorMessage } from "./AdminPages_components/Loader_Error/Loader_Error/ErrorMessage";
import { removeAcentosEMaiusculas } from "./stringFunctions";
import { FormComponent } from "./AdminPages_components/Forms/Forms/FormComponent";

export function UsersPage() {

    //Get data states
    const [usersData, setUsersData] = useState<Iuser[]>([]);

    //Page states
    const [openUserCreateForm, setOpenUserCreateForm] = useState(false);
    const [openUserEditForm, setOpenEditForm] = useState(false);
    const [load, setLoad] = useState(false);
    const [erro, setErro] = useState<string>('')

    //post states
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');

    //put states
    const [newEditUsername, setNewEditUsername] = useState('');
    const [newEditPassword, setNewEditPassword] = useState('');
    const [getTargetId, setTargetId] = useState('')

    useLayoutEffect(() => {
        getUsers();
    }, []);

    const createUserInputs = [
        {
            label: 'Nome de usuário (1 - 8 caracteres):',
            name: 'username',
            id: 'username',
            inputType: 'text',
            maxLen: 8,
            minLen: 1,
            placeHolder: '',
            onChangeFunction: setNewUsername,
        },
        {
            label: 'Senha (1 - 4 caracteres):',
            name: 'password',
            id: 'password',
            inputType: 'password',
            maxLen: 4,
            minLen: 1,
            placeHolder: '',
            onChangeFunction: setNewPassword,
        },
    ];

    const editUserInputs = [
        {
            label: 'Nome de usuário (1 - 8 caracteres):',
            name: 'username',
            id: 'username',
            inputType: 'text',
            maxLen: 8,
            minLen: 1,
            placeHolder: '',
            onChangeFunction: setNewEditUsername,
        },
        {
            label: 'Senha (1 - 4 caracteres):',
            name: 'password',
            id: 'password',
            inputType: 'password',
            maxLen: 4,
            minLen: 1,
            placeHolder: '',
            onChangeFunction: setNewEditPassword,
        },
    ];

    const createNewUser = (e: React.FormEvent<HTMLFormElement>) => {
        return new Promise<void>((resolve, reject) => {
            UserServices.createUser(removeAcentosEMaiusculas(newUsername), removeAcentosEMaiusculas(newPassword)).then(a => {
                getUsers()
                resolve()
            }).catch((err) => {
                setErro(String(err))
                reject()
            })
        })
    }

    const editUser = (e: React.FormEvent<HTMLFormElement>) => {
        return new Promise<void>((resolve, reject) => {
            UserServices.updateUser(getTargetId, 
                removeAcentosEMaiusculas(newEditUsername),
                removeAcentosEMaiusculas(newEditPassword))
                .then(() => {
                getUsers()
                resolve()
            }).catch((err) => {
                setErro(String(err))
                reject()
            }
            )
        })
    }

    const deleteUser = (_id: string) => {
        let deletar = confirm('Tem certeza que deseja excluir o usuário de id ' + _id + '?')
        if (deletar) {
            UserServices.deleteUserById(_id).then(() => {
                getUsers();
            }).catch((err) => {
                setErro(String(err))
            })
        }

    }

    const getUsers = () => {
        setLoad(true);
        UserServices.getUsers()
            .then((response) => {
                const { account_id, tokens, ...resposta } = response.data
                console.log(resposta)
                setUsersData(Object.values(resposta));
            })
            .catch(error => {
                console.error(error)
            }).finally(() => {
                setLoad(false);
            })

    }

    return (<>
        <div className=" sticky w-full bg-gradient-to-b from-black to-neutral-900 h-16 flex justify-end items-center">
            <button onClick={() => setOpenUserCreateForm(!openUserCreateForm)} className=" mr-4 border px-4 py-2 text-xl border-green-400 text-green-400">Criar novo usuário</button>
        </div>
        {openUserCreateForm && <FormComponent<Iuser> title="Criar novo usuário." submitFunction={createNewUser} cancelFunction={() => setOpenUserCreateForm(false)} inputs={createUserInputs} />}
        {openUserEditForm && <FormComponent<Iuser> title="Editar usuário." submitFunction={editUser} cancelFunction={() => setOpenEditForm(false)} inputs={editUserInputs} />}

        {load && <Loader />}
        {(usersData.length <= 1 && !load) && <h1 className=" text-neutral-600 font-light text-4xl">Não foram encontrados dados...</h1>}
        {(erro.length > 1) && <ErrorMessage err={erro} />}
        {
            !openUserCreateForm && !openUserEditForm && !load &&
            <TableComponent<Iuser> data={usersData} headers={['#', 'ID', 'USUÁRIO', 'SENHA', 'AÇÕES']} onEdit={() => setOpenEditForm(!openUserEditForm)} onDelete={deleteUser} setTargetId={setTargetId} />
        }
    </>
    )
}
