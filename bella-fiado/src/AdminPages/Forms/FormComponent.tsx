import { useState } from "react"
import { Loader } from "../Loader_Error/Loader";

interface Iinput {
    label: string,
    name: string,
    id: string,
    inputType: string,
    maxLen: number,
    minLen: number,
    placeHolder: string,
    onChangeFunction: React.Dispatch<React.SetStateAction<any>>
}

interface Iform<T> {
    title: string,
    submitFunction: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
    cancelFunction: () => void,
    inputs: Iinput[]
}

export function FormComponent<T extends { _id: string }>({ title, submitFunction, cancelFunction, inputs }: Iform<T>) {

    const [load, setLoad] = useState(false)

    const changeToLoad = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoad(true);
        submitFunction(e).then(() => {
            cancelFunction()
        })
    }

    return (

        <div className=" relative z-10 w-screen flex justify-center items-center">
            {!load &&
                <form onSubmit={e => changeToLoad(e)} className="bg-white border border-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3 mt-16">
                    <h1 className=" mb-4 text-4xl font-light text-gray-700">{title}
                    </h1>
                    {inputs?.map((i, index) => {
                        return (
                            <div key={index} className="mb-4">
                                <label htmlFor={i.id} className="block text-gray-700 font-bold mb-2">
                                    {i.label}
                                </label>
                                <input
                                    onChange={e => i.onChangeFunction(e.target.value)}
                                    type={i.inputType}
                                    id={i.id}
                                    name={i.name}
                                    maxLength={i.maxLen}
                                    minLength={i.minLen}
                                    placeholder={i.placeHolder}
                                    step={i.inputType === 'number' ? '0.5' : ''}
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        )
                    })}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-black text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
                        >
                            Enviar
                        </button>
                        <button
                            onClick={cancelFunction}
                            className=" text-black font-bold py-2 px-4 border border-black"
                        >
                            Cancelar
                        </button>
                    </div>

                </form>
            }

            {
                load &&
                <div className=" w-full h-96 pt-32">
                    <p className=" text-center ml-2 text-gray-700 mb-4">Aguarde...</p>
                    <Loader />
                </div>
            }

        </div>
    )
}