import { useState, useEffect, useLayoutEffect } from "react";
import { UserServices } from "./AdminServices/UserServices";
import { Iuser } from "../Interfaces"
import TableComponent from "./Tables/TablesComponent";

export function UsersPage() {

    const [usersData, setUsersData] = useState<Iuser[]>([]);
    const [openUserForm, setOpenUserForm] = useState(false);

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const createNewUser = (e: React.FormEvent<HTMLFormElement>) => {
        setOpenUserForm(false);
        e.preventDefault();
        try {
            UserServices.createUser(newUsername, newPassword).then(a => console.log(a));
        } catch (e) {
            console.error(e)
        }
    }

    const editUser = (_id: string) => {
        UserServices.updateUser(_id, 'Ronaldo', '123')
    }

    const deleteUser = (_id: string) => {
        UserServices.deleteUserById(_id)
    }

    useLayoutEffect(() => {
        UserServices.getUsers()
            .then((response) => {
                const { account_id, tokens, ...resposta } = response.data
                setUsersData(Object.values(resposta));
            })
            .catch(error => {
                console.error(error)
            });
    }, []);


    return (<div>
        {openUserForm &&
            <form onSubmit={createNewUser} className=" flex flex-col items-center justify-center bg-green-200 text-gray-800" action="submit">
                <input onChange={(e) => setNewUsername(e.target.value)} maxLength={8} className=" border border-black text-4xl my-2 p-4" placeholder="username" type="text" />
                <input onChange={(e) => setNewPassword(e.target.value)} maxLength={4} className=" border border-black text-4xl my-2 p-4" placeholder="password" type="text" />
                <button className=" mb-4 mt-4 text-2xl bg-black text-white p-4">Confirmar</button>
            </form>
        }
        { usersData.length > 0 &&
            <TableComponent<Iuser> data={usersData} headers={['#', 'USUÁRIO', 'ID', 'SENHA', 'AÇÕES']} onEdit={editUser} onDelete={deleteUser} />
        }

    </div>)
}
