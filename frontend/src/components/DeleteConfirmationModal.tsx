import { useRef, useEffect } from "react";
import { Trash2, X } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName = 'this item' }: DeleteConfirmationModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            modalRef.current?.focus();
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-cocoa/5 overflow-hidden animate-scaleIn"
                role="dialog"
                aria-modal="true"
                ref={modalRef}
            >
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-16 -mt-16"></div>

                <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                        <Trash2 className="w-8 h-8 text-red-600" />
                    </div>

                    <h3 className="text-xl font-bold text-cocoa font-serif mb-2">Delete Product?</h3>

                    <p className="text-cocoa/60 text-sm mb-6 leading-relaxed">
                        Are you sure you want to delete <span className="font-semibold text-cocoa">{itemName}</span>?
                        <br />This action cannot be undone.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-white border border-cocoa/20 text-cocoa rounded-xl font-medium hover:bg-cocoa/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            <span className="group-hover:scale-105 transition-transform">Yes, Delete</span>
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-cocoa/30 hover:text-cocoa transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
