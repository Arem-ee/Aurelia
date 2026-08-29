/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart
}: WishlistDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white border-l border-stone-200 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <h2 className="font-serif text-lg font-normal text-stone-900">
                  Wishlist
                </h2>
                <span className="font-sans text-xs text-stone-400">
                  ({wishlistItems.length})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-stone-500 hover:text-stone-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Heart className="w-8 h-8 text-stone-300 mb-3" />
                  <h3 className="font-serif text-base font-normal text-stone-900 mb-1">
                    Your wishlist is empty
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs leading-relaxed font-sans font-light">
                    Save your favorite gemstones and bespoke pieces to revisit anytime.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-sans uppercase tracking-[0.2em] transition-colors"
                  >
                    Browse Collection
                  </button>
                </div>
              ) : (
                wishlistItems.map((product) => (
                  <div
                    key={product.id}
                    className="flex space-x-4 p-3 border border-stone-200 bg-white"
                  >
                    {/* Product Thumbnail */}
                    <div className="w-20 h-20 bg-stone-100 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm font-normal text-stone-900 line-clamp-1 pr-2">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveFromWishlist(product.id)}
                            className="text-stone-400 hover:text-red-500 transition-colors"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-0.5">
                          <span className="text-[9px] font-sans text-stone-400 uppercase tracking-widest block">
                            {product.category}
                          </span>
                          <span className="font-sans text-xs font-medium text-stone-900">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Add to Bag Button */}
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            onRemoveFromWishlist(product.id);
                          }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900 hover:bg-black text-white text-[10px] font-sans tracking-widest uppercase transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Move to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
