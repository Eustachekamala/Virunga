import { useState, useEffect } from 'react';
import { getProducts, updateProduct } from '../services/api';
import { addStockExit } from '../services/stockMovements';
import { showSuccess, showError, showWarning } from '../components/ui/Toast';
import type { Product } from '../types';
import { ArrowUpCircle, Package, Calendar, User, Building, FileText, StickyNote, Send, AlertTriangle, TrendingDown, Info, Loader2 } from 'lucide-react';

const StockOut = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        productId: 0,
        quantity: 0,
        date: new Date().toISOString().split('T')[0],
        receiver: '',
        user: '',
        purpose: '',
        notes: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            showError('Failed to load products');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.productId || formData.quantity <= 0) {
            showError('Please select a product and enter a valid quantity');
            return;
        }

        const product = products.find(p => p.id === formData.productId);
        if (!product) {
            showError('Product not found');
            return;
        }

        // Check stock availability
        if (product.quantity < formData.quantity) {
            showError(`Insufficient stock! Available: ${product.quantity}, Requested: ${formData.quantity}`);
            return;
        }

        // Warning for low stock after exit
        const remainingStock = product.quantity - formData.quantity;
        const threshold = product.stockAlertThreshold || 10;
        if (remainingStock <= threshold) {
            showWarning(`Warning: Stock will be low after this exit (${remainingStock} units remaining). An alert email will be sent.`);
        }

        setSubmitting(true);
        try {
            // Add stock exit movement
            // First update product quantity in backend
            await updateProduct(product.id, {
                name: product.name,
                quantity: product.quantity - formData.quantity,
                description: product.description || '',
                category: product.category,
                typeProduct: product.typeProduct,
                imageFile: undefined // Ensure we don't send file if not updating it
            });

            // Create date at noon to avoid timezone shifting the day when converting to ISO
            const dateObj = new Date(formData.date);
            dateObj.setHours(12, 0, 0, 0);

            // If backend update succeeds, record the exit locally
            await addStockExit({
                productId: formData.productId,
                quantity: formData.quantity,
                date: dateObj.toISOString(),
                receiver: formData.receiver,
                user: formData.user,
                purpose: formData.purpose,
                notes: formData.notes,
            });

            showSuccess(`Successfully registered exit of ${formData.quantity} units of ${product.name}`);

            // Reset form
            setFormData({
                productId: 0,
                quantity: 0,
                date: new Date().toISOString().split('T')[0],
                receiver: '',
                user: '',
                purpose: '',
                notes: ''
            });

            // Refresh products
            fetchProducts();
        } catch (error: any) {
            showError(error.message || 'Failed to record stock exit');
        } finally {
            setSubmitting(false);
        }
    };

    const selectedProduct = products.find(p => p.id === formData.productId);
    const isInsufficientStock = selectedProduct && formData.quantity > selectedProduct.quantity;
    const willBeLowStock = selectedProduct && formData.quantity > 0 &&
        (selectedProduct.quantity - formData.quantity) <= (selectedProduct.stockAlertThreshold || 10);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* HEADER */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-2xl">
                    <ArrowUpCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-cocoa tracking-tight">
                        Stock Out
                    </h2>
                    <p className="text-cocoa/60 font-medium text-sm">
                        Record material usage (Sortie)
                    </p>
                </div>
            </div>

            <div className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    {/* Product Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                            <Package className="w-4 h-4 text-red-600" />
                            Product <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                required
                                value={formData.productId}
                                onChange={(e) => setFormData({ ...formData, productId: parseInt(e.target.value) })}
                                className="w-full pl-4 pr-10 py-4 bg-white/50 hover:bg-white/80 focus:bg-white border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-green-500/50 outline-none text-base transition-all appearance-none shadow-sm font-medium"
                            >
                                <option value={0}>Select a product to remove...</option>
                                {products.length === 0 && (
                                    <option disabled>No products found</option>
                                )}
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} (Available: {product.quantity})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-t-[5px] border-t-cocoa/30 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quantity */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-red-600" />
                                Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max={selectedProduct?.quantity || 999999}
                                value={formData.quantity || ''}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                className={`w-full px-4 py-4 bg-white border rounded-xl text-cocoa focus:ring-2 focus:ring-red-500/50 outline-none text-base transition-all shadow-sm ${isInsufficientStock ? 'border-red-500 bg-red-50' : 'border-cocoa/10'
                                    }`}
                                placeholder="0"
                            />
                            {selectedProduct && formData.quantity > 0 && (
                                <div className="mt-2 text-xs">
                                    {isInsufficientStock ? (
                                        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg font-bold border border-red-200">
                                            <AlertTriangle className="w-4 h-4" />
                                            Insufficient stock! Available: {selectedProduct.quantity}
                                        </div>
                                    ) : (
                                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-medium ${willBeLowStock
                                            ? 'text-orange-700 bg-orange-50 border-orange-200'
                                            : 'text-green-700 bg-green-50 border-green-200'
                                            }`}>
                                            {willBeLowStock ? <AlertTriangle className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            <span>
                                                Remaining: <span className="font-bold">{selectedProduct.quantity - formData.quantity}</span> units
                                                {willBeLowStock && ' (Low Stock Warning)'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-red-600" />
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-4 bg-white border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-red-500/50 outline-none text-base transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Receiver */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <User className="w-4 h-4 text-red-600" />
                                Receiver Name
                            </label>
                            <input
                                type="text"
                                value={formData.receiver}
                                onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                                className="w-full px-4 py-4 bg-white border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-red-500/50 outline-none text-base transition-all shadow-sm placeholder:text-cocoa/30"
                                placeholder="Who is taking this?"
                            />
                        </div>

                        {/* User/Department */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <Building className="w-4 h-4 text-red-600" />
                                Department
                            </label>
                            <input
                                type="text"
                                value={formData.user}
                                onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                                className="w-full px-4 py-4 bg-white border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-red-500/50 outline-none text-base transition-all shadow-sm placeholder:text-cocoa/30"
                                placeholder="e.g. Production"
                            />
                        </div>
                    </div>

                    {/* Purpose */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                            <FileText className="w-4 h-4 text-red-600" />
                            Purpose
                        </label>
                        <input
                            type="text"
                            value={formData.purpose}
                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                            className="w-full px-4 py-4 bg-white border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-red-500/50 outline-none text-base transition-all shadow-sm placeholder:text-cocoa/30"
                            placeholder="e.g. Machine repair"
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                            <StickyNote className="w-4 h-4 text-red-600" />
                            Additional Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-4 bg-white border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-red-500/50 outline-none text-base resize-none transition-all shadow-sm placeholder:text-cocoa/30"
                            placeholder="Any additional information..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-cocoa/5">
                        <button
                            type="submit"
                            disabled={submitting || !formData.productId || formData.quantity <= 0 || !!isInsufficientStock}
                            className="w-full md:flex-1 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                        >
                            {submitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            {submitting ? 'Recording...' : 'Confirm Exit'}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="w-full md:w-auto px-8 py-4 bg-white border border-cocoa/10 text-cocoa hover:bg-cocoa/5 rounded-xl font-bold text-lg transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {/* Info Box */}
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 flex flex-col md:flex-row gap-4">
                <div className="bg-red-100 p-3 rounded-xl h-fit w-fit">
                    <Info className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <h4 className="font-bold text-red-900 mb-2">About Stock Exits</h4>
                    <ul className="text-sm text-red-800/80 space-y-1 list-disc list-inside">
                        <li>This action reduces quantities from your inventory.</li>
                        <li>You cannot exit more than the available stock.</li>
                        <li>Low stock warnings will appear if threshold is reached.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StockOut;
