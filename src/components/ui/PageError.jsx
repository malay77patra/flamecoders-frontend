

export default function PageError({ message = "Error" }) {

    return (
        <div className="absolute -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
            {message}
        </div>
    )
}