import React from 'react';
import type { Product } from '../types';
import { API_BASE_URL } from '../api/client';
import {
    Edit2,
    Trash2,
    Box,
} from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onDelete: (id: number) => void;
    onEdit: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, onEdit }) => {
    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-cocoa/5 hover:shadow-2xl hover:shadow-cocoa/20 hover:-translate-y-1 transition-all duration-300 border border-cocoa/5">
            <div className="h-48 relative overflow-hidden bg-cream-dark">
                {product.imageFile ? (
                    <>
                        <img
                            src={
                                product.imageFile.startsWith('http')
                                    ? product.imageFile
                                    : `${API_BASE_URL.replace('/api/v1', '')}/uploads/${product.imageFile}`
                            }
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-cocoa/10 to-transparent">
                        <Box className="w-12 h-12 text-cocoa/20" />
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                    {product.lowStock && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-500 text-white shadow-lg shadow-red-500/20 backdrop-blur-md animate-pulse">
                            Low Stock
                        </span>
                    )}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-md border border-white/10 ${product.status === 'URGENT'
                        ? 'bg-gold/90 text-cocoa'
                        : 'bg-forest/90 text-white'
                        }`}>
                        {product.status}
                    </span>
                </div>

                {/* Type Badge */}
                <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/90 text-cocoa shadow-sm backdrop-blur-md border border-white/20">
                        {product.typeProduct}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <div className="mb-3">
                    <h3 className="text-lg font-bold text-cocoa leading-tight line-clamp-1 group-hover:text-gold transition-colors">
                        {product.name}
                    </h3>
                </div>

                <p className="text-xs text-cocoa/60 mb-6 line-clamp-2 min-h-[2.5em] font-medium leading-relaxed">
                    {product.description || "No description available."}
                </p>

                <div className="flex items-end justify-between pt-4 border-t border-cocoa/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-cocoa/40 uppercase tracking-widest font-bold mb-0.5">Quantity</span>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-2xl font-bold tabular-nums tracking-tight ${product.lowStock ? 'text-red-500' : 'text-cocoa'}`}>
                                {product.quantity}
                            </span>
                            <span className="text-xs text-cocoa/40 font-medium">units</span>
                        </div>
                    </div>

                    <div className="flex gap-1">
                        <button
                            onClick={() => onEdit(product)}
                            className="p-2 text-cocoa/50 hover:text-white hover:bg-gold rounded-lg transition-all duration-200"
                            title="Edit Product"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(product.id)}
                            className="p-2 text-cocoa/50 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200"
                            title="Delete Product"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductCard);
