import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '@/components/ui/Navbar'
import { Sidebar, SidebarProvider, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, CollapsibleSidebarSubMenu, CollapsibleSidebarSubMenuItem } from '@/components/ui/Sidebar'
import { useAuth } from '@/hooks/useAuth'
import { GoHomeFill } from "react-icons/go"
import { FaGithub } from "react-icons/fa"
import { TbLayoutDashboardFilled } from "react-icons/tb"

export default function DefaultLayout() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <h2 className='font-semibold text-accent'>Flamecoders</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem onClick={() => navigate("/")}>
                            <GoHomeFill /> Home
                        </SidebarMenuItem>
                        {isAuthenticated && (
                            <>
                                <CollapsibleSidebarSubMenu items={
                                    <>
                                        <CollapsibleSidebarSubMenuItem onClick={() => navigate("/dashboard")}>Overview</CollapsibleSidebarSubMenuItem>
                                        <CollapsibleSidebarSubMenuItem onClick={() => navigate("/dashboard?tab=posts")}>Posts</CollapsibleSidebarSubMenuItem>
                                    </>
                                }>
                                    <TbLayoutDashboardFilled /> Dashboard
                                </CollapsibleSidebarSubMenu>
                            </>
                        )}
                        <SidebarMenuItem to="https://github.com/malay77patra/flamecoders-frontend" isExternal={true}>
                            <FaGithub /> Github
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <div className='w-full'>
                <Navbar />
                <div className='p-2 md:p-4'>
                    <Outlet />
                </div>
            </div>
        </SidebarProvider >
    );
}
