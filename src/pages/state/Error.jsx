import { useNavigate } from "react-router-dom"

export default function Error({ message, next = "/" }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(next)
    }

    return (
        <div className='pt-[30vh] flex flex-col items-center justify-center'>
            <h3 className="text-2xl font-bold text-error">Error</h3>
            <p className="text-error">{message}</p>
            <button className="btn mt-4" onClick={handleClick}>
                Go Back
            </button>
        </div>
    )
}