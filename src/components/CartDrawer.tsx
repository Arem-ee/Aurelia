/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShieldCheck, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartDrawerProps) {
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

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
                <ShoppingBag className="w-4 h-4 text-stone-900" />
                <h2 className="font-serif text-lg font-normal text-stone-900">
                  Shopping Bag
                </h2>
                <span className="font-sans text-xs text-stone-400">
                  ({cartItems.length})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-stone-500 hover:text-stone-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bag Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <ShoppingBag className="w-8 h-8 text-stone-300 mb-3" />
                  <h3 className="font-serif text-base font-normal text-stone-900 mb-1">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs leading-relaxed font-sans font-light">
                    Explore our curated collection of celestial gemstones and artisan bands.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-sans uppercase tracking-[0.2em] transition-colors"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex space-x-4 p-3 border border-stone-200 bg-white"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 bg-stone-100 flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Description */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm font-normal text-stone-900 line-clamp-1 pr-2">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-stone-400 hover:text-red-500 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[9px] font-sans text-stone-400 uppercase tracking-widest block mt-0.5">
                          {item.product.category}
                        </span>
                      </div>

                      {/* Quantity Toggles & Price */}
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-stone-200">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            disabled={item.quantity <= 1}
                            className="p-1 text-stone-600 hover:text-stone-950 disabled:opacity-30"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-sans text-xs font-medium text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 text-stone-600 hover:text-stone-950 disabled:opacity-30"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-sans text-xs font-medium text-stone-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Checkout Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-stone-500 font-sans">
                    <span>Worldwide Shipping</span>
                    <span className="uppercase tracking-widest text-stone-900 font-medium">
                      Complimentary
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="font-serif text-stone-900 font-normal text-lg">Subtotal</span>
                    <span className="font-sans text-xl font-medium text-stone-900">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start space-x-2 p-2.5 bg-white border border-stone-200 text-[10px] text-stone-500 leading-relaxed font-sans font-light">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-700 flex-shrink-0 mt-0.5" />
                  <p>
                    Insured atelier shipping with signature presentation packaging.
                  </p>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full py-3.5 bg-stone-900 hover:bg-black text-white font-sans text-xs uppercase tracking-[0.25em] font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Checkout</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
