/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Compass, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface AIAdvisorTabProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

const BIRTHSTONES = [
  { month: 'January', stone: 'Garnet' },
  { month: 'February', stone: 'Amethyst' },
  { month: 'March', stone: 'Aquamarine' },
  { month: 'April', stone: 'Diamond' },
  { month: 'May', stone: 'Emerald' },
  { month: 'June', stone: 'Pearl' },
  { month: 'July', stone: 'Ruby' },
  { month: 'August', stone: 'Peridot' },
  { month: 'September', stone: 'Sapphire' },
  { month: 'October', stone: 'Opal' },
  { month: 'November', stone: 'Topaz / Citrine' },
  { month: 'December', stone: 'Tanzanite / Turquoise' }
];

const METALS = [
  '14k Recycled Yellow Gold',
  'Solid Sterling Silver',
  'Rose Gold',
  'Mixed Metals / Two-Tone'
];

const AESTHETICS = [
  {
    id: 'celestial',
    name: 'Celestial & Cosmic',
    desc: 'Inspired by lunar phases, solar flares, and planetary geometry.'
  },
  {
    id: 'raw',
    name: 'Raw & Terrestrial',
    desc: 'Preserving organic stone surfaces, uncut facets, and raw geology.'
  },
  {
    id: 'vintage',
    name: 'Artisan Heirloom',
    desc: 'Hand-stamped engravings, antique patinas, and generational permanence.'
  },
  {
    id: 'minimalist',
    name: 'Modern Minimalist',
    desc: 'Fluid structural lines, understated balances, and quiet luxury.'
  }
];

