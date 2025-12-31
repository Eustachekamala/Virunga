import { useEffect, useState, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { showSuccess } from '../components/ui/Toast';
import {
    createProduct,
    deleteProduct,
    getProducts,
    getProductByName,
    getProductsByType,
    getProductsByCategory,
    getLowStockProducts,
    updateProduct
} from '../services/api';
import { TypeProduct, Category } from '../types';
import type { CreateProductDTO, Product } from '../types';
import { generateLowStockInventoryReport, generateInventoryReport, } from '../services/pdfGenerator';
import {
    Plus,
    FileDown,
    Search,
    Filter,
    PackageOpen
} from 'lucide-react';

const Inventory = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<{ id: number, name: string } | null>(null);

    // Filters state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<TypeProduct | 'ALL'>('ALL');
    const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
    const [viewMode, setViewMode] = useState<'ALL' | 'LOW_STOCK'>('ALL');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let data: Product[] = [];

            if (viewMode === 'LOW_STOCK') {
                data = await getLowStockProducts();
            } else if (searchQuery.trim()) {
                data = await getProductByName(searchQuery.trim());
            } else if (selectedType !== 'ALL') {
                data = await getProductsByType(selectedType);
            } else if (selectedCategory !== 'ALL') {
                data = await getProductsByCategory(selectedCategory);
            } else {
                data = await getProducts();
            }

            setProducts(data ?? []);
        } catch (error) {
            console.error('Failed to fetch products', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };


    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500); // Debounce 500ms
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, selectedType, selectedCategory, viewMode]);


    const handleCreateOrUpdate = async (data: CreateProductDTO) => {
        if (editingProduct) {
            await updateProduct(editingProduct.id, data);
        } else {
            await createProduct(data);
        }
        fetchProducts();
    };

    const handleDelete = useCallback((id: number) => {
        const product = products.find(p => p.id === id);
        if (product) {
            setProductToDelete({ id: product.id, name: product.name });
            setDeleteModalOpen(true);
        }
    }, [products]);

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        await deleteProduct(productToDelete.id);
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
        setDeleteModalOpen(false);
        setProductToDelete(null);
    };

    const openCreateModal = useCallback(() => {
        setEditingProduct(null);
        setIsModalOpen(true);
    }, []);

    const openEditModal = useCallback((product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    }, []);

    const handleExportPDF = () => {
        if (viewMode === 'LOW_STOCK') {
            generateLowStockInventoryReport(products);
            showSuccess("Inventory Report Exported downloaded")
        } else {
            // Use category-grouped PDF for all products view
            generateInventoryReport(products);
            showSuccess("Inventory Report Exported downloaded")
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-cocoa tracking-tight">
                            {viewMode === 'LOW_STOCK' ? 'Low Stock Alerts' : 'Inventory'}
                        </h2>
                    </div>
                    <p className="text-cocoa/60 font-medium text-sm">
                        Managing <span className="text-cocoa font-bold">{products.length}</span> {products.length === 1 ? 'item' : 'items'} in current view
                    </p>
                </div>

                <div className="flex gap-3 flex-wrap w-full md:w-auto">
                    <button
                        onClick={() => setViewMode(viewMode === 'ALL' ? 'LOW_STOCK' : 'ALL')}
                        className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 border ${viewMode === 'LOW_STOCK'
                            ? 'bg-red-600 text-white border-red-500 hover:bg-red-700'
                            : 'bg-white text-cocoa border-white/40 hover:bg-cocoa/5'
                            }`}
                    >
                        {viewMode === 'LOW_STOCK' ? 'Show All Items' : 'Show Low Stock'}
                    </button>

                    {products.length > 0 && (
                        <button
                            onClick={handleExportPDF}
                            disabled={products.length === 0}
                             className="w-full sm:w-auto px-6 py-3 bg-cocoa text-gold hover:bg-cocoa/90 rounded-xl font-bold transition-all shadow-lg shadow-cocoa/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                        >
                            <FileDown className="w-4 h-4" /> Export
                        </button>
                    )}

                    <button
                        onClick={openCreateModal}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-gold to-[#E5C158] text-cocoa/90 hover:from-[#E5C158] hover:to-gold rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> New Product
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="glass-panel p-2 rounded-2xl flex flex-col lg:flex-row gap-2 sticky top-[4.5rem] md:top-4 z-20">
                <div className="relative flex-1 group">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/40 group-focus-within:text-gold transition-colors" />
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        className="w-full pl-12 pr-4 py-3 bg-white/50 hover:bg-white/80 focus:bg-white border-0 rounded-xl text-cocoa placeholder:text-cocoa/40 focus:ring-2 focus:ring-gold/50 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={viewMode === 'LOW_STOCK'}
                    />
                </div>

                <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                    <div className="relative min-w-[160px] lg:w-48">
                        <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/40 pointer-events-none" />
                        <select
                            className="w-full pl-11 pr-8 py-3 bg-white/50 hover:bg-white/80 focus:bg-white border-0 rounded-xl text-cocoa focus:ring-2 focus:ring-gold/50 outline-none appearance-none cursor-pointer text-sm font-medium transition-all"
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(e.target.value as TypeProduct | 'ALL');
                                if (e.target.value !== 'ALL') setSelectedCategory('ALL');
                            }}
                            disabled={viewMode === 'LOW_STOCK' || searchQuery !== '' || selectedCategory !== 'ALL'}
                        >
                            <option value="ALL">All Types</option>
                            {Object.values(TypeProduct).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-t-[5px] border-t-cocoa/30 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent"></div>
                    </div>

                    <div className="relative min-w-[160px] lg:w-48">
                        <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-cocoa/40 pointer-events-none" />
                        <select
                            className="w-full pl-11 pr-8 py-3 bg-white/50 hover:bg-white/80 focus:bg-white border-0 rounded-xl text-cocoa focus:ring-2 focus:ring-gold/50 outline-none appearance-none cursor-pointer text-sm font-medium transition-all"
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value as Category | 'ALL');
                                if (e.target.value !== 'ALL') setSelectedType('ALL');
                            }}
                            disabled={viewMode === 'LOW_STOCK' || searchQuery !== '' || selectedType !== 'ALL'}
                        >
                            <option value="ALL">All Categories</option>
                            {Object.values(Category).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-t-[5px] border-t-cocoa/30 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent"></div>
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-70">
                    <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p className="text-cocoa font-medium text-lg animate-pulse">Fetching inventory...</p>
                </div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 glass-panel rounded-3xl border-dashed border-2 border-cocoa/10">
                            <div className="bg-cocoa/5 p-6 rounded-full mb-4">
                                <PackageOpen className="w-12 h-12 text-cocoa/30" />
                            </div>
                            <h3 className="text-xl font-bold text-cocoa mb-2">No products found</h3>
                            <p className="text-cocoa/50 text-center max-w-sm">
                                We couldn't find any items matching your current filters or search criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('ALL');
                                    setSelectedType('ALL');
                                    setViewMode('ALL');
                                }}
                                className="mt-6 text-gold font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onDelete={handleDelete}
                                    onEdit={openEditModal}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateOrUpdate}
                productToEdit={editingProduct}
            />

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={productToDelete?.name}
            />
        </div>
    );
};

export default Inventory;