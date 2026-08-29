/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Sparkles, User, Compass, Heart } from 'lucide-react';

interface NavbarProps {
  currentTab: 'shop' | 'advisor' | 'dashboard';
  setCurrentTab: (tab: 'shop' | 'advisor' | 'dashboard') => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all duration-300">
      
      {/* Top micro announcement bar */}
      <div className="bg-stone-900 text-stone-100 py-1.5 px-4 text-center text-[10px] font-sans tracking-[0.25em] uppercase font-light">
        Complimentary insured global shipping & bespoke wooden presentation box on all orders
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Navigation Links Left (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setCurrentTab('shop')}
              className={`text-xs font-sans tracking-[0.2em] uppercase transition-colors duration-200 py-1 border-b ${
                currentTab === 'shop'
                  ? 'text-stone-900 border-stone-900 font-medium'
                  : 'text-stone-500 border-transparent hover:text-stone-900'
              }`}
            >
              Collection
            </button>

            <button
              onClick={() => setCurrentTab('advisor')}
              className={`flex items-center space-x-1.5 text-xs font-sans tracking-[0.2em] uppercase transition-colors duration-200 py-1 border-b ${
                currentTab === 'advisor'
                  ? 'text-stone-900 border-stone-900 font-medium'
                  : 'text-stone-500 border-transparent hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>AI Advisor</span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`text-xs font-sans tracking-[0.2em] uppercase transition-colors duration-200 py-1 border-b ${
                currentTab === 'dashboard'
                  ? 'text-stone-900 border-stone-900 font-medium'
                  : 'text-stone-500 border-transparent hover:text-stone-900'
              }`}
            >
              Vault & Account
            </button>
          </nav>

          {/* Logo Brand (Center) */}
          <div
            className="flex flex-col items-center justify-center cursor-pointer select-none"
            onClick={() => setCurrentTab('shop')}
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-normal text-stone-900 uppercase">
              Aurelia
            </span>
            <span className="text-[8px] tracking-[0.35em] font-sans uppercase text-stone-400 -mt-0.5">
              Fine Atelier
            </span>
          </div>

          {/* Action Icons (Right) */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Mobile Navigation Toggles */}
            <div className="flex md:hidden space-x-1 mr-1">
              <button
                onClick={() => setCurrentTab('shop')}
                className={`p-2 rounded-full ${currentTab === 'shop' ? 'text-stone-900 bg-stone-100' : 'text-stone-500'}`}
                title="Catalog"
              >
                <Compass className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentTab('advisor')}
                className={`p-2 rounded-full ${currentTab === 'advisor' ? 'text-stone-900 bg-stone-100' : 'text-stone-500'}`}
                title="AI Advisor"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`p-2 rounded-full ${currentTab === 'dashboard' ? 'text-stone-900 bg-stone-100' : 'text-stone-500'}`}
                title="Account"
              >
                <User className="w-4 h-4" />
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              id="wishlist-trigger-btn"
              className="relative p-2 text-stone-700 hover:text-stone-950 transition-colors"
              title="Saved Items"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute 0 right-0 w-3.5 h-3.5 bg-stone-900 text-white text-[8px] font-sans font-medium rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Bag Button */}
            <button
              onClick={onOpenCart}
              id="cart-trigger-btn"
              className="relative p-2 text-stone-700 hover:text-stone-950 transition-colors flex items-center space-x-1.5"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-sans tracking-widest text-stone-900 font-medium hidden sm:inline">
                ({cartCount})
              </span>
              {cartCount > 0 && (
                <span className="sm:hidden absolute 0 right-0 w-3.5 h-3.5 bg-stone-900 text-white text-[8px] font-sans font-medium rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
