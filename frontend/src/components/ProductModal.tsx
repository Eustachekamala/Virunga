import React, { useEffect, useState, useRef } from 'react';
import { Category, TypeProduct } from '../types';
import type { CreateProductDTO, Product } from '../types';
import { Camera, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-cocoa/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="bg-cream rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 animate-in zoom-in-95 duration-300 border border-white/20">
                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b border-cocoa/5 bg-white/50 backdrop-blur sticky top-0 z-20">
                    <div>
                        <h2 className="text-2xl font-bold text-cocoa tracking-tight">
                            {productToEdit ? 'Edit Product' : 'New Product'}
                        </h2>
                        <p className="text-sm text-cocoa/60">Fill in the details below.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-cocoa/40 hover:text-cocoa hover:bg-black/5 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-cocoa/80">Product Name</label>
                        <input
                            name="name"
                            required
                            placeholder="e.g. Industrial Mixer"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-white border border-cocoa/10 rounded-xl px-4 py-3 text-cocoa focus:ring-2 focus:ring-gold/50 outline-none transition-all placeholder:text-cocoa/30"
                        />
                    </div>

                    {/* Quantity + Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-cocoa/80">Quantity</label>
                            <input
                                name="quantity"
                                type="number"
                                min="0"
                                required
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full bg-white border border-cocoa/10 rounded-xl px-4 py-3 text-cocoa focus:ring-2 focus:ring-gold/50 outline-none transition-all placeholder:text-cocoa/30"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-cocoa/80">Type</label>
                            <div className="relative">
                                <select
                                    name="typeProduct"
                                    value={formData.typeProduct}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-cocoa/10 rounded-xl px-4 py-3 text-cocoa focus:ring-2 focus:ring-gold/50 outline-none appearance-none transition-all"
                                >
                                    {Object.values(TypeProduct).map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-t-[5px] border-t-cocoa/30 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent"></div>
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-cocoa/80">Category</label>
                        <div className="relative">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-white border border-cocoa/10 rounded-xl px-4 py-3 text-cocoa focus:ring-2 focus:ring-gold/50 outline-none appearance-none transition-all"
                            >
                                {Object.values(Category).map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-t-[5px] border-t-cocoa/30 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent"></div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-cocoa/80">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            placeholder="Brief description of the product..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-white border border-cocoa/10 rounded-xl px-4 py-3 text-cocoa focus:ring-2 focus:ring-gold/50 outline-none transition-all placeholder:text-cocoa/30 resize-none"
                        />
                    </div>

                    {/* Image Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-cocoa/80">Product Image</label>

                        {/* Upload and Camera Buttons */}
                        {!imagePreview && !showCamera && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        className="cursor-pointer group relative overflow-hidden bg-white border border-dashed border-cocoa/20 rounded-xl p-8 flex flex-col items-center justify-center hover:border-gold hover:bg-gold/5 transition-all"
                                    >
                                        <div className="p-3 bg-cocoa/5 rounded-full mb-3 group-hover:bg-gold/10 transition-colors">
                                            <Upload className="w-6 h-6 text-cocoa/60 group-hover:text-gold" />
                                        </div>
                                        <span className="text-cocoa/70 font-medium text-sm group-hover:text-cocoa">Upload Image</span>
                                    </label>
                                </div>

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
                                        className="w-full h-full cursor-pointer group relative overflow-hidden bg-white border border-dashed border-cocoa/20 rounded-xl p-8 flex flex-col items-center justify-center hover:border-gold hover:bg-gold/5 transition-all"
                                    >
                                        <div className="p-3 bg-cocoa/5 rounded-full mb-3 group-hover:bg-gold/10 transition-colors">
                                            <Camera className="w-6 h-6 text-cocoa/60 group-hover:text-gold" />
                                        </div>
                                        <span className="text-cocoa/70 font-medium text-sm group-hover:text-cocoa">Take Photo</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Camera Error */}
                        {cameraError && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 text-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                {cameraError}
                            </div>
                        )}

                        {/* Camera View */}
                        {showCamera && (
                            <div className="space-y-4 bg-black rounded-2xl overflow-hidden shadow-lg">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />

                                <div className="flex gap-4 p-4 bg-black/90 backdrop-blur justify-center">
                                    <button
                                        type="button"
                                        onClick={() => { setShowCamera(false); stopCamera(); }}
                                        className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={capturePhoto}
                                        className="px-6 py-2.5 bg-white text-black rounded-full transition-transform active:scale-95 font-medium flex items-center gap-2"
                                    >
                                        <Camera className="w-4 h-4" /> Capture fa
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Image Preview */}
                        {imagePreview && !showCamera && (
                            <div className="relative mt-3 group w-full sm:w-1/2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-2xl border border-cocoa/10 shadow-sm"
                                />

                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <ImageIcon className="w-3 h-3" /> Image Selected
                                </div>
                            </div>
                        )}

                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-cocoa/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-cocoa/60 hover:text-cocoa font-medium transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-cocoa text-gold hover:bg-cocoa-light rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cocoa/20 flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Saving...' : productToEdit ? 'Save Changes' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
