import React, { useEffect } from 'react'
import { toast } from '@/lib/toast'

export default function Home() {

    useEffect(() => {
        toast.confirm()
    }, [])
    return (
        <>
            <div>Home</div>
        </>
    )
}
