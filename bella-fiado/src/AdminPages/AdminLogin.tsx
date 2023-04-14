import { useState } from "react"

export function AdminLogin() {
    
    

    const [getAdminPassword, setAdminPassword] = useState<string>('')

    const validadeAdmin = (event:React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if (getAdminPassword == '211276') {
            alert('Login efetuado com sucesso. ' + window.location.href)
            window.location.href = '/admin/pannel'

        } else {
            alert('Senha incorreta.')
        }
    }

    return (
        <div className=" flex flex-col justify-center items-center h-screen w-screen">
            <form onSubmit={e => validadeAdmin(e)} className=" border flex flex-col w-4/5 lg:w-1/3 border-black p-12" action="">
                <label className=" text-center font-bold text-xl mb-2 ">
                    Insira a senha de administrador:
                </label>
                <input className=" text-4xl border border-black" onChange={e => setAdminPassword(e.target.value)} type="password" maxLength={6} />
                <button className=" mt-4 text-white bg-black px-4 py-2 text-2xl">Confirmar</button>
            </form>
        </div>
    )
}