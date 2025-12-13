import apiClient from '../api/client';
import { TypeProduct, Category } from '../types';
import type { CreateProductDTO, Product } from '../types';

export const getProducts = async (): Promise<Product[]> => {
    const response = await apiClient.get('/products/allProducts');
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

    const response = await apiClient.post('/products/insert', formData);
    return response.data;
};

export const getProductsByType = async (type: TypeProduct): Promise<Product[]> => {
    const response = await apiClient.get(`/products/type/${type}`);
    return response.data;
};

export const getProductsByCategory = async (category: Category): Promise<Product[]> => {
    const response = await apiClient.get(`/products/category/${category}`);
    return response.data;
};

export const getLowStockProducts = async (): Promise<Product[]> => {
    const response = await apiClient.get('/products/low-stock');
    return response.data;
};

export const getProductByName = async (name: string): Promise<Product[]> => {
    const response = await apiClient.get(`/products/getByName/${name}`);
    return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/products/getById/${id}`);
    return response.data;
};

export const deleteProduct = async (id: number): Promise<string> => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
};

export const updateProduct = async (id: number, data: CreateProductDTO): Promise<string> => {
    const formData = new FormData();

    if (data.name?.trim()) formData.append('name', data.name);
    if (data.quantity !== undefined && data.quantity !== null)
        formData.append('quantity', data.quantity.toString());
    if (data.description?.trim()) formData.append('description', data.description);
    if (data.category?.trim()) formData.append('category', data.category);
    if (data.typeProduct?.trim()) formData.append('typeProduct', data.typeProduct);
    if (data.imageFile) formData.append('imageFile', data.imageFile);

    const response = await apiClient.patch(`/products/update/${id}`, formData);
    return response.data;
};
