import { useState, useEffect } from "react";
import { AdminServices } from "./AdminServices/AdminServices";
import Iuser from "../Interfaces"

export function UsersPage() {

    const [usersData, setUsersData] = useState([]);
    const [openUserForm, setOpenUserForm] = useState(false);

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const createNewUser = (e: React.FormEvent<HTMLFormElement>) => {

        setOpenUserForm(false);
        e.preventDefault();

        try {
            AdminServices.createUser(newUsername, newPassword).then(a => console.log(a));
        } catch (e) {
            console.error(e)
        }

    }

    useEffect(() => {
        AdminServices.getUsers()
            .then(response => {
                setUsersData(response);
            })
            .catch(error => {
                console.error(error)
            });
    }, []);

    return (<div>
        <header className=" h-16 w-full bg-black text-white flex items-center justify-between ">
            <button className=" ml-4 border px-4 py-2">Retornar</button>
            <span>
                <button onClick={() => setOpenUserForm(!openUserForm)} className=" text-green-500 border-green-500 border px-4 py-2">Criar</button>
                <button className=" text-red-500 border-red-500 mx-4 border px-4 py-2">Deletar</button>
            </span>
        </header>
        {openUserForm &&
            <form onSubmit={createNewUser} className=" flex flex-col items-center justify-center bg-green-200 text-gray-800" action="submit">
                <input onChange={(e) => setNewUsername(e.target.value)} maxLength={8} className=" border border-black text-4xl my-2 p-4" placeholder="username" type="text" />
                <input onChange={(e) => setNewPassword(e.target.value)} maxLength={4} className=" border border-black text-4xl my-2 p-4" placeholder="password" type="text" />
                <button className=" mb-4 mt-4 text-2xl bg-black text-white p-4">Confirmar</button>
            </form>
        }

        <table className="border-collapse w-full">
            <thead>
                <tr>
                    <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300">#</th>
                    <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300">Usuário</th>
                    <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300">ID</th>
                    <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300">Senha</th>
                    <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300">Editar</th>
                </tr>
            </thead>
            <tbody>
                {usersData?.map((user: Iuser, index) => {
                    return (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="p-3 border border-gray-300 ">{index}</td>
                            <td className="p-3 border border-gray-300">{user.username}</td>
                            <td className="p-3 border border-gray-300">{user._id}</td>
                            <td className="p-3 border border-gray-300">{user.password}</td>
                            <td className="p-3 border border-gray-300">
                                <button className=" bg-black text-white font-bold py-2 px-4">
                                    Editar
                                </button>
                            </td>
                        </tr>
                    )
                })
                }
            </tbody>
        </table>
    </div>)
}
