import { Outlet } from 'react-router-dom'
import Navbar from '@/components/ui/Navbar'
import { Sidebar } from '@/components/ui/Sidebar'
import { SidebarProvider, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, CollapsibleSidebarSubMenu, CollapsibleSidebarSubMenuItem } from '@/components/ui/Sidebar'

export default function DefaultLayout() {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <h2 className='font-semibold'>Flamecoders</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
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
