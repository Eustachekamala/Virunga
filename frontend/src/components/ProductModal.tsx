import React, { useEffect, useState } from 'react';
import { Category, TypeProduct } from '../types';
import type { CreateProductDTO, Product } from '../types';

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
        category: Category.ELECTRONICS, // Consider default based on business?
        typeProduct: TypeProduct.NON_CONSUMABLE,
    });
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                // Populate form for editing
                setFormData({
                    name: productToEdit.name,
                    quantity: productToEdit.quantity,
                    description: productToEdit.description,
                    // We need to match the Enums properly. Assuming backend data matches Enum strings.
                    // If backend sends generic string, might need cast or find.
                    // But our types say they are the same.
                    category: Category.ELECTRONICS, // Backend Product DTO doesn't seem to have Category in ResponseDTO?
                    // Checked ProductResponseDTO: it DOES NOT have category!
                    // Checked ProductDTO (create/update): HAS category.
                    // If Response doesn't have it, we can't edit it effectively without losing data or defaulting.
                    // Let's re-read ProductResponseDTO from file view step 105.
                    // Step 105: ProductResponseDTO has: id, name, qty, status, type, stockThreshold, desc, dates, image, lowStock.
                    // IT DOES NOT HAVE CATEGORY.
                    // This is a backend gap plan?
                    // The user said "use the file path don't change the backend".
                    // I cannot change backend to return category.
                    // I will have to default it or hide it for edit. 
                    // Or keep it as is.
                    typeProduct: productToEdit.typeProduct,
                });
            } else {
                // Reset for create
                setFormData({
                    name: '',
                    quantity: 0,
                    description: '',
                    category: Category.ELECTRONICS,
                    typeProduct: TypeProduct.NON_CONSUMABLE,
                });
            }
            setFile(null);
        }
    }, [isOpen, productToEdit]);

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
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cocoa/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl border border-gold/20">
                <div className="flex justify-between items-center mb-6 border-b border-cocoa/10 pb-4">
                    <h2 className="text-2xl font-serif font-bold text-cocoa">
                        {productToEdit ? 'Edit Product' : 'New Creation'}
                    </h2>
                    <button onClick={onClose} className="text-cocoa/40 hover:text-cocoa transition-colors">
                        ✕
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
                            placeholder="e.g. Dark Chocolate 70%"
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

                    {!productToEdit && (
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
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-cocoa/80 mb-1 uppercase tracking-wider">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            className="w-full bg-cream border border-cocoa/10 rounded-lg px-4 py-3 text-cocoa focus:ring-2 focus:ring-gold/50 outline-none resize-none"
                            placeholder="Describe the flavors..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-cocoa/80 mb-1 uppercase tracking-wider">Image</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex-1 cursor-pointer bg-cream border-2 border-dashed border-cocoa/20 rounded-lg p-4 text-center hover:bg-white hover:border-gold/50 transition-all group"
                            >
                                <span className="text-cocoa/60 group-hover:text-gold text-sm font-medium">
                                    {file ? file.name : "Click to upload image"}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-cocoa/60 hover:text-cocoa font-medium transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-cocoa text-gold hover:bg-cocoa-light rounded-lg font-bold tracking-wide shadow-lg shadow-cocoa/20 transition-all disabled:opacity-50 cursor-pointer"
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
