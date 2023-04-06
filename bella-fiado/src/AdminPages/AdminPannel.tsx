import { Link } from "react-router-dom";

export function AdminPannel(){
    return(
        <div className=" flex flex-col justify-center items-center h-screen w-screen">
            
            <h1 className=" mb-6 text-2xl">Bem-vindo ao painel de administrador.</h1>
            <div className=" flex justify-between w-1/2">
                <Link to={'/admin/pannel/products'} className=" opacity-70 hover:opacity-100 border-black shadow text-lg border px-4 py-2 ">Produtos</Link>
                <Link to={'/admin/pannel/users'} className=" opacity-70 hover:opacity-100 border-black shadow text-lg border px-4 py-2 ">Usuários</Link>
                <Link to={'/admin/pannel/accounts'} className=" opacity-70 hover:opacity-100 border-black shadow text-lg border px-4 py-2 ">Contas-Fiado</Link>
                <Link to={'/'} className=" opacity-70 hover:opacity-100 border-red-500 text-red-500 shadow text-lg border px-4 py-2 ">Sair</Link>
            </div>
        </div>
    )
}