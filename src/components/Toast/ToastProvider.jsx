import { useToastStore } from '@/store/toastStore';
import ToastContainer from './ToastContainer';
import { useLayoutEffect } from 'react';


const ToastProvider = ({ children, position = 'top-right', duration = 3000 }) => {
    const toasts = useToastStore((s) => s.toasts);
    const setDefaults = useToastStore((s) => s.setDefaults);

    useLayoutEffect(() => {
        setDefaults({ position, duration });
    }, [position, duration]);

    useLayoutEffect(() => {
        const timers = toasts.map((toast) => {
            if (toast.type !== 'confirm' && toast.duration) {
                const timeout = setTimeout(() => {
                    useToastStore.getState().removeToast(toast.id);
                }, toast.duration);
                return () => clearTimeout(timeout);
            }
            return null;
        });

        return () => timers.forEach((clearFn) => clearFn && clearFn());
    }, [toasts]);

    return (
        <>
            {children}
            <ToastContainer toasts={toasts} />
        </>
    );
};


export default ToastProvider;
