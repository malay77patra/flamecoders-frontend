import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '@/components/ui/Navbar'
import { Sidebar, SidebarProvider, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, CollapsibleSidebarSubMenu, CollapsibleSidebarSubMenuItem } from '@/components/ui/Sidebar'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'

export default function DefaultLayout() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const { setTheme } = useTheme()

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <h2 className='font-semibold text-accent'>Flamecoders</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem onClick={() => navigate("/")}>Home</SidebarMenuItem>
                        {isAuthenticated ? (
                            <>
                                <SidebarMenuItem onClick={() => navigate("/settings")}>Account Settings</SidebarMenuItem>
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
                                <CollapsibleSidebarSubMenu items={
                                    <>
                                        <CollapsibleSidebarSubMenuItem onClick={() => setTheme("light")}>Light</CollapsibleSidebarSubMenuItem>
                                        <CollapsibleSidebarSubMenuItem onClick={() => setTheme("dark")}>Dark</CollapsibleSidebarSubMenuItem>
                                        <CollapsibleSidebarSubMenuItem onClick={() => setTheme("modern")}>Modern</CollapsibleSidebarSubMenuItem>
                                        <CollapsibleSidebarSubMenuItem onClick={() => setTheme("cupcake")}>Cupcake</CollapsibleSidebarSubMenuItem>
                                        <CollapsibleSidebarSubMenuItem onClick={() => setTheme("sunset")}>Sunset</CollapsibleSidebarSubMenuItem>
                                        <CollapsibleSidebarSubMenuItem onClick={() => setTheme("night")}>
                                            Night <div className="badge badge-sm badge-secondary">kool</div>
                                        </CollapsibleSidebarSubMenuItem>
                                        <CollapsibleSidebarSubMenuItem onClick={() => setTheme("valentine")}>Valentine</CollapsibleSidebarSubMenuItem>
                                    </>
                                }>
                                    Themes
                                </CollapsibleSidebarSubMenu>
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
