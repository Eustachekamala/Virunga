import { create } from 'zustand';
import { Product, CreateProductDTO, TypeProduct } from '../types';
import * as productsAPI from '../api/products';

interface ProductState {
    // State
    products: Product[];
    lowStockProducts: Product[];
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;

    // Actions
    fetchProducts: () => Promise<void>;
    fetchLowStockProducts: () => Promise<void>;
    fetchProductById: (id: number) => Promise<void>;
    fetchProductsByType: (type: TypeProduct) => Promise<void>;
    searchProducts: (name: string) => Promise<void>;
    addProduct: (data: CreateProductDTO) => Promise<void>;
    updateProduct: (id: number, data: CreateProductDTO) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    setSelectedProduct: (product: Product | null) => void;
    clearError: () => void;
    reset: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    // Initial state
    products: [],
    lowStockProducts: [],
    selectedProduct: null,
    loading: false,
    error: null,

    // Fetch all products
    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const products = await productsAPI.getProducts();
            set({ products, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch products', loading: false });
        }
    },

    // Fetch low stock products
    fetchLowStockProducts: async () => {
        set({ loading: true, error: null });
        try {
            const lowStockProducts = await productsAPI.getLowStockProducts();
            set({ lowStockProducts, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch low stock products', loading: false });
        }
    },

    // Fetch single product by ID
    fetchProductById: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const product = await productsAPI.getProductById(id);
            set({ selectedProduct: product, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch product', loading: false });
        }
    },

    // Fetch products by type
    fetchProductsByType: async (type: TypeProduct) => {
        set({ loading: true, error: null });
        try {
            const products = await productsAPI.getProductsByType(type);
            set({ products, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch products by type', loading: false });
        }
    },

    // Search products by name
    searchProducts: async (name: string) => {
        set({ loading: true, error: null });
        try {
            const products = await productsAPI.getProductByName(name);
            set({ products, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to search products', loading: false });
        }
    },

    // Add new product
    addProduct: async (data: CreateProductDTO) => {
        set({ loading: true, error: null });
        try {
            await productsAPI.createProduct(data);
            // Refresh products list after adding
            await get().fetchProducts();
        } catch (error: any) {
            set({ error: error.message || 'Failed to create product', loading: false });
            throw error;
        }
    },

    // Update existing product
    updateProduct: async (id: number, data: CreateProductDTO) => {
        set({ loading: true, error: null });
        try {
            await productsAPI.updateProduct(id, data);
            // Refresh products list after updating
            await get().fetchProducts();
        } catch (error: any) {
            set({ error: error.message || 'Failed to update product', loading: false });
            throw error;
        }
    },

    // Delete product
    deleteProduct: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await productsAPI.deleteProduct(id);
            // Remove from local state
            set(state => ({
                products: state.products.filter(p => p.id !== id),
                loading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to delete product', loading: false });
            throw error;
        }
    },

    // Set selected product
    setSelectedProduct: (product: Product | null) => {
        set({ selectedProduct: product });
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },

    // Reset store
    reset: () => {
        set({
            products: [],
            lowStockProducts: [],
            selectedProduct: null,
            loading: false,
            error: null,
        });
    },
}));
