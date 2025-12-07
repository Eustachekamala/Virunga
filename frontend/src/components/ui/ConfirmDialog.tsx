import type { ReactNode } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'info'
}: ConfirmDialogProps) => {
    if (!isOpen) return null;

    const variantStyles = {
        danger: 'bg-red-600 hover:bg-red-700',
        warning: 'bg-yellow-600 hover:bg-yellow-700',
        info: 'bg-blue-600 hover:bg-blue-700',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold text-cocoa mb-3">{title}</h3>

                <div className="text-cocoa/70 mb-6">
                    {typeof message === 'string' ? <p>{message}</p> : message}
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-lg border border-cocoa/20 text-cocoa hover:bg-cocoa/5 font-medium transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                        className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all ${variantStyles[variant]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
