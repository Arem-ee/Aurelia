/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler, Shield } from 'lucide-react';

interface RingSizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZES = [
  { us: '5', uk: 'J 1/2', eu: '49', diameterMm: 15.7, circumferenceMm: 49.3 },
  { us: '6', uk: 'M', eu: '51.5', diameterMm: 16.5, circumferenceMm: 51.9 },
  { us: '7', uk: 'O', eu: '54', diameterMm: 17.3, circumferenceMm: 54.4 },
  { us: '8', uk: 'Q', eu: '56.5', diameterMm: 18.1, circumferenceMm: 57.0 },
  { us: '9', uk: 'S', eu: '59', diameterMm: 19.0, circumferenceMm: 59.5 },
  { us: '10', uk: 'T 1/2', eu: '61.5', diameterMm: 19.8, circumferenceMm: 62.1 },
  { us: '11', uk: 'V 1/2', eu: '64', diameterMm: 20.6, circumferenceMm: 64.6 },
];

const GEMSTONE_CARE = [
  {
    gem: 'Ethiopian Opal & Moonstone',
    hardness: '5.5 · 6.5 Mohs',
    care: 'Hydrophane stones absorb moisture. Avoid submerging in water, perfumes, or harsh solvents. Clean with a dry microfiber cloth.'
  },
  {
    gem: 'Glacial Aquamarine',
    hardness: '7.5 · 8.0 Mohs',
    care: 'Durable beryl structure. Safe with mild soap and lukewarm water. Avoid sudden extreme thermal shifts.'
  },
  {
    gem: 'Star Sapphire',
    hardness: '9.0 Mohs',
    care: 'Highly resilient for daily wear. Polish gently with warm soapy water and a soft cloth.'
  },
  {
    gem: 'Raw Druzy Amethyst',
    hardness: '7.0 Mohs',
    care: 'Preserve raw quartz geometry by avoiding ultrasonic cleaners and abrasive chemical agents.'
  }
];

export default function RingSizerModal({ isOpen, onClose }: RingSizerModalProps) {
  const [activeTab, setActiveTab] = useState<'sizer' | 'care'>('sizer');
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(2); // US 7 default

  const currentSize = SIZES[selectedSizeIndex];
  const ringScale = (currentSize.diameterMm / 17.3) * 105;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative bg-white w-full max-w-2xl border border-stone-200 shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2.5">
              <Ruler className="w-4 h-4 text-stone-900" />
              <h2 className="font-serif text-lg font-normal text-stone-900">
                Atelier Sizing & Specimen Care
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 bg-white">
            <button
              onClick={() => setActiveTab('sizer')}
              className={`flex-1 py-3 text-xs font-sans uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center space-x-2 border-b-2 ${
                activeTab === 'sizer'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Interactive Caliper</span>
            </button>

            <button
              onClick={() => setActiveTab('care')}
              className={`flex-1 py-3 text-xs font-sans uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center space-x-2 border-b-2 ${
                activeTab === 'care'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Gemstone Preservation</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8">
            {activeTab === 'sizer' && (
              <div className="space-y-6">
                {/* Visual Ring Gauge */}
                <div className="bg-stone-50 border border-stone-200 p-8 text-center flex flex-col items-center justify-center">
                  <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-stone-400 mb-6 font-medium">
                    Screen Gauge Calibration
                  </span>
                  
                  <div
                    style={{ width: `${ringScale}px`, height: `${ringScale}px` }}
                    className="rounded-full border border-stone-900 bg-white flex items-center justify-center transition-all duration-300 shadow-xs my-2"
                  >
                    <div className="text-center">
                      <span className="font-serif text-lg font-normal text-stone-900 block leading-none">
                        US {currentSize.us}
                      </span>
                      <span className="text-[9px] font-sans text-stone-400 mt-1 block">
                        {currentSize.diameterMm} mm
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-sans text-stone-500 font-light mt-6">
                    Inner Diameter: <strong className="text-stone-900 font-medium">{currentSize.diameterMm} mm</strong> · Circumference: <strong className="text-stone-900 font-medium">{currentSize.circumferenceMm} mm</strong>
                  </p>
                </div>

                {/* Size Selector Buttons */}
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-stone-400 font-medium block mb-2.5">
                    Select Standard Ring Size
                  </span>
                  <div className="grid grid-cols-7 gap-2">
                    {SIZES.map((s, idx) => (
                      <button
                        key={s.us}
                        onClick={() => setSelectedSizeIndex(idx)}
                        className={`py-2.5 px-1 text-center border font-sans text-xs transition-colors cursor-pointer ${
                          selectedSizeIndex === idx
                            ? 'bg-stone-900 text-white border-stone-900 font-medium'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <span className="block font-medium">US {s.us}</span>
                        <span className="text-[9px] opacity-70 block mt-0.5">UK {s.uk}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizing Information Note */}
                <div className="p-4 bg-stone-50 border border-stone-200 text-xs font-sans font-light text-stone-600 space-y-1">
                  <span className="font-medium text-stone-900 block uppercase tracking-wider text-[9px]">
                    Bespoke Resizing Guarantee
                  </span>
                  <p>
                    Every ring purchase includes one complimentary resize within 90 days of delivery. Custom carved widths and half sizes can be specified during order checkout.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4">
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-stone-400 font-medium block mb-2">
                  Mineral Preservation Guidelines
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {GEMSTONE_CARE.map((item, i) => (
                    <div key={i} className="p-4 border border-stone-200 bg-white space-y-1.5 text-left">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-serif text-sm font-normal text-stone-900">
                          {item.gem}
                        </h4>
                        <span className="text-[9px] font-sans text-stone-400 uppercase tracking-wider">
                          {item.hardness}
                        </span>
                      </div>
                      <p className="text-xs font-sans font-light text-stone-600 leading-relaxed">
                        {item.care}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
