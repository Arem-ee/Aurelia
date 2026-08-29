/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Hammer, Sparkles, Flame, ShieldCheck, Quote, Star, ArrowRight } from 'lucide-react';

interface CraftsmanshipSectionProps {
  onFilterMineral: (mineral: string) => void;
  onOpenAdvisor: () => void;
}

const PILLARS = [
  {
    icon: Flame,
    title: 'Lost-Wax Casting',
    subtitle: '16th Century Technique',
    desc: 'Each piece begins as an organic wax carving. Centrifugally cast in 14k recycled gold, capturing microscopic organic textures and celestial contours.'
  },
  {
    icon: Hammer,
    title: 'Anvil-Beaten Texture',
    subtitle: 'Bespoke Forge Marks',
    desc: 'Bands are hand-beaten on antique cast iron anvils using chiseled hammers, creating a soft, satin-brushed luster that reflects natural ambient light.'
  },
  {
    icon: Sparkles,
    title: 'Raw Mineral Lapidary',
    subtitle: 'Preserved Crystal Faces',
    desc: 'We honor the earth’s geological memory by preserving natural crystal inclusions and untreated mineral geometry rather than over-cutting.'
  },
  {
    icon: ShieldCheck,
    title: 'Closed-Loop Gold',
    subtitle: '100% Certified Recycled',
    desc: 'All gold and fine silver are certified RJC recycled from vintage jewelry scrap, leaving zero new mining footprint on our planet.'
  }
];

const REVIEWS = [
  {
    collector: 'Elena Vance',
    location: 'Kyoto, Japan',
    piece: 'Celestial Fire Opal Orbit Ring',
    quote: 'The way the Ethiopian opal flashes with electric greens and oranges in morning sunlight is mesmerizing. The band has a substantial, tactile weight that feels like a treasured ancient talisman.'
  },
  {
    collector: 'Marcus Thorne',
    location: 'Cornwall, UK',
    piece: 'Raw Aquamarine Drop Pendant',
    quote: 'The craftsmanship is second to none. You can feel the anvil marks and the raw icy crystal looks like a captured droplet of Atlantic seawater.'
  },
  {
    collector: 'Seraphina Lin',
    location: 'San Francisco, CA',
    piece: 'Halcyon Moonstone Huggies',
    quote: 'Truly heirloom quality. The blue adularescence on the moonstones is otherworldly. I get stopped by colleagues daily asking which boutique artisan forged them.'
  }
];

export default function CraftsmanshipSection({ onOpenAdvisor }: CraftsmanshipSectionProps) {
  const [activeReview, setActiveReview] = useState(0);

  return (
    <div className="space-y-20 py-20 bg-stone-50/60 border-t border-stone-200/80">
      
      {/* 1. Atelier Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.3em] font-sans text-stone-500 uppercase font-medium block mb-2">
            The Atelier Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 leading-tight">
            Crafted for Generations, Not Seasons
          </h2>
          <p className="text-sm text-stone-600 mt-3 font-sans font-light leading-relaxed">
            We reject mass production. Every ring, talisman, and earring is forged in limited artisan cohorts with metallurgical devotion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-stone-200/80 p-8 flex flex-col justify-between transition-all duration-300 hover:border-stone-400"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-6 text-stone-800">
                    <Icon className="w-4 h-4 stroke-1.5" />
                  </div>
                  <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-stone-400 block mb-1.5">
                    {p.subtitle}
                  </span>
                  <h3 className="font-serif text-lg font-normal text-stone-900 mb-2.5">
                    {p.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-sans font-light leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-100 font-sans text-[9px] text-stone-400 tracking-[0.2em] uppercase">
                  Guild Spec // 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Interactive Collector Voices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200/80 p-8 sm:p-14">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Heading & Selector */}
            <div className="lg:col-span-5 space-y-5">
              <span className="text-[10px] font-sans uppercase tracking-[0.3em] font-medium text-stone-500 block">
                Collector Chronicles
              </span>
              
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 leading-snug">
                Voices of Those Who Wear Celestial Artifacts
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 font-sans font-light leading-relaxed">
                Over 1,200 unique bespoke pieces delivered worldwide with zero-waste packaging and lifetime artisan care.
              </p>

              {/* Review Switcher Buttons */}
              <div className="flex flex-col space-y-2 pt-2">
                {REVIEWS.map((rev, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveReview(i)}
                    className={`p-3.5 text-left font-sans transition-all cursor-pointer border ${
                      activeReview === i
                        ? 'border-stone-900 bg-stone-50 text-stone-900'
                        : 'border-stone-200/70 bg-white hover:border-stone-400 text-stone-500'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-stone-900">{rev.collector}</span>
                      <span className="text-[10px] text-stone-400 tracking-wider">{rev.location}</span>
                    </div>
                    <span className="text-[10px] text-stone-500 tracking-wider block mt-0.5">
                      Acquired: {rev.piece}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Active Testimonial Card */}
            <div className="lg:col-span-7 bg-stone-50/50 border border-stone-200/80 p-8 sm:p-12 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                  ))}
                  <span className="text-[10px] font-sans tracking-widest uppercase text-stone-600 ml-2 font-medium">
                    Verified Acquisition
                  </span>
                </div>

                <p className="font-serif text-xl sm:text-2xl text-stone-900 leading-relaxed italic mb-8 font-light">
                  "{REVIEWS[activeReview].quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-stone-200/80 flex items-center justify-between font-sans text-xs">
                <div>
                  <span className="font-medium text-stone-900 block">{REVIEWS[activeReview].collector}</span>
                  <span className="text-[10px] text-stone-400 tracking-wider uppercase">{REVIEWS[activeReview].location}</span>
                </div>
                <button
                  onClick={onOpenAdvisor}
                  className="text-[10px] uppercase tracking-[0.2em] text-stone-900 hover:text-stone-600 flex items-center space-x-1.5 cursor-pointer font-medium"
                >
                  <span>Find Your Specimen</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
