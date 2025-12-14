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
    Info
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

            await updateProduct(product.id, {
                name: product.name,
                quantity: product.quantity + formData.quantity,
                description: product.description || '',
                category: product.category,
                typeProduct: product.typeProduct,
                imageFile: undefined // Ensure we don't send file if not updating it
            });

            // Create date at noon to avoid timezone shifting the day when converting to ISO
            const dateObj = new Date(formData.date);
            dateObj.setHours(12, 0, 0, 0);

            await addStockEntry({
                productId: formData.productId,
                quantity: formData.quantity,
                date: dateObj.toISOString(),
                reference: formData.reference,
                supplier: formData.supplier,
                reason: formData.reason,
                notes: formData.notes,
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
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">

            {/* HEADER */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-2xl">
                    <ArrowDownCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-cocoa tracking-tight">
                        Stock In
                    </h2>
                    <p className="text-cocoa/60 font-medium text-sm">
                        Record material arrivals (Entrée)
                    </p>
                </div>
            </div>

            <div className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                    {/* Product Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                            <Package className="w-4 h-4 text-green-600" />
                            Product <span className="text-red-500">*</span>
                        </label>

                        <div className="relative">
                            <select
                                required
                                disabled={loading}
                                value={formData.productId}
                                onChange={(e) => setFormData({ ...formData, productId: parseInt(e.target.value) })}
                                className="w-full pl-4 pr-10 py-4 bg-white border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-green-500/50 outline-none text-base transition-all appearance-none shadow-sm font-medium"
                            >
                                <option value={0}>Select a product to add stock...</option>
                                {products.length === 0 && (
                                    <option disabled>No products found</option>
                                )}
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} (Current Stock: {product.quantity})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-t-[5px] border-t-cocoa/30 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent"></div>
                        </div>
                    </div>

                    {/* Quantity + Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quantity */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.quantity || ''}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-4 bg-white border border-cocoa/10 rounded-xl text-cocoa text-base transition-all focus:ring-2 focus:ring-green-500/50 outline-none shadow-sm"
                                placeholder="0"
                            />

                            {selectedProduct && formData.quantity > 0 && (
                                <div className="mt-2 flex items-center gap-2 text-xs font-medium text-green-700 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>
                                        New Total: <span className="font-bold">{selectedProduct.quantity + formData.quantity}</span> units
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-green-600" />
                                Entry Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-4 bg-white border border-cocoa/10 rounded-xl text-cocoa text-base transition-all focus:ring-2 focus:ring-green-500/50 outline-none shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Reference + Supplier */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <FileText className="w-4 h-4 text-green-600" />
                                Reference / Invoice #
                            </label>
                            <input
                                type="text"
                                value={formData.reference}
                                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                className="w-full px-4 py-4 bg-white border border-cocoa/10 rounded-xl text-cocoa text-base transition-all focus:ring-2 focus:ring-green-500/50 outline-none shadow-sm placeholder:text-cocoa/30"
                                placeholder="e.g. INV-2024-001"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <Building className="w-4 h-4 text-green-600" />
                                Supplier Name
                            </label>
                            <input
                                type="text"
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                className="w-full px-4 py-4 bg-white border border-cocoa/10 rounded-xl text-cocoa text-base transition-all focus:ring-2 focus:ring-green-500/50 outline-none shadow-sm placeholder:text-cocoa/30"
                                placeholder="e.g. Cocoa Direct Ltd."
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                            <User className="w-4 h-4 text-green-600" />
                            Reason
                        </label>
                        <input
                            type="text"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            className="w-full px-4 py-4 bg-white border border-cocoa/10 rounded-xl text-cocoa transition-all focus:ring-2 focus:ring-green-500/50 outline-none shadow-sm placeholder:text-cocoa/30"
                            placeholder="e.g. Weekly Restock"
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                            <StickyNote className="w-4 h-4 text-green-600" />
                            Additional Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-4 bg-white border border-cocoa/10 rounded-xl text-cocoa resize-none transition-all focus:ring-2 focus:ring-green-500/50 outline-none shadow-sm placeholder:text-cocoa/30"
                            placeholder="Any checks or comments..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-cocoa/5">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full md:flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            {submitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <CheckCircle className="w-5 h-5" />
                            )}
                            {submitting ? 'Recording...' : 'Confirm Entry'}
                        </button>

                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="w-full md:w-auto px-8 py-4 bg-white text-cocoa border border-cocoa/10 rounded-xl font-bold text-lg hover:bg-cocoa/5 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row gap-4">
                <div className="bg-blue-100 p-3 rounded-xl h-fit w-fit">
                    <Info className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-900 mb-2">About Stock Entries</h4>
                    <ul className="text-sm text-blue-800/80 space-y-1 list-disc list-inside">
                        <li>This action adds quantities to your existing inventory.</li>
                        <li>Stock entries are permanent and logged in the history.</li>
                        <li>Ensure the reference matches your physical invoice for easier auditing.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StockIn;
