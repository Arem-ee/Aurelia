/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Ruler } from 'lucide-react';
import { Product } from '../types';

interface HeroSectionProps {
  featuredProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenAdvisor: () => void;
  onOpenRingSizer: () => void;
  onSelectQuickFilter: (filter: string) => void;
  selectedCategory: string;
}

export default function HeroSection({
  onOpenAdvisor,
  onOpenRingSizer,
  onSelectQuickFilter,
  selectedCategory
}: HeroSectionProps) {
  const scrollToCatalog = () => {
    const shopAnchor = document.getElementById('shop-section');
    shopAnchor?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* 1. Full-Bleed Editorial Picture Background */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2400&auto=format&fit=crop"
          alt="Aurelia Handcrafted Fine Jewelry Collection"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 animate-fade-in"
        />
        {/* Soft Warm Film & Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/50" />
      </div>

      {/* 2. Minimalist Centerpiece Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center text-white py-24 sm:py-32 flex flex-col items-center">
        
        {/* Atelier Monogram / Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center space-x-2.5 mb-6 text-white/80"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-natural-gold" />
          <span className="text-[11px] font-sans tracking-[0.35em] uppercase font-medium">
            Atelier N° 04 • Handcrafted Kyoto & Cornwall
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-natural-gold" />
        </motion.div>

        {/* Minimal Hero Headline in High-Fashion Serif Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight leading-[1.08] text-white max-w-3xl mb-6"
        >
          Slowly Forged.<br />
          <span className="italic font-light text-amber-100/90 font-serif">Eternally Kept.</span>
        </motion.h1>

        {/* Minimal, Crisp Single Sentence */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm sm:text-base md:text-lg text-white/85 max-w-xl font-sans font-light leading-relaxed mb-10 tracking-wide"
        >
          Raw sea-swept celestial gemstones cast in certified 100% recycled precious metals.
        </motion.p>

        {/* Minimalist Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={scrollToCatalog}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-stone-900 hover:bg-stone-100 text-xs font-sans uppercase tracking-[0.25em] font-semibold rounded-none transition-all duration-300 flex items-center justify-center space-x-2.5 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenAdvisor}
            className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 hover:border-white/60 text-xs font-sans uppercase tracking-[0.2em] font-medium rounded-none transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>AI Stone Advisor</span>
          </button>

          <button
            onClick={onOpenRingSizer}
            className="w-full sm:w-auto px-5 py-3.5 text-white/70 hover:text-white text-xs font-sans uppercase tracking-[0.2em] font-light transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5 text-white/60" />
            <span>Ring Sizer</span>
          </button>
        </motion.div>

        {/* Quiet Minimalist Category Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-14 pt-8 border-t border-white/15 w-full max-w-2xl flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-sans tracking-widest uppercase text-white/70"
        >
          {['All Specimens', 'Rings', 'Necklaces', 'Earrings', 'Fire Opal', 'Aquamarine'].map((item) => {
            const val = item === 'All Specimens' ? 'All' : item === 'Fire Opal' ? 'Opal' : item;
            const isActive = selectedCategory === val;
            return (
              <button
                key={item}
                onClick={() => {
                  onSelectQuickFilter(val);
                  scrollToCatalog();
                }}
                className={`transition-colors cursor-pointer hover:text-white py-1 ${
                  isActive ? 'text-white border-b border-white font-medium' : 'text-white/60'
                }`}
              >
                {item}
              </button>
            );
          })}
        </motion.div>

      </div>

      {/* Subtle Scroll Down Prompt at the Bottom */}
      <div
        onClick={scrollToCatalog}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer text-white/50 hover:text-white transition-colors select-none"
      >
        <span className="text-[9px] font-sans uppercase tracking-[0.3em] mb-1.5">Scroll to View</span>
        <div className="w-4 h-7 rounded-full border border-white/40 flex items-start justify-center p-1">
          <div className="w-1 h-1.5 bg-white/70 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
