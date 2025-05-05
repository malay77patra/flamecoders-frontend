import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { FiSidebar } from "react-icons/fi"
import { useIsMobile } from '@/hooks/use-mobile'
import clsx from 'clsx'
import { IoIosArrowForward } from "react-icons/io"
import { useNavigate } from 'react-router-dom'

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

export function SidebarHeader({ children }) {

    return (
        <div className="p-4 pb-2">
            {children}
        </div>
    )
}

export function SidebarFooter({ children }) {
    return (
        <div className="p-4 pb-2">
            {children}
        </div>
    )
}

export function SidebarMenu({ children }) {

    return (
        <ul>
            {children}
        </ul>
    )
}


export function SidebarMenuItem({ children, className, onClick = () => { }, to = "", isExternal = false }) {
    const navigate = useNavigate();
    const { toggleSidebar } = useContext(SidebarContext);

    const handleClick = (e) => {
        onClick(e);
        toggleSidebar();

        if (to) {
            if (isExternal) {
                window.location.href = to;
            } else {
                navigate(to);
            }
        }
    };

    const Wrapper = to ? 'a' : 'div';
    const wrapperProps = to && isExternal ? { href: to } : {};

    return (
        <li onClick={handleClick}>
            <Wrapper
                className={clsx("hover:bg-base-content/5 p-2 rounded-field cursor-pointer flex items-center gap-2", className)}
                {...wrapperProps}
            >
                {children}
            </Wrapper>
        </li>
    );
}

export function CollapsibleSidebarSubMenu({ children, className, items }) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleIsOpen = () => {
        setIsOpen(!isOpen)
    }

    return (
        <li>
            <div className={clsx("hover:bg-base-content/5 p-2 rounded-field cursor-pointer flex items-center", className)} onClick={toggleIsOpen}>
                <div className="flex-1 flex items-center gap-2">
                    {children}
                </div>
                <IoIosArrowForward className={`transition-all duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
            </div>
            {isOpen && (
                <ul className="border-l border-base-content/20 ml-4 pl-2 flex flex-col">
                    {items}
                </ul>
            )}
        </li>
    );
}

export function CollapsibleSidebarSubMenuItem({ children, className, onClick = () => { } }) {
    const { toggleSidebar } = useContext(SidebarContext)

    return (
        <li className={clsx("hover:bg-base-content/5 p-2 rounded-field cursor-pointer flex items-center gap-2", className)} onClick={(e) => { onClick(e); toggleSidebar(); }}>
            {children}
        </li>
    );
}


export function SidebarContent({ children }) {

    return (
        <div className="p-2 flex-1">
            {children}
        </div>
    )
}

export function SidebarTrigger({ iconSize = "1.25rem" }) {
    const { toggleSidebar } = useContext(SidebarContext)

    useEffect(() => {
        const down = (e) => {
            if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                toggleSidebar()
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

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
                <div className='w-64 shrink-0 box-border select-none flex flex-col'>
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
