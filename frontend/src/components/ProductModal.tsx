import React, { useEffect, useState, useRef } from 'react';
import { Category, TypeProduct } from '../types';
import type { CreateProductDTO, Product } from '../types';
import { Camera, Upload, X } from 'lucide-react';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateProductDTO) => Promise<void>;
    productToEdit?: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, productToEdit }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateProductDTO>({
        name: '',
        quantity: 0,
        description: '',
        category: Category.ELECTRONICS,
        typeProduct: TypeProduct.NON_CONSUMABLE,
    });
    const [file, setFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                setFormData({
                    name: productToEdit.name,
                    quantity: productToEdit.quantity,
                    description: productToEdit.description,
                    category: productToEdit.category,
                    typeProduct: productToEdit.typeProduct,
                });
                if (productToEdit.imageFile) {
                    setImagePreview(`/uploads/${productToEdit.imageFile}`);
                }
            } else {
                setFormData({
                    name: '',
                    quantity: 0,
                    description: '',
                    category: Category.ELECTRONICS,
                    typeProduct: TypeProduct.NON_CONSUMABLE,
                });
            }
            setFile(null);
            setShowCamera(false);
        } else {
            // Cleanup camera stream when modal closes
            stopCamera();
        }
    }, [isOpen, productToEdit]);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const [cameraError, setCameraError] = useState<string | null>(null);



    const startCamera = async () => {
        setCameraError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setShowCamera(true);
        } catch (error: any) {
            console.error('Error accessing camera:', error);
            let errorMessage = 'Could not access camera.';

            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                errorMessage = 'Camera permission was denied. Please allow camera access in your browser settings and try again.';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'No camera device found.';
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'Camera is already in use by another application.';
            }

            setCameraError(errorMessage);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Check if video is actually playing and has dimensions
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const capturedFile = new File([blob], `product-${Date.now()}.jpg`, { type: 'image/jpeg' });
                        setFile(capturedFile);
                        setImagePreview(URL.createObjectURL(blob));
                        setShowCamera(false);
                        stopCamera();
                    }
                }, 'image/jpeg', 0.8);
            }
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ ...formData, imagFile: file || undefined });
            onClose();
        } catch (error) {
            console.error('Failed to save product', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    };

    const removeImage = () => {
        setFile(null);
        setImagePreview(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-gold/20">
                <div className="flex justify-between items-center mb-6 border-b border-cocoa/10 pb-4">
                    <h2 className="text-2xl font-serif font-bold text-cocoa">
                        {productToEdit ? 'Edit Product' : 'New Product'}
                    </h2>
                    <button onClick={onClose} className="text-cocoa/40 hover:text-cocoa transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-cocoa/80 mb-1 uppercase tracking-wider">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full bg-cream border border-cocoa/10 rounded-lg px-4 py-3 text-cocoa focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all placeholder:text-cocoa/20"
                            placeholder="e.g. Screwdriver Set"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-cocoa/80 mb-1 uppercase tracking-wider">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                required
                                min="0"
                                className="w-full bg-cream border border-cocoa/10 rounded-lg px-4 py-3 text-cocoa focus:ring-2 focus:ring-gold/50 outline-none"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-cocoa/80 mb-1 uppercase tracking-wider">Type</label>
                            <select
                                name="typeProduct"
                                className="w-full bg-cream border border-cocoa/10 rounded-lg px-4 py-3 text-cocoa focus:ring-2 focus:ring-gold/50 outline-none"
                                value={formData.typeProduct}
                                onChange={handleChange}
                            >
                                {Object.values(TypeProduct).map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-cocoa/80 mb-1 uppercase tracking-wider">Category</label>
                        <select
                            name="category"
                            className="w-full bg-cream border border-cocoa/10 rounded-lg px-4 py-3 text-cocoa focus:ring-2 focus:ring-gold/50 outline-none"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            {Object.values(Category).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-cocoa/80 mb-1 uppercase tracking-wider">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            className="w-full bg-cream border border-cocoa/10 rounded-lg px-4 py-3 text-cocoa focus:ring-2 focus:ring-gold/50 outline-none resize-none"
                            placeholder="Describe the product..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Image Upload/Capture Section */}
                    <div>
                        <label className="block text-sm font-semibold text-cocoa/80 mb-2 uppercase tracking-wider">Product Image</label>

                        {!imagePreview && !showCamera && (
                            <div className="grid grid-cols-2 gap-3">
                                {/* Upload File Button */}
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="flex flex-col items-center justify-center cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-dashed border-blue-300 rounded-lg p-6 hover:from-blue-100 hover:to-cyan-100 hover:border-blue-400 transition-all group"
                                    >
                                        <Upload className="w-8 h-8 text-blue-600 mb-2" />
                                        <span className="text-blue-700 text-sm font-medium text-center">
                                            Upload Image
                                        </span>
                                    </label>
                                </div>

                                {/* Capture Photo Button */}
                                <button
                                    type="button"
                                    onClick={startCamera}
                                    className="flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-dashed border-green-300 rounded-lg p-6 hover:from-green-100 hover:to-emerald-100 hover:border-green-400 transition-all"
                                >
                                    <Camera className="w-8 h-8 text-green-600 mb-2" />
                                    <span className="text-green-700 text-sm font-medium text-center">
                                        Take Photo
                                    </span>
                                </button>
                            </div>
                        )}

                        {cameraError && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200 text-sm mb-3">
                                {cameraError}
                            </div>
                        )}

                        {/* Camera View */}
                        {showCamera && (
                            <div className="space-y-3">
                                <div className="relative bg-black rounded-lg overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-64 object-cover"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={capturePhoto}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Camera className="w-5 h-5" />
                                        Capture Photo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCamera(false);
                                            stopCamera();
                                        }}
                                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Image Preview */}
                        {imagePreview && !showCamera && (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg border-2 border-cocoa/10"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <p className="text-xs text-cocoa/60 mt-2">
                                    {file ? file.name : 'Current image'}
                                </p>
                            </div>
                        )}

                        {/* Hidden canvas for photo capture */}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-cocoa/10">
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
                            className="px-8 py-3 bg-gradient-to-r from-cocoa to-cocoa/90 text-gold hover:from-cocoa/90 hover:to-cocoa rounded-lg font-bold tracking-wide shadow-lg transition-all disabled:opacity-50"
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
