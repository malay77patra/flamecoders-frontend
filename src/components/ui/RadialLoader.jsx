import React from 'react'
import { FaSpinner } from "react-icons/fa"

export default function RadialLoader({ size = "1rem", className = "", ...props }) {
    return <FaSpinner size={size} className={`animate-spin ${className}`} {...props} />
}
