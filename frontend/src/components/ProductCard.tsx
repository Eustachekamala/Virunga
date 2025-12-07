import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onDelete: (id: number) => void;
    onEdit: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, onEdit }) => {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-xl shadow-cocoa/5 hover:shadow-2xl hover:shadow-cocoa/10 hover:-translate-y-1 transition-all duration-300 group border border-cocoa/5">
            <div className="h-56 relative overflow-hidden bg-cream-dark">
                {product.imageFile ? (
                    <img
                        src={`/uploads/${product.imageFile}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-cocoa/20 font-serif italic text-lg">
                        Virunga
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                    <span className={`
                        px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm backdrop-blur-md
                        ${product.lowStock
                            ? 'bg-red-600/90 text-white'
                            : product.status === 'URGENT'
                                ? 'bg-gold text-cocoa'
                                : 'bg-forest text-white'
                        }
                    `}>
                        {product.lowStock ? 'Low Stock' : product.status}
                    </span>
                </div>

                {/* Type Badge */}
                <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-white/90 text-cocoa shadow-sm backdrop-blur">
                        {product.typeProduct}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif text-xl font-bold text-cocoa leading-tight">
                        {product.name}
                    </h3>
                </div>

                <p className="text-sm text-cocoa/60 mb-6 line-clamp-2 h-10 font-light leading-relaxed">
                    {product.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-cocoa/5">
                    <div className="flex flex-col">
                        <span className="text-xs text-cocoa/40 uppercase tracking-wider">Quantity</span>
                        <span className={`font-mono text-lg font-medium ${product.lowStock ? 'text-red-600' : 'text-cocoa'}`}>
                            {product.quantity} <span className="text-xs text-cocoa/40">units</span>
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(product)}
                            className="p-2 text-cocoa/60 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                            onClick={() => onDelete(product.id)}
                            className="p-2 text-cocoa/60 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
