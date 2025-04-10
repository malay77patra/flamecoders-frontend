import { toast as toastActions } from '@/lib/toast';
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";

const variantClasses = {
    neutral: 'btn-primary',
    danger: 'btn-error',
    success: 'btn-success',
    info: 'btn-info'
};


const ToastItem = ({ toast }) => {
    const { id, type, title, message, onConfirm, onCancel, variant = 'neutral' } = toast;

    const handleClose = () => toastActions.remove(id);


    if (type === 'success') {
        return (
            <div className="rounded-lg shadow-md p-4 bg-base-100 flex items-center gap-2">
                <FaCheckCircle size="20px" className='text-success animate-scale-in-out' />
                <span>{message}</span>
            </div>
        )
    }

    if (type === 'error') {
        return (
            <div className="rounded-lg shadow-md p-4 bg-base-100 flex items-center gap-2">
                <MdError size="20px" className='text-error animate-scale-in-out' />
                <span>{message}</span>
            </div>
        )
    }

    if (type === 'info') {
        return (
            <div className="rounded-lg shadow-md p-4 bg-base-100 flex items-center gap-2">
                <FaInfoCircle size="20px" className='text-info animate-scale-in-out' />
                <span>{message}</span>
            </div>
        )
    }

    if (type === 'confirm') {
        return (
            <div className="rounded-lg shadow-md p-4 bg-base-100">
                <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <FaQuestionCircle size="20px" className='text-info animate-scale-in-out' />
                    {title}
                </h4>
                <p className="text-sm opacity-60 mt-4">{message}</p>
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => {
                            onCancel?.();
                            handleClose();
                        }}
                        className="btn"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm?.();
                            handleClose();
                        }}
                        className={`btn ${variantClasses[variant] || variantClasses.neutral} px-3 py-1 rounded-md`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        )
    }

};

export default ToastItem;
