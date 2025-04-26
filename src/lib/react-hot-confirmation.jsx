import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ConfirmationContext = createContext(null);

const VARIANTS = {
    base: 'btn',
    primary: 'btn btn-primary',
    error: 'btn btn-error',
    success: 'btn btn-success',
    info: 'btn btn-info',
};

export function Confirmer() {
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '',
        cancelText: '',
        variant: 'base',
        onConfirm: () => { },
        onCancel: () => { },
    });

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape' && confirmState.isOpen) {
                handleDismiss();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [confirmState.isOpen]);

    const handleDismiss = useCallback(() => {
        setConfirmState(prev => {
            if (prev.isOpen) {
                prev.onCancel();
            }
            return { ...prev, isOpen: false };
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setConfirmState(prev => {
            if (prev.isOpen) {
                setTimeout(() => prev.onConfirm(), 0);
            }
            return { ...prev, isOpen: false };
        });
    }, []);

    const showConfirmation = useCallback((options) => {
        setConfirmState({
            isOpen: true,
            title: options.title || 'Confirmation',
            message: options.message || 'Are you sure?',
            confirmText: options.confirmText || 'Confirm',
            cancelText: options.cancelText || 'Cancel',
            variant: options.variant || 'base',
            onConfirm: options.onConfirm || (() => { }),
            onCancel: options.onCancel || (() => { }),
        });
    }, []);

    useEffect(() => {
        window.showHotConfirmation = showConfirmation;
    }, [showConfirmation]);

    if (!confirmState.isOpen) return null;

    const confirmButtonClass = VARIANTS[confirmState.variant] || VARIANTS.base;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={handleDismiss}
        >
            <div
                className="bg-base-100 max-w-md w-full rounded-lg shadow-lg pointer-events-auto flex flex-col border p-2"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-1 p-2">
                    <div className="flex flex-col">
                        <h4 className="text-lg font-medium">
                            {confirmState.title}
                        </h4>
                        <p className="mt-2 text-sm text-base-content/60">
                            {confirmState.message}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 justify-end mt-4">
                    <button
                        onClick={handleDismiss}
                        className='btn'
                    >
                        {confirmState.cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`btn ${confirmButtonClass}`}
                    >
                        {confirmState.confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * @param {Object} options - Configuration options
 * @param {string} options.title - The title of the confirmation
 * @param {string} options.message - The message to display
 * @param {string} options.confirmText - Text for the confirm button (default: "Confirm")
 * @param {string} options.cancelText - Text for the cancel button (default: "Cancel")
 * @param {Function} options.onConfirm - Function to call when confirmed
 * @param {Function} options.onCancel - Function to call when canceled (optional)
 * @param {'base'|'primary'|'error'|'success'|'info'} options.variant - Button variant (default: 'base')
 */
export const confirmation = (options) => {
    if (typeof window !== 'undefined' && window.showHotConfirmation) {
        window.showHotConfirmation(options);
    } else {
        console.error('Confirmer component is not mounted. Make sure to add <Confirmer /> to your app.');
    }
};

export default confirmation;