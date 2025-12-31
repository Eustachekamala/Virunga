import { useState, useEffect } from 'react';
import { filterMovements, getMovements } from '../services/stockMovements';
import { generateMovementHistoryReport } from '../services/pdfGenerator';
import { getProducts } from '../services/api';
import { showSuccess } from '../components/ui/Toast';
import { format } from 'date-fns';
import type { StockMovement, MovementFilter } from '../types/movements';
import type { Product } from '../types';
import { ArrowDownCircle, ArrowUpCircle, FileDown, Filter, Search, Calendar, Package, RefreshCw, ChevronDown } from 'lucide-react';

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

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts();
        fetchMovements();
    }, []);


    const handleFilter = () => {
        fetchMovements();
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, value]) => value)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');

        generateMovementHistoryReport(movements, filterDescription || 'All movements');
        showSuccess('Movement history report downloaded');
    };

    const hasActiveFilters = Object.values(filters).some(v => v);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-cocoa tracking-tight">Movement History</h2>
                    <p className="text-cocoa/60 font-medium text-sm mt-1">
                        Track every stock change over time
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all border ${hasActiveFilters
                            ? 'bg-gold/10 text-cocoa border-gold shadow-sm'
                            : 'bg-white text-cocoa border-cocoa/10 hover:bg-cocoa/5 shadow-sm'
                            }`}
                    >
                        <Filter className="w-5 h-5" />
                        <span className="hidden sm:inline">Filters</span>
                        {hasActiveFilters && <span className="bg-cocoa text-white text-xs px-2 py-0.5 rounded-full ml-1">{Object.values(filters).filter(v => v).length}</span>}
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={movements.length === 0}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-cocoa text-gold hover:bg-cocoa/90 rounded-xl font-bold transition-all shadow-lg shadow-cocoa/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <FileDown className="w-5 h-5" />
                        <span className="hidden sm:inline">Export PDF</span>
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="glass-panel p-6 rounded-2xl border border-cocoa/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {/* Search */}
                        <div className="lg:col-span-3 space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                Search
                            </label>
                            <input
                                type="text"
                                value={filters.searchTerm || ''}
                                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                                placeholder="Search by product, reference, supplier, notes..."
                                className="w-full px-4 py-3 bg-white/80 border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-gold/50 outline-none transition-all placeholder:text-cocoa/40"
                            />
                        </div>

                        {/* Dates */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={filters.startDate || ''}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                className="w-full px-4 py-3 bg-white/80 border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-gold/50 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                End Date
                            </label>
                            <input
                                type="date"
                                value={filters.endDate || ''}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                className="w-full px-4 py-3 bg-white/80 border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-gold/50 outline-none transition-all"
                            />
                        </div>

                        {/* Product */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Product
                            </label>
                            <div className="relative">
                                <select
                                    value={filters.productId || ''}
                                    onChange={(e) => setFilters({ ...filters, productId: e.target.value ? parseInt(e.target.value) : undefined })}
                                    className="w-full px-4 py-3 bg-white/80 border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-gold/50 outline-none transition-all appearance-none"
                                >
                                    <option value="">All Products</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cocoa/40 pointer-events-none" />
                            </div>
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Movement Type
                            </label>
                            <div className="relative">
                                <select
                                    value={filters.type || ''}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                                    className="w-full px-4 py-3 bg-white/80 border border-cocoa/10 rounded-xl text-cocoa focus:ring-2 focus:ring-gold/50 outline-none transition-all appearance-none"
                                >
                                    <option value="">All Types</option>
                                    <option value="ENTREE">Entries (IN)</option>
                                    <option value="SORTIE">Exits (OUT)</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cocoa/40 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleFilter}
                            className="px-6 py-2.5 bg-cocoa text-white hover:bg-cocoa/90 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="px-6 py-2.5 bg-white border border-cocoa/10 text-cocoa hover:bg-cocoa/5 rounded-xl font-bold transition-all text-sm"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </div>

            {/* Movements List */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-cocoa/5 shadow-xl relative min-h-[400px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-cocoa/60 font-medium">Loading history...</p>
                        </div>
                    </div>
                ) : movements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                        <div className="w-20 h-20 bg-cocoa/5 rounded-full flex items-center justify-center mb-4">
                            <RefreshCw className="w-10 h-10 text-cocoa/20" />
                        </div>
                        <h3 className="text-xl font-bold text-cocoa mb-2">No movements found</h3>
                        <p className="text-cocoa/60 max-w-sm mx-auto mb-6">
                            Try adjusting your filters or record some stock movements to see them here.
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="px-6 py-2 bg-gold/10 text-cocoa font-bold rounded-lg border border-gold hover:bg-gold/20 transition-all"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Mobile Card Layout */}
                        <div className="md:hidden">
                            {movements.map((movement) => (
                                <div key={movement.id} className="p-5 border-b border-cocoa/5 last:border-0 hover:bg-cocoa/[0.02] transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="font-bold text-cocoa text-lg leading-tight mb-1">{movement.productName}</div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-cocoa/50">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(movement.date), 'MMM dd, yyyy • HH:mm')}
                                            </div>
                                        </div>
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${movement.type === 'ENTREE'
                                            ? 'bg-green-100/50 text-green-700 border-green-200'
                                            : 'bg-red-100/50 text-red-700 border-red-200'
                                            }`}>
                                            {movement.type === 'ENTREE' ? <ArrowDownCircle className="w-3.5 h-3.5" /> : <ArrowUpCircle className="w-3.5 h-3.5" />}
                                            {movement.type === 'ENTREE' ? 'IN' : 'OUT'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 bg-cocoa/[0.03] rounded-xl p-3 mb-3">
                                        <div>
                                            <span className="block text-[10px] uppercase tracking-wider font-bold text-cocoa/40 mb-0.5">Quantity</span>
                                            <span className="text-base font-bold text-cocoa">{movement.quantity} units</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] uppercase tracking-wider font-bold text-cocoa/40 mb-0.5">User / Ref</span>
                                            <span className="text-sm font-medium text-cocoa break-words line-clamp-1">{movement.supplier || movement.receiver || movement.user || '-'}</span>
                                        </div>
                                    </div>

                                    {(movement.reason || movement.purpose || movement.reference) && (
                                        <div className="flex items-start gap-2 text-xs text-cocoa/70 bg-white/50 p-2 rounded-lg border border-cocoa/5">
                                            <span className="font-bold min-w-fit">Note:</span>
                                            <span className="italic line-clamp-2">{movement.reason || movement.purpose || movement.reference}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table Layout */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-cocoa text-cream sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Qty</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">User / Supplier</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-cocoa/5">
                                    {movements.map((movement) => (
                                        <tr key={movement.id} className="hover:bg-cocoa/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-cocoa text-sm">{format(new Date(movement.date), 'MMM dd, yyyy')}</span>
                                                    <span className="text-xs text-cocoa/50 font-medium">{format(new Date(movement.date), 'HH:mm')}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${movement.type === 'ENTREE'
                                                    ? 'bg-green-100/50 text-green-700 border-green-200'
                                                    : 'bg-red-100/50 text-red-700 border-red-200'
                                                    }`}>
                                                    {movement.type === 'ENTREE' ? <ArrowDownCircle className="w-3.5 h-3.5" /> : <ArrowUpCircle className="w-3.5 h-3.5" />}
                                                    {movement.type === 'ENTREE' ? 'IN' : 'OUT'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-cocoa text-sm">{movement.productName}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-cocoa/80 bg-cocoa/5 px-2 py-1 rounded-md text-sm">{movement.quantity}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cocoa/70 font-medium">
                                                {movement.supplier || movement.receiver || movement.user || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-cocoa/60 max-w-xs truncate" title={movement.reason || movement.purpose || movement.reference || ''}>
                                                {movement.reason || movement.purpose || movement.reference || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default History;
