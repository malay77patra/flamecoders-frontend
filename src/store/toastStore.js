import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export const useToastStore = create((set) => ({
    toasts: [],
    defaultConfig: {
        duration: 3000,
        position: 'top-right'
    },
    setDefaults: (config) =>
        set((state) => ({
            defaultConfig: { ...state.defaultConfig, ...config }
        })),
    addToast: (toast) =>
        set((state) => {
            const config = {
                duration: toast.duration ?? state.defaultConfig.duration,
                position: toast.position ?? state.defaultConfig.position
            };
            return {
                toasts: [...state.toasts, { ...toast, ...config, id: uuidv4() }]
            };
        }),
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
        }))
}));
