import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '@/components/ui/Navbar'
import { Sidebar } from '@/components/ui/Sidebar'
import { SidebarProvider, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, CollapsibleSidebarSubMenu, CollapsibleSidebarSubMenuItem } from '@/components/ui/Sidebar'

export default function DefaultLayout() {
    const navigate = useNavigate()

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <h2 className='font-semibold'>Flamecoders</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem onClick={() => navigate("/")}>Home</SidebarMenuItem>
                        <SidebarMenuItem onClick={() => navigate("/settings")}>Settings</SidebarMenuItem>
                        <CollapsibleSidebarSubMenu items={
                            <>
                                <CollapsibleSidebarSubMenuItem>Posts</CollapsibleSidebarSubMenuItem>
                                <CollapsibleSidebarSubMenuItem>Drafts</CollapsibleSidebarSubMenuItem>
                            </>
                        }>
                            Dashboard
                        </CollapsibleSidebarSubMenu>
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
