import { useState, useEffect } from "react";
import { AdminServices } from "./AdminServices/AdminServices";

export function UsersPage() {

    const [usersData, setUsersData] = useState([]);

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
                {usersData?.map((user, index) => {
                    return (
                        <tr className="hover:bg-gray-100">
                            <td className="p-3 border border-gray-300 ">{index}</td>
                            <td className="p-3 border border-gray-300">João</td>
                            <td className="p-3 border border-gray-300">1234</td>
                            <td className="p-3 border border-gray-300">*********</td>
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
