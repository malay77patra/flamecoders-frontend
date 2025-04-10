import { useToastStore } from '@/store/toastStore';

export const toast = {
    success: (message, options = {}) =>
        useToastStore.getState().addToast({
            type: 'success',
            message,
            ...options
        }),

    error: (message, options = {}) =>
        useToastStore.getState().addToast({
            type: 'error',
            message,
            ...options
        }),

    info: (message, options = {}) =>
        useToastStore.getState().addToast({
            type: 'info',
            message,
            ...options
        }),

    confirm: (title, message, onConfirm, onCancel, options = {}) =>
        useToastStore.getState().addToast({
            type: 'confirm',
            title,
            message,
            onConfirm,
            onCancel,
            variant: options.variant,
            ...options
        }),

    remove: (id) => useToastStore.getState().removeToast(id)
};
