/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Star, Sparkles, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailsModal({ product, onClose, onAddToCart }: ProductDetailsModalProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
        />

        {/* Modal panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative bg-white w-full max-w-3xl border border-stone-200 overflow-hidden z-10 max-h-[90vh] flex flex-col shadow-2xl"
        >
          {/* Header Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 border border-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Scrollable Container */}
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Product Image Area */}
              <div className="relative aspect-square w-full bg-stone-100">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Gemstone Overlay Tag */}
                {product.gemstone && (
                  <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs text-stone-800 text-[9px] tracking-[0.25em] uppercase font-sans px-3 py-1 border border-stone-200 flex items-center space-x-1.5">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>Gem: {product.gemstone}</span>
                  </span>
                )}
              </div>

              {/* Product Info Area */}
              <div className="p-6 sm:p-8 flex flex-col justify-between text-left">
                
                <div className="space-y-4">
                  
                  {/* Category */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-stone-400 font-medium">
                      {product.category}
                    </span>
                    <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-amber-900 px-2 py-0.5 bg-amber-50 border border-amber-200">
                      Handcrafted
                    </span>
                  </div>

                  {/* Name */}
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 leading-tight">
                    {product.name}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating) ? 'text-amber-700 fill-amber-700' : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-sans text-stone-600 font-medium">{product.rating}</span>
                    <span className="text-xs text-stone-400 font-sans font-light">({product.reviewsCount} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="py-3 border-y border-stone-100 flex items-baseline justify-between">
                    <span className="text-xs text-stone-400 font-sans uppercase tracking-widest">Specimen Value</span>
                    <span className="font-sans text-2xl font-medium text-stone-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] text-stone-400 font-medium">
                      Atelier Narrative
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed font-sans font-light">
                      {product.description}
                    </p>
                  </div>

                  {/* Technical details list */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-sans">
                    <div className="p-3 bg-stone-50 border border-stone-100">
                      <span className="block text-[9px] uppercase tracking-[0.2em] text-stone-400 mb-1">
                        Dimensions
                      </span>
                      <p className="font-medium text-stone-800">{product.dimensions}</p>
                    </div>
                    <div className="p-3 bg-stone-50 border border-stone-100">
                      <span className="block text-[9px] uppercase tracking-[0.2em] text-stone-400 mb-1">
                        Materials
                      </span>
                      <p className="font-medium text-stone-800 line-clamp-1">{product.materials.join(', ')}</p>
                    </div>
                  </div>

                  {/* Insured Note */}
                  <div className="bg-stone-50 border border-stone-200/70 p-3 flex items-start space-x-2.5 text-[11px] text-stone-500 leading-relaxed font-sans font-light">
                    <AlertCircle className="w-3.5 h-3.5 text-stone-700 flex-shrink-0 mt-0.5" />
                    <p>
                      Each specimen is individually hand-forged. Subtle organic variations in natural crystals are hallmarks of bespoke craft.
                    </p>
                  </div>

                </div>

                {/* Add to Cart Trigger Footer */}
                <div className="pt-6 mt-6 border-t border-stone-100 flex items-center space-x-3">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    className="flex-1 py-3.5 bg-stone-900 hover:bg-black text-white font-sans text-xs uppercase tracking-[0.25em] font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
