/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, User, ShoppingBag, Search, SlidersHorizontal, ArrowUpDown, ChevronRight, Gift, ShieldAlert } from 'lucide-react';
import { Product, CartItem, Order, UserProfile } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AIAdvisorTab from './components/AIAdvisorTab';
import UserDashboard from './components/UserDashboard';
import ProductDetailsModal from './components/ProductDetailsModal';
import WishlistDrawer from './components/WishlistDrawer';
import HeroSection from './components/HeroSection';
import CraftsmanshipSection from './components/CraftsmanshipSection';
import RingSizerModal from './components/RingSizerModal';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Jane Austen',
  email: 'jane.austen@atelier.com',
  shippingAddress: {
    fullName: 'Jane Austen',
    addressLine: '415 Cathedral Spires Road',
    city: 'Sedona',
    postalCode: '86336',
    country: 'United States'
  }
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Layout States
  const [currentTab, setCurrentTab] = useState<'shop' | 'advisor' | 'dashboard'>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isRingSizerOpen, setIsRingSizerOpen] = useState(false);

  // Shop Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('featured');

  const handleSelectQuickFilter = (filterVal: string) => {
    if (filterVal === 'All') {
      setSelectedCategory('All');
      setSearchQuery('');
    } else if (['Rings', 'Necklaces', 'Earrings', 'Bracelets'].includes(filterVal)) {
      setSelectedCategory(filterVal);
      setSearchQuery('');
    } else {
      setSelectedCategory('All');
      setSearchQuery(filterVal);
    }
  };

  // Load Initial Store Data & Sync States
  useEffect(() => {
    // 1. Fetch catalog products from Express API
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products from backend API', err);
      }
    };

    fetchProducts();

    // 2. Load cart, orders, profile, and wishlist from LocalStorage for durable sandbox persistence
    const savedCart = localStorage.getItem('aurelia_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedProfile = localStorage.getItem('aurelia_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    const savedWishlist = localStorage.getItem('aurelia_wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    // Merge server-side orders with local mock orders to prevent session reset loss
    const syncOrders = async () => {
      const localOrdersStr = localStorage.getItem('aurelia_orders');
      const localOrders: Order[] = localOrdersStr ? JSON.parse(localOrdersStr) : [];
      
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const serverOrders: Order[] = await res.json();
          // Filter duplicates based on unique Order ID
          const merged = [...serverOrders, ...localOrders].reduce((acc: Order[], curr) => {
            if (!acc.some(o => o.id === curr.id)) {
              acc.push(curr);
            }
            return acc;
          }, []);
          setOrders(merged);
        } else {
          setOrders(localOrders);
        }
      } catch (err) {
        setOrders(localOrders);
      }
    };

    syncOrders();
  }, []);

  // Save Cart state to client LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('aurelia_cart', JSON.stringify(cart));
  }, [cart]);

  // Save Wishlist state to client LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('aurelia_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Save Profile state to client LocalStorage on changes
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('aurelia_profile', JSON.stringify(newProfile));
  };

  // Cart Management Functions
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        // Enforce maximum available stock threshold
        const newQty = Math.min(existing.quantity + 1, product.stock);
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    // Open cart drawer immediately for rich interactive feedback
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: Math.min(nextQty, item.product.stock) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Callback when mock checkout completes successfully
  const handleOrderComplete = (newOrder: Order) => {
    setOrders((prevOrders) => {
      const updated = [newOrder, ...prevOrders];
      localStorage.setItem('aurelia_orders', JSON.stringify(updated));
      return updated;
    });
    // Automatically transition tab to Dashboard to view the order timeline!
    setTimeout(() => {
      setIsCheckoutOpen(false);
      setCurrentTab('dashboard');
    }, 500);
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.materials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.gemstone && product.gemstone.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    if (sortOption === 'reviews') return b.rating - a.rating;
    return 0; // Default Featured sorting
  });

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans flex flex-col justify-between selection:bg-stone-900 selection:text-white">
      {/* Main Header Brand & Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Main Workspace Body Content */}
      <main className="flex-grow">
        
        {/* TAB 1: SHOP CATALOG FRONT */}
        {currentTab === 'shop' && (
          <div className="animate-fade-in">
            {/* Captivating Immersive Hero Section */}
            <HeroSection
              featuredProducts={products}
              onSelectProduct={setSelectedProduct}
              onAddToCart={handleAddToCart}
              onOpenAdvisor={() => setCurrentTab('advisor')}
              onOpenRingSizer={() => setIsRingSizerOpen(true)}
              onSelectQuickFilter={handleSelectQuickFilter}
              selectedCategory={selectedCategory}
            />

            {/* Catalog Grid Area */}
            <section id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              
              {/* Section Title & Subtitle Header */}
              <div className="text-center max-w-xl mx-auto mb-14">
                <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-stone-400 font-medium block mb-2">
                  Atelier Registry • Vol. IV
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 leading-tight">
                  Curated Fine Artifacts
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-2 font-sans font-light">
                  Individually hand-cast, hallmarked, and packaged in organic presentation boxes.
                </p>
              </div>

              {/* Filters Header Grid */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 mb-12 border-b border-stone-200/80">
                
                {/* Categories */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSearchQuery('');
                      }}
                      className={`px-5 py-2 text-xs font-sans uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer border ${
                        selectedCategory === cat
                          ? 'bg-stone-900 text-white border-stone-900 font-medium'
                          : 'bg-white text-stone-600 border-stone-200/80 hover:border-stone-400 hover:text-stone-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search and Sort tools */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3.5 top-3 w-3.5 h-3.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search opal, aquamarine, gold..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-stone-200/80 pl-9 pr-4 py-2 text-xs text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:outline-hidden font-sans"
                    />
                  </div>

                  {/* Sorter */}
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full bg-white border border-stone-200/80 pl-4 pr-9 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-hidden appearance-none cursor-pointer font-sans"
                    >
                      <option value="featured">Featured Curations</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="reviews">Best Reviews</option>
                    </select>
                    <ArrowUpDown className="absolute right-3 top-3 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                  </div>
                </div>

              </div>

              {/* Active Search/Filter Pill if active */}
              {searchQuery && (
                <div className="mb-8 flex items-center space-x-2 text-xs font-sans text-stone-500">
                  <span className="tracking-wider">Filtered by:</span>
                  <span className="bg-stone-100 text-stone-900 font-medium px-3 py-1 border border-stone-200 flex items-center space-x-2">
                    <span>"{searchQuery}"</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:text-red-500 font-normal ml-1"
                    >
                      ×
                    </button>
                  </span>
                </div>
              )}

              {/* Products Catalog Display Grid */}
              {sortedProducts.length === 0 ? (
                <div className="text-center py-20 bg-white border border-stone-200">
                  <Search className="w-8 h-8 text-stone-400 mx-auto mb-3" />
                  <h3 className="font-serif text-lg font-normal text-stone-900 mb-1">
                    No creations found matching "{searchQuery}"
                  </h3>
                  <p className="text-xs text-stone-500 mb-4 font-sans font-light">
                    Try searching for different gemstones (e.g. Opal, Moonstone, Labradorite) or reset your filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-5 py-2 bg-stone-900 text-white text-xs font-sans uppercase tracking-[0.2em]"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onSelectProduct={setSelectedProduct}
                      isWishlisted={wishlist.some((p) => p.id === product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              )}

            </section>

            {/* Captivating Artisan Craftsmanship & Collector Voices Section */}
            <CraftsmanshipSection
              onFilterMineral={handleSelectQuickFilter}
              onOpenAdvisor={() => setCurrentTab('advisor')}
            />
          </div>
        )}

        {/* TAB 2: AI ADVISOR FOR BESPOKE MATCHES */}
        {currentTab === 'advisor' && (
          <div className="py-12 bg-[#FAF9F6]">
            <AIAdvisorTab
              products={products}
              onAddToCart={handleAddToCart}
              onSelectProduct={setSelectedProduct}
            />
          </div>
        )}

        {/* TAB 3: PERSONAL ATELIER PORTAL & ORDER TIMELINE */}
        {currentTab === 'dashboard' && (
          <div className="py-12 bg-[#FAF9F6]">
            <UserDashboard
              orders={orders}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
            />
          </div>
        )}

      </main>

      {/* Wishlist Drawer Overlay */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveFromWishlist={(id) => setWishlist((prev) => prev.filter((p) => p.id !== id))}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Slider Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal Form */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderComplete={handleOrderComplete}
        onClearCart={handleClearCart}
      />

      {/* Product Details Full Screen Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Interactive Ring Sizer & Gemstone Care Modal */}
      <RingSizerModal
        isOpen={isRingSizerOpen}
        onClose={() => setIsRingSizerOpen(false)}
      />

      {/* Minimalist High-End Atelier Footer */}
      <footer className="bg-stone-900 text-stone-300 py-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
            
            {/* Branding Column */}
            <div className="space-y-3 md:col-span-2">
              <span className="font-serif text-2xl tracking-[0.25em] font-normal text-white uppercase block">
                Aurelia
              </span>
              <p className="text-xs text-stone-400 font-sans font-light leading-relaxed max-w-md">
                A slow-crafted jewelry atelier creating timeless fine pieces from raw sea-swept gemstones and certified 100% recycled 14k gold. Handcrafted between Kyoto and Cornwall.
              </p>
            </div>

            {/* Ethical Atelier */}
            <div className="space-y-3">
              <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] text-white font-medium">
                Atelier Standards
              </h4>
              <ul className="space-y-2 font-sans text-xs text-stone-400 font-light">
                <li>• 100% Recycled Precious Metals</li>
                <li>• Conflict-Free Untreated Gems</li>
                <li>• Bespoke Hallmarking</li>
                <li>• Lifetime Artisan Care</li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] text-white font-medium">
                Navigation
              </h4>
              <ul className="space-y-2 font-sans text-xs text-stone-400 font-light">
                <li>
                  <button
                    onClick={() => {
                      setCurrentTab('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Collection Registry
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('advisor')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    AI Stone Advisor
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsRingSizerOpen(true)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Ring Sizer & Care Guide
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-sans tracking-widest uppercase text-stone-500 font-light">
            <p>© {new Date().getFullYear()} Aurelia Fine Jewelry Atelier. All rights reserved.</p>
            <div className="flex items-center space-x-2 text-stone-400">
              <span>Insured Worldwide Delivery</span>
              <span>•</span>
              <span>Complimentary Gift Packaging</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
