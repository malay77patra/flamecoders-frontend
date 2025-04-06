import React from 'react'
import { RiLoader4Fill } from "react-icons/ri"

export default function RLoader({ size = "1rem", className = "", ...props }) {
    return <RiLoader4Fill size={size} className={`animate-spin ${className}`} {...props} />
}
