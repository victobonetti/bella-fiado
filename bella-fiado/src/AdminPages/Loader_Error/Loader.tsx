import './load.css'

export function Loader() {
    return (
        <div className=' absolute w-full flex justify-center'>
            <div className=" lds-dual-ring"></div>
        </div>
    )
}