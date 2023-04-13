interface iChart {
    _id: string
}


export function Chart(props: iChart) {
    return (
        <div>
            <p>{props._id}</p>
        </div>
    )
}