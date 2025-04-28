import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { FiSidebar } from "react-icons/fi"
import { useIsMobile } from '@/hooks/use-mobile'

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
    const { isOpen, toggleSidebar } = useContext(SidebarContext)
    const isMobile = useIsMobile();
    const [showBackdrop, setShowBackdrop] = useState(false)
    const timeoutRef = useRef(null)

    useEffect(() => {
        if (!(isOpen && isMobile)) {
            timeoutRef.current = setTimeout(() => {
                setShowBackdrop(isOpen && isMobile)
            }, 300);
        } else {
            setShowBackdrop(isOpen && isMobile)
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [isOpen, isMobile])

    return (
        <>
            {showBackdrop && (
                <div className={`h-screen w-screen fixed top-0 left-0 z-99 flex transition-all duration-300 ${(isMobile && isOpen) ? 'bg-black/80' : 'bg-black/0'}`} onClick={toggleSidebar}></div>
            )}
            <div className={`${isMobile ? 'fixed left-0 top-0 z-100' : ''} shrink-0 h-screen bg-base-100 overflow-x-hidden transition-all duration-300 border-r border-base-content/20 flex justify-end ${isOpen ? (isMobile ? 'w-76' : 'w-64') : 'w-0'}`}>
                <div className='w-64 shrink-0 p-2 box-border'>
                    {children}
                </div>
                {isMobile && (
                    <div className='w-12 shrink-0 p-1 box-border'>
                        <SidebarTrigger />
                    </div>
                )}
            </div>
        </>

    )
}
