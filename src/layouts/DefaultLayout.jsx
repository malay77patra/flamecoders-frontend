import { Outlet } from 'react-router-dom'
import Navbar from '@/components/ui/Navbar'
import { Sidebar } from '@/components/ui/Sidebar'
import { SidebarProvider } from '@/components/ui/Sidebar'

export default function DefaultLayout() {
    return (
        <SidebarProvider>
            <Sidebar>
                Side bar content
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
