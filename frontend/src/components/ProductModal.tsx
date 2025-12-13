import React, { useEffect, useState, useRef } from 'react';
import { Category, TypeProduct } from '../types';
import type { CreateProductDTO, Product } from '../types';
import { Camera, Upload, X } from 'lucide-react';
import { API_BASE_URL } from '../api/client';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateProductDTO) => Promise<void>;
    productToEdit?: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, productToEdit }) => {
    const [loading, setLoading] = useState(false);

    // ----------------------
    // FORM STATE
    // ----------------------
    const [formData, setFormData] = useState<CreateProductDTO>({
        name: '',
        quantity: 0,
        description: '',
        category: Category.ELECTRONICS,
        typeProduct: TypeProduct.NON_CONSUMABLE,
        imageFile: undefined,
    });

    const [file, setFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const mobileFileInputRef = useRef<HTMLInputElement | null>(null);

    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // ----------------------
    // CAMERA STATE
    // ----------------------
    const [showCamera, setShowCamera] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // ----------------------
    // INITIALIZATION
    // ----------------------
    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                setFormData({
                    name: productToEdit.name,
                    quantity: productToEdit.quantity,
                    description: productToEdit.description,
                    category: productToEdit.category,
                    typeProduct: productToEdit.typeProduct,
                    imageFile: undefined,
                });

                if (productToEdit.imageFile) {
                    setImagePreview(
                        productToEdit.imageFile.startsWith('http')
                            ? productToEdit.imageFile
                            : `${API_BASE_URL.replace('/api/v1', '')}/uploads/${productToEdit.imageFile}`
                    );
                }
            } else {
                // Reset new form
                setFormData({
                    name: '',
                    quantity: 0,
                    description: '',
                    category: Category.ELECTRICAL,
                    typeProduct: TypeProduct.NON_CONSUMABLE,
                    imageFile: undefined,
                });
                setImagePreview(null);
            }

            setFile(null);
            setShowCamera(false);
        } else {
            stopCamera();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, productToEdit]);

    // ----------------------
    // CAMERA HANDLING
    // ----------------------
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
    };

    const startCamera = async () => {
        setCameraError(null);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
            setShowCamera(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            let message = 'Could not access camera.';

            if (error.name === 'NotAllowedError') {
                message = 'Camera permission denied. Enable it in browser settings.';
            } else if (error.name === 'NotFoundError') {
                message = 'No camera device found.';
            } else if (error.name === 'NotReadableError') {
                message = 'Camera is in use by another application.';
            }

            setCameraError(message);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;

        if (video.videoWidth === 0) return;

        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0);

        canvas.toBlob(blob => {
            if (blob) {
                const captured = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
                setFile(captured);
                setImagePreview(URL.createObjectURL(blob));
                setShowCamera(false);
                stopCamera();
            }
        }, 'image/jpeg', 0.8);
    };

    // ----------------------
    // FORM HANDLING
    // ----------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit({
                ...formData,
                imageFile: file ?? undefined,
            });
            onClose();
        } catch (error) {
            console.error('Failed to save product', error);
        } finally {
            setLoading(false);
        }
    };


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]:
                name === "quantity"
                    ? Number(value)
                    : name === "category"
                    ? (value as Category)
                    : name === "typeProduct"
                    ? (value as TypeProduct)
                    : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const f = e.target.files[0];
        setFile(f);
        setImagePreview(URL.createObjectURL(f));
    };

    const removeImage = () => {
        setFile(null);
        setImagePreview(null);
        setFormData(prev => ({ ...prev, imageFile: undefined }));
    };

    // ----------------------
    // RENDER
    // ----------------------
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-gold/20">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6 border-b border-cocoa/10 pb-4">
                    <h2 className="text-2xl font-serif font-bold text-cocoa">
                        {productToEdit ? 'Edit Product' : 'New Product'}
                    </h2>
                    <button onClick={onClose} className="text-cocoa/40 hover:text-cocoa">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label className="text-sm font-semibold text-cocoa/80 mb-1 block">Name</label>
                        <input
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-cream border border-cocoa/10 rounded-lg px-4 py-3 text-cocoa"
                        />
                    </div>

                    {/* Quantity + Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-cocoa/80 mb-1 block">Quantity</label>
                            <input
                                name="quantity"
                                type="number"
                                min="0"
                                required
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full bg-cream border border-cocoa/10 rounded-lg px-4 py-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-cocoa/80 mb-1 block">Type</label>
                            <select
                                name="typeProduct"
                                value={formData.typeProduct}
                                onChange={handleChange}
                                className="w-full bg-cream border border-cocoa/10 rounded-lg px-4 py-3"
                            >
                                {Object.values(TypeProduct).map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm font-semibold text-cocoa/80 mb-1 block">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-cream border border-cocoa/10 rounded-lg px-4 py-3"
                        >
                            {Object.values(Category).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-semibold text-cocoa/80 mb-1 block">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-cream border border-cocoa/10 rounded-lg px-4 py-3"
                        />
                    </div>

                    {/* Image Section */}
                    <div>
                        <label className="block text-sm font-semibold text-cocoa/80 mb-2">Product Image</label>

                        {/* Upload and Camera Buttons */}
                        {!imagePreview && !showCamera && (
                            <div className="grid grid-cols-2 gap-3">

                                {/* Upload */}
                                <div>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-dashed border-blue-300 rounded-lg p-6 flex flex-col items-center"
                                    >
                                        <Upload className="w-8 h-8 text-blue-600 mb-2" />
                                        <span className="text-blue-700 text-sm">Upload Image</span>
                                    </label>
                                </div>

                                {/* Camera */}
                                <div>
                                    <input
                                        ref={mobileFileInputRef}
                                        id="file-capture"
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isMobile) {
                                                mobileFileInputRef.current?.click();
                                            } else {
                                                startCamera();
                                            }
                                        }}
                                        className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-dashed border-green-300 rounded-lg p-6 flex flex-col items-center"
                                    >
                                        <Camera className="w-8 h-8 text-green-600 mb-2" />
                                        <span className="text-green-700 text-sm">Take Photo</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Camera Error */}
                        {cameraError && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 text-sm mb-3">
                                {cameraError}
                            </div>
                        )}

                        {/* Camera View */}
                        {showCamera && (
                            <div className="space-y-3">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-lg" />

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={capturePhoto}
                                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg"
                                    >
                                        Capture
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { setShowCamera(false); stopCamera(); }}
                                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Image Preview */}
                        {imagePreview && !showCamera && (
                            <div className="relative mt-3">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg border"
                                />

                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-cocoa/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-cocoa/60 hover:text-cocoa"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-cocoa text-gold rounded-lg font-bold disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : productToEdit ? 'Save Changes' : 'Create Product'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default ProductModal;
