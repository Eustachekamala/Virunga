import { useState, useEffect } from 'react';
import { getProducts, updateProduct } from '../services/api';
import { addStockEntry } from '../services/stockMovements';
import { showSuccess, showError } from '../components/ui/Toast';
import type { Product } from '../types';
import {
    ArrowDownCircle,
    Package,
    Calendar,
    FileText,
    Building,
    User,
    StickyNote,
    CheckCircle,
    TrendingUp,
    Loader2,
} from 'lucide-react';

const StockIn = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        productId: 0,
        quantity: 0,
        date: new Date().toISOString().split('T')[0],
        reference: '',
        supplier: '',
        reason: '',
        notes: '',
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data || []);
        } catch (error) {
            showError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.productId || formData.quantity <= 0) {
            showError('Please select a product and enter a valid quantity');
            return;
        }

        setSubmitting(true);
        try {
            const product = products.find(p => p.id === formData.productId);
            if (!product) throw new Error('Product not found');

            await addStockEntry({
                productId: formData.productId,
                quantity: formData.quantity,
                date: new Date(formData.date).toISOString(),
                reference: formData.reference,
                supplier: formData.supplier,
                reason: formData.reason,
                notes: formData.notes,
            });

            await updateProduct(product.id, {
                name: product.name,
                quantity: product.quantity + formData.quantity,
                description: product.description || '',
                category: product.category,
                typeProduct: product.typeProduct,
            });

            showSuccess(`Successfully added ${formData.quantity} units of ${product.name}`);

            setFormData({
                productId: 0,
                quantity: 0,
                date: new Date().toISOString().split('T')[0],
                reference: '',
                supplier: '',
                reason: '',
                notes: '',
            });

            fetchProducts();
        } catch (error: any) {
            showError(error.message || 'Failed to record stock entry');
        } finally {
            setSubmitting(false);
        }
    };

    const selectedProduct = products.find(p => p.id === formData.productId);

    return (
        <div className="max-w-4xl mx-auto">

            {/* HEADER */}
            <div className="mb-8">
                <h2 className="text-4xl font-serif font-bold text-cocoa flex items-center gap-3">
                    <ArrowDownCircle className="w-10 h-10 text-green-600" />
                    Stock IN (Entrée)
                </h2>
                <p className="text-cocoa/60 mt-2">
                    Record new material and equipment arrivals
                </p>
            </div>

                <div className="bg-white rounded-2xl shadow-lg border border-cocoa/5 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Product Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                                <Package className="w-4 h-4 text-green-600" />
                                Product / Material <span className="text-red-600">*</span>
                            </label>

                            <select
                                required
                                disabled={loading}
                                value={formData.productId}
                                onChange={(e) => setFormData({ ...formData, productId: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-green-500/50 outline-none text-base transition-all"
                            >
                                <option value={0}>Select a product...</option>
                                {products.length === 0 && (
                                    <option disabled>No products found</option>
                                )}
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} (Stock: {product.quantity})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity + Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    Quantity <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.quantity || ''}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa text-base transition-all"
                                    placeholder="Enter quantity"
                                />

                                {selectedProduct && formData.quantity > 0 && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="font-medium">
                                            New total: {selectedProduct.quantity + formData.quantity} units
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-green-600" />
                                    Date <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa text-base transition-all"
                                />
                            </div>
                        </div>

                        {/* Reference + Supplier */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-green-600" />
                                    Reference / Invoice #
                                </label>
                                <input
                                    type="text"
                                    value={formData.reference}
                                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                    className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa text-base"
                                    placeholder="e.g., INV-2024-001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                                    <Building className="w-4 h-4 text-green-600" />
                                    Supplier
                                </label>
                                <input
                                    type="text"
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                    className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa text-base"
                                    placeholder="Supplier name"
                                />
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-green-600" />
                                Reason for Entry
                            </label>
                            <input
                                type="text"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa"
                                placeholder="e.g., New stock order, Return, Transfer"
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                                <StickyNote className="w-4 h-4 text-green-600" />
                                Additional Notes
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa resize-none"
                                placeholder="Any additional information..."
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-5 h-5" />
                                )}
                                {submitting ? 'Recording...' : 'Record Stock Entry'}
                            </button>

                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-8 py-4 bg-white border-2 border-cocoa/20 text-cocoa rounded-xl font-medium text-lg hover:bg-cocoa/5"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

            {/* Info Box */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-xl p-6 shadow-md">
                <div className="flex gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg h-fit">
                        <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 mb-2">Stock Entry Information</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• This form records new materials or equipment entering the warehouse</li>
                            <li>• The product quantity will be automatically updated</li>
                            <li>• All entries are logged and can be viewed in the History page</li>
                            <li>• Reference and supplier info help with tracking and auditing</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockIn;
