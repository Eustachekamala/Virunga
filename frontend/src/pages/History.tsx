import { useState, useEffect } from 'react';
import { filterMovements, getMovements } from '../services/stockMovements';
import { generateMovementHistoryReport } from '../services/pdfGenerator';
import { getProducts } from '../services/api';
import { showSuccess } from '../components/ui/Toast';
import { format } from 'date-fns';
import type { StockMovement, MovementFilter } from '../types/movements';
import type { Product } from '../types';

const History = () => {
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState<MovementFilter>({
        startDate: '',
        endDate: '',
        productId: undefined,
        type: undefined,
        user: '',
        searchTerm: '',
    });

    useEffect(() => {
        fetchProducts();
        fetchMovements();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Failed to load products', error);
        }
    };

    const fetchMovements = () => {
        setLoading(true);
        const allMovements = getMovements();
        const data = filterMovements(allMovements, filters);
        setMovements(data);
        setLoading(false);
    };

    const handleFilter = () => {
        fetchMovements();
        setShowFilters(false);
    };

    const handleClearFilters = () => {
        setFilters({
            startDate: '',
            endDate: '',
            productId: undefined,
            type: undefined,
            user: '',
            searchTerm: '',
        });
        setTimeout(() => {
            const data = getMovements();
            setMovements(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }, 100);
    };

    const handleExport = () => {
        const filterDescription = Object.entries(filters)
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');

        generateMovementHistoryReport(movements, filterDescription || 'All movements');
        showSuccess('Movement history report downloaded');
    };

    const hasActiveFilters = Object.values(filters).some(v => v);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-4xl font-serif font-bold text-cocoa">Movement History</h2>
                    <p className="text-cocoa/60 mt-2">
                        {movements.length} total movements {hasActiveFilters && '(filtered)'}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-5 py-2 rounded-lg font-medium transition-all border ${hasActiveFilters
                            ? 'bg-gold text-cocoa border-gold'
                            : 'bg-white text-cocoa border-cocoa/20 hover:bg-cocoa/5'
                            }`}
                    >
                        🔍 Filters {hasActiveFilters && `(${Object.values(filters).filter(v => v).length})`}
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={movements.length === 0}
                        className="px-5 py-2 bg-cocoa text-gold hover:bg-cocoa/90 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        <span>📄</span> Export PDF
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white rounded-xl shadow-sm border border-cocoa/5 p-6 mb-8">
                    <h3 className="text-lg font-bold text-cocoa mb-4">Filter Movements</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {/* Search */}
                        <div className="lg:col-span-3">
                            <label className="block text-sm font-medium text-cocoa mb-2">Search</label>
                            <input
                                type="text"
                                value={filters.searchTerm || ''}
                                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                                placeholder="Search by product, reference, supplier, notes..."
                                className="w-full px-4 py-2 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-gold/50 outline-none"
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-cocoa mb-2">Start Date</label>
                            <input
                                type="date"
                                value={filters.startDate || ''}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                className="w-full px-4 py-2 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-gold/50 outline-none"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-medium text-cocoa mb-2">End Date</label>
                            <input
                                type="date"
                                value={filters.endDate || ''}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                className="w-full px-4 py-2 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-gold/50 outline-none"
                            />
                        </div>

                        {/* Product */}
                        <div>
                            <label className="block text-sm font-medium text-cocoa mb-2">Product</label>
                            <select
                                value={filters.productId || ''}
                                onChange={(e) => setFilters({ ...filters, productId: e.target.value ? parseInt(e.target.value) : undefined })}
                                className="w-full px-4 py-2 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-gold/50 outline-none"
                            >
                                <option value="">All Products</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-cocoa mb-2">Movement Type</label>
                            <select
                                value={filters.type || ''}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                                className="w-full px-4 py-2 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-gold/50 outline-none"
                            >
                                <option value="">All Types</option>
                                <option value="ENTREE">Entries (IN)</option>
                                <option value="SORTIE">Exits (OUT)</option>
                            </select>
                        </div>

                        {/* User */}
                        <div>
                            <label className="block text-sm font-medium text-cocoa mb-2">User / Receiver</label>
                            <input
                                type="text"
                                value={filters.user || ''}
                                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                                placeholder="Filter by user name"
                                className="w-full px-4 py-2 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-gold/50 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleFilter}
                            className="px-6 py-2 bg-forest text-white hover:bg-forest/90 rounded-lg font-medium transition-all"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="px-6 py-2 bg-white border border-cocoa/20 text-cocoa hover:bg-cocoa/5 rounded-lg font-medium transition-all"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            {/* Movements List */}
            <div className="bg-white rounded-xl shadow-sm border border-cocoa/5">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : movements.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-cocoa/60 text-lg">No movements found</p>
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="mt-4 text-gold hover:text-gold/80 font-medium"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-cocoa text-cream">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Date & Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Product</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Quantity</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">User/Supplier</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cocoa/10">
                                {movements.map((movement) => (
                                    <tr key={movement.id} className="hover:bg-cocoa/5 transition-colors">
                                        <td className="px-6 py-4 text-sm text-cocoa">
                                            <div>
                                                <div className="font-medium">{format(new Date(movement.date), 'MMM dd, yyyy')}</div>
                                                <div className="text-cocoa/60">{format(new Date(movement.date), 'HH:mm')}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${movement.type === 'ENTREE'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {movement.type === 'ENTREE' ? '📥 IN' : '📤 OUT'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-cocoa">
                                            {movement.productName}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-cocoa">
                                            {movement.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-cocoa/70">
                                            {movement.supplier || movement.receiver || movement.user || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-cocoa/70">
                                            {movement.reason || movement.purpose || movement.reference || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;
