import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '@/components/ui/Navbar'
import { Sidebar, SidebarProvider, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, CollapsibleSidebarSubMenu, CollapsibleSidebarSubMenuItem } from '@/components/ui/Sidebar'
import { useAuth } from '@/hooks/useAuth'

export default function DefaultLayout() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <h2 className='font-semibold'>Flamecoders</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem onClick={() => navigate("/")}>Home</SidebarMenuItem>
                        {isAuthenticated ? (
                            <>
                                <SidebarMenuItem onClick={() => navigate("/settings")}>Settings</SidebarMenuItem>
                                <CollapsibleSidebarSubMenu items={
                                    <>
                                        <CollapsibleSidebarSubMenuItem onClick={() => navigate("/dashboard")}>Overview</CollapsibleSidebarSubMenuItem>
                                        <CollapsibleSidebarSubMenuItem onClick={() => navigate("/dashboard?tab=posts")}>Posts</CollapsibleSidebarSubMenuItem>
                                    </>
                                }>
                                    Dashboard
                                </CollapsibleSidebarSubMenu>
                            </>
                        ) : (
                            <>
                                <SidebarMenuItem onClick={() => navigate("/login")}>Login</SidebarMenuItem>
                                <SidebarMenuItem onClick={() => navigate("/register")}>Register</SidebarMenuItem>
                            </>
                        )}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <div className='w-full'>
                <Navbar />
                <div className='p-2 md:p-4'>
                    <Outlet />
                </div>
            </div>
        </SidebarProvider>
    );
}
