import { useState, useEffect } from 'react';
import { getProducts, updateProduct } from '../services/api';
import { addStockExit } from '../services/stockMovements';
import { showSuccess, showError, showWarning } from '../components/ui/Toast';
import type { Product } from '../types';
import { ArrowUpCircle, Package, Calendar, User, Building, FileText, StickyNote, Send, AlertTriangle, TrendingDown } from 'lucide-react';

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
            showWarning(`Warning: Stock will be low after this exit (${remainingStock} units remaining)`);
        }

        setSubmitting(true);
        try {
            // Add stock exit movement
            await addStockExit({
                productId: formData.productId,
                quantity: formData.quantity,
                date: new Date(formData.date).toISOString(),
                receiver: formData.receiver,
                user: formData.user,
                purpose: formData.purpose,
                notes: formData.notes,
            });

            // Update product quantity
            await updateProduct(product.id, {
                name: product.name,
                quantity: product.quantity - formData.quantity,
                description: product.description || '',
                category: product.category,
                typeProduct: product.typeProduct,
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
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-4xl font-serif font-bold text-cocoa flex items-center gap-3">
                    <ArrowUpCircle className="w-10 h-10 text-orange-600" />
                    Stock OUT (Sortie)
                </h2>
                <p className="text-cocoa/60 mt-2">Register equipment and materials taken from warehouse</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-cocoa/5 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Product Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                            <Package className="w-4 h-4 text-orange-600" />
                            Product / Material <span className="text-red-600">*</span>
                        </label>
                        <select
                            required
                            value={formData.productId}
                            onChange={(e) => setFormData({ ...formData, productId: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none text-base transition-all"
                        >
                            <option value={0}>Select a product...</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} (Available: {product.quantity})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-orange-600" />
                                Quantity <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max={selectedProduct?.quantity || 999999}
                                value={formData.quantity || ''}
                                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                className={`w-full px-4 py-3 bg-cream border rounded-lg text-cocoa focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none text-base transition-all ${isInsufficientStock ? 'border-red-500 bg-red-50' : 'border-cocoa/10'
                                    }`}
                                placeholder="Enter quantity"
                            />
                            {selectedProduct && formData.quantity > 0 && (
                                <div className="mt-2">
                                    {isInsufficientStock ? (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg font-medium">
                                            <AlertTriangle className="w-4 h-4" />
                                            Insufficient stock! Available: {selectedProduct.quantity}
                                        </div>
                                    ) : (
                                        <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${willBeLowStock
                                                ? 'text-orange-600 bg-orange-50'
                                                : 'text-green-600 bg-green-50'
                                            }`}>
                                            {willBeLowStock ? <AlertTriangle className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                            <span className="font-medium">
                                                Remaining: {selectedProduct.quantity - formData.quantity} units
                                                {willBeLowStock && ' ⚠️ Low stock warning'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-600" />
                                Date <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none text-base transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Receiver */}
                        <div>
                            <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-orange-600" />
                                Receiver / Worker Name
                            </label>
                            <input
                                type="text"
                                value={formData.receiver}
                                onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                                className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none text-base transition-all"
                                placeholder="Who is taking this?"
                            />
                        </div>

                        {/* User/Department */}
                        <div>
                            <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                                <Building className="w-4 h-4 text-orange-600" />
                                Department / Team
                            </label>
                            <input
                                type="text"
                                value={formData.user}
                                onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                                className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none text-base transition-all"
                                placeholder="e.g., Production, Maintenance"
                            />
                        </div>
                    </div>

                    {/* Purpose */}
                    <div>
                        <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-orange-600" />
                            Purpose / Usage
                        </label>
                        <input
                            type="text"
                            value={formData.purpose}
                            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                            className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none text-base transition-all"
                            placeholder="e.g., Machine repair, Daily operations, Installation"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-cocoa mb-2 flex items-center gap-2">
                            <StickyNote className="w-4 h-4 text-orange-600" />
                            Additional Notes
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none text-base resize-none transition-all"
                            placeholder="Any additional information..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={submitting || !formData.productId || formData.quantity <= 0 || isInsufficientStock}
                            className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            {submitting ? 'Recording...' : 'Register Stock Exit'}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-8 py-4 bg-white border-2 border-cocoa/20 text-cocoa hover:bg-cocoa/5 rounded-xl font-medium text-lg transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 rounded-xl p-6 shadow-md">
                <div className="flex gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg h-fit">
                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-orange-900 mb-2">Stock Exit Information</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                            <li>• This form records materials or equipment leaving the warehouse</li>
                            <li>• The product quantity will be automatically decreased</li>
                            <li>• You cannot exit more than the available stock</li>
                            <li>• Low stock warnings will appear if threshold is reached</li>
                            <li>• All exits are logged for tracking and accountability</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockOut;
