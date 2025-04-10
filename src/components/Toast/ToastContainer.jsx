import ToastItem from './ToastItem';

const positionClasses = {
    'top-right': 'top-4 right-4 animate-pop',
    'top-left': 'top-4 left-4 animate-pop',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 animate-pop-down',
    'bottom-right': 'bottom-4 right-4 animate-pop',
    'bottom-left': 'bottom-4 left-4 animate-pop',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 animate-pop-up',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pop'
};


const ToastContainer = ({ toasts }) => {
    const grouped = {};

    toasts.forEach((toast) => {
        if (!grouped[toast.position]) grouped[toast.position] = [];
        grouped[toast.position].push(toast);
    });

    return (
        <>
            {Object.entries(grouped).map(([position, toasts]) => (
                <div
                    key={position}
                    className={`fixed z-50 space-y-3 ${positionClasses[position] || positionClasses['top-right']}`}
                >
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} />
                    ))}
                </div>
            ))}
        </>
    );
};

export default ToastContainer;
