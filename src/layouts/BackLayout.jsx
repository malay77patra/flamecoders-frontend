import { Outlet } from 'react-router-dom'
import Backbar from '@/components/ui/Backbar'

export default function BackLayout() {
    return (
        <>
            <Backbar />
            <div className='p-2 md:p-4'>
                <Outlet />
            </div>
        </>
    );
}
