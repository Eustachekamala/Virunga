import apiClient from './client';
import { Product, CreateProductDTO, TypeProduct, Category } from '../types';

const PRODUCTS_BASE = '/products';

/**
 * Fetch all products
 */
export const getProducts = async (): Promise<Product[]> => {
    const response = await apiClient.get(`${PRODUCTS_BASE}/allProducts`);
    return response.data;
};

/**
 * Fetch a single product by ID
 */
export const getProductById = async (id: number): Promise<Product> => {
    const response = await apiClient.get(`${PRODUCTS_BASE}/getById/${id}`);
    return response.data;
};

/**
 * Fetch products by type (CONSUMABLE or NON_CONSUMABLE)
 */
export const getProductsByType = async (type: TypeProduct): Promise<Product[]> => {
    const response = await apiClient.get(`${PRODUCTS_BASE}/type/${type}`);
    return response.data;
};

/**
 * Fetch products by category
 */
export const getProductsByCategory = async (category: Category): Promise<Product[]> => {
    const response = await apiClient.get(`${PRODUCTS_BASE}/category/${category}`);
    return response.data;
};

/**
 * Search products by name
 */
export const getProductByName = async (name: string): Promise<Product[]> => {
    const response = await apiClient.get(`${PRODUCTS_BASE}/getByName/${name}`);
    return response.data;
};

/**
 * Fetch products with low stock (quantity <= threshold)
 */
export const getLowStockProducts = async (): Promise<Product[]> => {
    const response = await apiClient.get(`${PRODUCTS_BASE}/low-stock`);
    return response.data;
};

/**
 * Create a new product
 */
export const createProduct = async (data: CreateProductDTO): Promise<string> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('quantity', data.quantity.toString());
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('typeProduct', data.typeProduct);
    if (data.imageFile) {
        formData.append('imageFile', data.imageFile);
    }

    const response = await apiClient.post(`${PRODUCTS_BASE}/insert`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * Update an existing product
 */
export const updateProduct = async (id: number, data: CreateProductDTO): Promise<string> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('quantity', data.quantity.toString());
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('typeProduct', data.typeProduct);
    if (data.imageFile) {
        formData.append('imageFile', data.imageFile);
    }

    const response = await apiClient.patch(`${PRODUCTS_BASE}/update/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * Delete a product by ID
 */
export const deleteProduct = async (id: number): Promise<string> => {
    const response = await apiClient.delete(`${PRODUCTS_BASE}/${id}`);
    return response.data;
};
