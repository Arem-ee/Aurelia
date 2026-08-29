/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, ShoppingBag, Heart, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onSelectProduct,
  isWishlisted = false,
  onToggleWishlist
}: ProductCardProps) {
  return (
    <div className="group relative flex flex-col h-full bg-white border border-stone-200/80 rounded-none overflow-hidden transition-all duration-300 hover:border-stone-400/80 hover:shadow-xs">
      
      {/* Product Image Stage */}
      <div 
        className="relative aspect-4/5 w-full bg-stone-100/50 overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Minimal Gemstone Pill */}
        {product.gemstone && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-stone-800 text-[9px] font-sans tracking-[0.2em] uppercase px-2 py-0.5 border border-stone-200/80">
            {product.gemstone}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs border border-stone-200/80 text-stone-700 hover:text-stone-950 transition-all duration-200 z-10 opacity-90 group-hover:opacity-100"
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 transition-transform duration-200 active:scale-125 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}`} />
        </button>

        {/* Minimalist Slide-up Quick Action Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between gap-2 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="flex-1 py-2 bg-white/95 hover:bg-white text-stone-900 text-[10px] font-sans uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex-1 py-2 bg-stone-900 hover:bg-black text-white text-[10px] font-sans uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center space-x-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Typography & Editorial Details Area */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white text-left">
        <div>
          {/* Subtle Category & Limited Stock */}
          <div className="flex items-center justify-between mb-1 text-[10px] font-sans tracking-[0.2em] uppercase text-stone-500">
            <span>{product.category}</span>
            {product.stock <= 4 && (
              <span className="text-amber-800 font-medium">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Product Name in Cormorant Garamond */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-serif text-lg font-normal text-stone-900 hover:text-stone-600 cursor-pointer transition-colors duration-200 line-clamp-1 mb-1"
          >
            {product.name}
          </h3>

          {/* Materials */}
          <p className="text-xs text-stone-500 font-sans font-light tracking-wide line-clamp-1 mb-3">
            {product.materials.join(' • ')}
          </p>
        </div>

        {/* Minimal Price & Quick Add */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="font-sans text-sm font-medium text-stone-900 tracking-tight">
            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>

          <button
            onClick={() => onAddToCart(product)}
            className="text-[10px] font-sans uppercase tracking-[0.2em] text-stone-600 hover:text-stone-950 font-medium transition-colors cursor-pointer flex items-center space-x-1"
          >
            <span>Acquire</span>
            <span className="text-xs font-serif font-light">→</span>
          </button>
        </div>
      </div>

    </div>
  );
}
