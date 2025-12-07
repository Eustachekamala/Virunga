import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
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

const Inventory = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
            } else if (searchQuery) {
                data = await getProductByName(searchQuery);
            } else if (selectedType !== 'ALL') {
                data = await getProductsByType(selectedType);
            } else if (selectedCategory !== 'ALL') {
                data = await getProductsByCategory(selectedCategory);
            } else {
                data = await getProducts();
            }
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
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
    }, [searchQuery, selectedType, selectedCategory, viewMode]);


    const handleCreateOrUpdate = async (data: CreateProductDTO) => {
        if (editingProduct) {
            await updateProduct(editingProduct.id, data);
        } else {
            await createProduct(data);
        }
        fetchProducts();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
            fetchProducts();
        }
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h2 className="text-4xl font-serif font-bold text-cocoa">
                        {viewMode === 'LOW_STOCK' ? 'Low Stock Alerts' : 'Inventory'}
                    </h2>
                    <p className="text-cocoa/60 mt-2 font-light">
                        {products.length} Items found
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setViewMode(viewMode === 'ALL' ? 'LOW_STOCK' : 'ALL')}
                        className={`px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm border border-cocoa/10 cursor-pointer ${viewMode === 'LOW_STOCK'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-white text-cocoa hover:bg-cocoa/5'
                            }`}
                    >
                        {viewMode === 'LOW_STOCK' ? 'Show All' : '⚠ Low Stock'}
                    </button>

                    <button
                        onClick={openCreateModal}
                        className="px-6 py-2.5 bg-gold text-cocoa hover:bg-yellow-500 rounded-lg font-bold tracking-wide transition-all shadow-lg shadow-gold/20 flex items-center gap-2 cursor-pointer"
                    >
                        <span>+</span> New Product
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-cocoa/5 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-cocoa/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        className="w-full pl-10 pr-4 py-2 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-gold/50 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={viewMode === 'LOW_STOCK'}
                    />
                </div>

                <div className="w-full md:w-48">
                    <select
                        className="w-full px-4 py-2 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-gold/50 outline-none cursor-pointer"
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
                </div>

                <div className="w-full md:w-48">
                    <select
                        className="w-full px-4 py-2 bg-cream border border-cocoa/10 rounded-lg text-cocoa focus:ring-2 focus:ring-gold/50 outline-none cursor-pointer"
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
                </div>
            </div>

            {/* Grid Section */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-cocoa/60 font-serif italic">Curating chocolates...</p>
                </div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-cocoa/10 rounded-xl bg-cocoa/5">
                            <p className="text-xl font-serif text-cocoa/60 italic">No products found regarding your criteria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
        </div>
    );
};

export default Inventory;