export default function AIAdvisorTab({
  products,
  onAddToCart,
  onSelectProduct
}: AIAdvisorTabProps) {
  const [birthstone, setBirthstone] = useState('');
  const [favoriteMetal, setFavoriteMetal] = useState('');
  const [styleVibe, setStyleVibe] = useState('');
  const [outfitVibe, setOutfitVibe] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [advisorResponse, setAdvisorResponse] = useState<{
    recommendationText: string;
    suggestedProductIds: string[];
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAdvisorResponse(null);

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthstone,
          favoriteMetal,
          styleVibe,
          outfitVibe
        })
      });

      const data = await res.json();

      setTimeout(() => {
        setIsLoading(false);
        setAdvisorResponse(data);
      }, 1200);
    } catch (err) {
      setIsLoading(false);
      setAdvisorResponse({
        recommendationText: `Based on your profile, we recommend pairing our heirloom **Lunar Eclipse Baroque Pearl Necklace** (p6) featuring organic freshwater baroque pearl with the **Artemis Obsidian Signet Ring** (p8) for classic, raw grounding.`,
        suggestedProductIds: ['p6', 'p8']
      });
    }
  };

  const handleReset = () => {
    setBirthstone('');
    setFavoriteMetal('');
    setStyleVibe('');
    setOutfitVibe('');
    setAdvisorResponse(null);
  };

  const recommendedProducts = products.filter((p) =>
    advisorResponse?.suggestedProductIds?.includes(p.id)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Intro Header */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-stone-400 font-medium block mb-2">
          Consultation & Pairing
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 leading-tight">
          Gemstone & Style Advisor
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-2.5 font-sans font-light leading-relaxed">
          Curate bespoke handcrafted pairings aligned with your astrological birthstone, metal preferences, and aesthetic sensibilities.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Loading Screen */}
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-stone-200 p-12 sm:p-16 text-center flex flex-col items-center justify-center max-w-2xl mx-auto"
          >
            <div className="w-8 h-8 border border-stone-300 border-t-stone-900 rounded-full animate-spin mb-5" />
            <span className="text-[10px] font-sans tracking-[0.25em] text-stone-400 uppercase mb-1.5 font-medium">
              Formulating Consultation
            </span>
            <h3 className="font-serif text-lg font-normal text-stone-900 mb-1">
              Analyzing mineral affinities and atelier pieces...
            </h3>
          </motion.div>
        )}

        {/* Results Screen */}
        {!isLoading && advisorResponse && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* The Advice Card */}
            <div className="bg-white border border-stone-200 p-8 sm:p-12 text-left">
              <div className="flex items-center justify-between pb-6 border-b border-stone-100 mb-6">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-stone-400 font-medium block mb-1">
                    Atelier Advisory Report
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900">
                    Bespoke Curation
                  </h3>
                </div>
                <button
                  onClick={handleReset}
                  className="text-[10px] font-sans uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 font-medium transition-colors flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>New Consultation</span>
                </button>
              </div>

              <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-700 leading-relaxed font-sans font-light">
                <p className="whitespace-pre-line">{advisorResponse.recommendationText}</p>
              </div>
            </div>

            {/* Matched Products Catalog */}
            {recommendedProducts.length > 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-stone-400 font-medium block mb-1">
                    Selected Pieces
                  </span>
                  <h4 className="font-serif text-2xl font-normal text-stone-900">
                    Recommended Atelier Artifacts
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {recommendedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-stone-200 p-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="aspect-4/5 w-full bg-stone-100 overflow-hidden">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] font-sans uppercase text-stone-400 tracking-widest block">
                            {p.category}
                          </span>
                          <h5 className="font-serif text-base font-normal text-stone-900 line-clamp-1 mt-0.5">
                            {p.name}
                          </h5>
                          <span className="font-sans text-xs font-medium text-stone-900 block mt-1">
                            ${p.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-4 mt-4 border-t border-stone-100">
                        <button
                          onClick={() => onSelectProduct(p)}
                          className="flex-1 py-2 border border-stone-200 hover:border-stone-400 text-stone-700 hover:text-stone-900 font-sans text-[10px] uppercase tracking-widest transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onAddToCart(p)}
                          className="flex-1 py-2 bg-stone-900 hover:bg-black text-white font-sans text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center space-x-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Input Questionnaire Form */}
        {!isLoading && !advisorResponse && (
          <motion.form
            key="questionnaire"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-stone-200 p-8 sm:p-12 space-y-8 max-w-2xl mx-auto text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Birthstone selection */}
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-stone-500 font-medium mb-2">
                  Birthstone / Astrological Month
                </label>
                <select
                  value={birthstone}
                  onChange={(e) => setBirthstone(e.target.value)}
                  required
                  className="w-full bg-white border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-hidden font-sans cursor-pointer"
                >
                  <option value="">Select month...</option>
                  {BIRTHSTONES.map((b) => (
                    <option key={b.month} value={`${b.month} (${b.stone})`}>
                      {b.month} · {b.stone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Metal selection */}
              <div>
                <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-stone-500 font-medium mb-2">
                  Precious Metal Preference
                </label>
                <select
                  value={favoriteMetal}
                  onChange={(e) => setFavoriteMetal(e.target.value)}
                  required
                  className="w-full bg-white border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-hidden font-sans cursor-pointer"
                >
                  <option value="">Select metal...</option>
                  {METALS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Aesthetic Selection Cards */}
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-stone-500 font-medium mb-3">
                Aesthetic Direction
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AESTHETICS.map((aes) => (
                  <div
                    key={aes.id}
                    onClick={() => setStyleVibe(aes.name)}
                    className={`p-4 border cursor-pointer transition-all duration-200 text-left ${
                      styleVibe === aes.name
                        ? 'border-stone-900 bg-stone-50 text-stone-900'
                        : 'border-stone-200 bg-white hover:border-stone-400 text-stone-600'
                    }`}
                  >
                    <h5 className="font-serif text-sm font-normal text-stone-900">
                      {aes.name}
                    </h5>
                    <p className="text-[11px] text-stone-500 font-sans font-light mt-1 leading-relaxed">
                      {aes.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Text description of Outfit or current feeling */}
            <div>
              <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-stone-500 font-medium mb-2">
                Occasion, Wardrobe, or Mood (Optional)
              </label>
              <textarea
                placeholder="e.g., Everyday styling for clean linen and tailored silhouettes, or special evening wear..."
                value={outfitVibe}
                onChange={(e) => setOutfitVibe(e.target.value)}
                rows={3}
                className="w-full bg-white border border-stone-200 px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:outline-hidden resize-none leading-relaxed font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={!birthstone || !favoriteMetal || !styleVibe}
              className="w-full py-3.5 bg-stone-900 hover:bg-black disabled:opacity-40 text-white font-sans text-xs uppercase tracking-[0.25em] font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Begin Style Consultation</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
