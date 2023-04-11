import { Link, Outlet } from "react-router-dom"

export function EditHeader() {

    return (
        <>
            {
                <header className=" sticky h-16 w-full bg-black text-white flex items-center ">
                    <Link to={'/admin/pannel'} className=" ml-4 border px-4 py-2">Retornar ao menu principal</Link>
                </header>
            }
            <div className="overflow-x-hidden">
                <Outlet />
            </div>
        </>
    )
}