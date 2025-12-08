import axios from 'axios';
import { TypeProduct, Category } from '../types';
import type { CreateProductDTO, Product } from '../types';

const API_BASE_URL = '/api/v1/products';

// Axios instance without default Content-Type
const api = axios.create();

export const getProducts = async (): Promise<Product[]> => {
    const response = await api.get(`${API_BASE_URL}/allProducts`);
    return response.data;
};

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

    const response = await api.post(`${API_BASE_URL}/insert`, formData); // Axios auto sets multipart
    return response.data;
};

export const getProductsByType = async (type: TypeProduct): Promise<Product[]> => {
    const response = await api.get(`${API_BASE_URL}/type/${type}`);
    return response.data;
};

export const getProductsByCategory = async (category: Category): Promise<Product[]> => {
    const response = await api.get(`${API_BASE_URL}/category/${category}`);
    return response.data;
};

export const getLowStockProducts = async (): Promise<Product[]> => {
    const response = await api.get(`${API_BASE_URL}/low-stock`);
    return response.data;
};

export const getProductByName = async (name: string): Promise<Product[]> => {
    const response = await api.get(`${API_BASE_URL}/getByName/${name}`);
    return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
    const response = await api.get(`${API_BASE_URL}/getById/${id}`);
    return response.data;
};

export const deleteProduct = async (id: number): Promise<string> => {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const updateProduct = async (id: number, data: CreateProductDTO): Promise<string> => {
    const formData = new FormData();
    
    // Only append non-empty/non-undefined values
    if (data.name && data.name.trim()) {
        formData.append('name', data.name);
    }
    if (data.quantity !== null && data.quantity !== undefined) {
        formData.append('quantity', data.quantity.toString());
    }
    if (data.description && data.description.trim()) {
        formData.append('description', data.description);
    }
    if (data.category && data.category.trim()) {
        formData.append('category', data.category);
    }
    if (data.typeProduct && data.typeProduct.trim()) {
        formData.append('typeProduct', data.typeProduct);
    }
    if (data.imageFile) {
        formData.append('imageFile', data.imageFile);
    }

    const response = await api.patch(`${API_BASE_URL}/update/${id}`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};
