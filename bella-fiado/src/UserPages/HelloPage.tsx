export function HelloPage() {

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const name = params.get('username');

    return (
        <div className=" p-4 h-screen bg-gray-800 text-gray-100 flex justify-center">
            <div className=" w-full  md:w-1/2">
                <h1 className=" text-4xl ">Olá, {name}.</h1>
                <p className=" text-2xl font-thin">Seja bem-vindo de volta à sua conta Fiado.</p>
                <div className=" rounded-xl p-8 mt-4 flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 text-red-500">
                    <h2 className="  text-6xl">-R$478.00</h2>
                    <p className=" text-red-500">É o valor em aberto.</p>
                </div>
                <div className=" flex pt-4 justify-between ">
                    <button className=" rounded-xl text-2xl border px-4 py-2">Ver conta completa</button>
                    <button className=" rounded-xl text-2xl border px-4 py-2">Lançar novo item</button>
                </div>
            </div>
        </div>
    )
}