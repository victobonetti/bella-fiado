export function ErrorMessage({err}: {err:string}) {
    return (
        <div className=" flex justify-center flex-col items-center mt-4">
            <h1 className=" text-red-600 font-bold text-4xl">;-;</h1>
            <p className=" text-lg font-light text-gray-400">{err}</p>
        </div>
    )
}