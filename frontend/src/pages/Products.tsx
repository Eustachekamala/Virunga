import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,

  CubeIcon
} from '@heroicons/react/24/outline';

import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'consumable' | 'non-consumable';
  status: 'active' | 'inactive';
  createdAt: string;
  imageUrl?: string;
}

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      // Mock data - replace with real API call
      return [
        {
          id: '1',
          name: 'Laptop Pro',
          description: 'High-performance laptop for professionals',
          price: 1299.99,
          type: 'non-consumable',
          status: 'active',
          createdAt: '2024-01-15',
          imageUrl: 'https://via.placeholder.com/150',
        },
        {
          id: '2',
          name: 'Coffee Beans',
          description: 'Premium organic coffee beans',
          price: 24.99,
          type: 'consumable',
          status: 'active',
          createdAt: '2024-01-20',
          imageUrl: 'https://via.placeholder.com/150',
        },
        {
          id: '3',
          name: 'Office Chair',
          description: 'Ergonomic office chair with lumbar support',
          price: 299.99,
          type: 'non-consumable',
          status: 'inactive',
          createdAt: '2024-01-25',
          imageUrl: 'https://via.placeholder.com/150',
        },
      ];
    },
  });

  // Filter products based on search and type
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || product.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (_productId: string) => {
      // Mock API call - replace with real implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'consumable' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="consumable">Consumable</option>
              <option value="non-consumable">Non-Consumable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts?.map((product) => (
          <div key={product.id} className="card hover:shadow-medium transition-shadow">
            {/* Product Image */}
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(product.type)}`}>
                    {product.type}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Added {new Date(product.createdAt).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => {/* View product details */}}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="btn-danger text-sm py-2 px-3"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts?.length === 0 && (
        <div className="card text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <CubeIcon className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedType !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new product.'
            }
          </p>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      defaultValue={editingProduct?.name || ''}
                      placeholder="Enter product name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      className="input-field"
                      rows={3}
                      defaultValue={editingProduct?.description || ''}
                      placeholder="Enter product description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="input-field"
                      defaultValue={editingProduct?.price || ''}
                      placeholder="Enter price"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select className="input-field" defaultValue={editingProduct?.type || 'non-consumable'}>
                      <option value="non-consumable">Non-Consumable</option>
                      <option value="consumable">Consumable</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select className="input-field" defaultValue={editingProduct?.status || 'active'}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </form>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="btn-primary sm:ml-3 sm:w-auto"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn-secondary mt-3 sm:mt-0 sm:w-auto"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
