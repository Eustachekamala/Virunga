import toast, { Toaster } from 'react-hot-toast';

export const showSuccess = (message: string) => {
    toast.success(message, {
        duration: 4000,
        position: 'top-right',
        style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: '500',
        },
    });
};

export const showError = (message: string) => {
    toast.error(message, {
        duration: 5000,
        position: 'top-right',
        style: {
            background: '#dc2626',
            color: '#fff',
            fontWeight: '500',
        },
    });
};

export const showWarning = (message: string) => {
    toast(message, {
        duration: 4500,
        position: 'top-right',
        icon: '⚠️',
        style: {
            background: '#f59e0b',
            color: '#fff',
            fontWeight: '500',
        },
    });
};

export const showInfo = (message: string) => {
    toast(message, {
        duration: 4000,
        position: 'top-right',
        icon: 'ℹ️',
        style: {
            background: '#3b82f6',
            color: '#fff',
            fontWeight: '500',
        },
    });
};

export const ToastToaster = Toaster;

