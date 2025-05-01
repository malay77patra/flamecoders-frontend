import { FiLink } from "react-icons/fi"
import { FaCheck } from "react-icons/fa6"
import { useState } from "react"

const CopyLinkButton = ({ link = "" }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (!link) return
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <button onClick={handleCopy} className="btn btn-square">
            {copied ? <FaCheck size="1rem" /> : <FiLink size="1rem" />}
        </button>
    )
}

export default CopyLinkButton