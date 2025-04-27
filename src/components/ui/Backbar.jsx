import { useNavigate } from "react-router-dom"
import { IoMdArrowRoundBack } from "react-icons/io"

export default function Backbar() {
    const navigate = useNavigate()

    return (
        <div className="bg-base-100 shadow-sm">
            <div className=" m-auto navbar">
                <button className="btn btn-square btn-outline" onClick={() => navigate(-1)}>
                    <IoMdArrowRoundBack size="1.25rem" />
                </button>
            </div>
        </div>
    )
}