import { createContext, useContext, useState } from 'react'
import { FiSidebar } from "react-icons/fi"

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => setIsOpen(prev => !prev)

    return (
        <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
            <div className='flex'>
                {children}
            </div>
        </SidebarContext.Provider>
    )
}

export function SidebarTrigger({ iconSize = "1.25rem" }) {
    const { toggleSidebar } = useContext(SidebarContext)

    return (
        <button className='btn btn-ghost btn-square' onClick={toggleSidebar}>
            <FiSidebar size={iconSize} />
        </button>
    )
}

export function Sidebar({ children }) {
    const { isOpen } = useContext(SidebarContext)

    return (
        <div className={`h-screen border-r border-base-content/20 overflow-x-hidden transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'}`}>
            <div className='w-64'>
                {children}
            </div>
        </div>

    )
}
