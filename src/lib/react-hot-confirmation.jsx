import React, { useState, useEffect, useRef, useCallback } from 'react';

const VARIANTS = {
    base: 'btn',
    primary: 'btn btn-primary',
    error: 'btn btn-error',
    success: 'btn btn-success',
    info: 'btn btn-info',
};

export function Confirmer() {
    const dialogRef = useRef(null);
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

    const handleDismiss = useCallback(() => {
        dialogRef.current?.close();
        confirmState.onCancel?.();
        setConfirmState(prev => ({ ...prev, isOpen: false }));
    }, [confirmState]);

    const handleConfirm = useCallback(() => {
        dialogRef.current?.close();
        setTimeout(() => confirmState.onConfirm?.(), 0);
        setConfirmState(prev => ({ ...prev, isOpen: false }));
    }, [confirmState]);

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

    useEffect(() => {
        if (confirmState.isOpen && dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, [confirmState.isOpen]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const handleNativeClose = () => {
            setConfirmState(prev => ({ ...prev, isOpen: false }));
        };

        dialog.addEventListener('close', handleNativeClose);
        return () => {
            dialog.removeEventListener('close', handleNativeClose);
        };
    }, []);

    const confirmButtonClass = VARIANTS[confirmState.variant] || VARIANTS.base;

    return (
        <dialog id="confirmation_modal" className="modal" ref={dialogRef}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">{confirmState.title}</h3>
                <p className="py-4">{confirmState.message}</p>
                <div className="modal-action">
                    <form method="dialog" className="flex gap-2">
                        <button type="button" onClick={handleDismiss} className="btn">
                            {confirmState.cancelText}
                        </button>
                        <button type="button" onClick={handleConfirm} className={confirmButtonClass}>
                            {confirmState.confirmText}
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}

export const confirmation = (options) => {
    if (typeof window !== 'undefined' && window.showHotConfirmation) {
        window.showHotConfirmation(options);
    } else {
        console.error('Confirmer component is not mounted. Make sure to add <Confirmer /> to your app.');
    }
};

export default confirmation;
