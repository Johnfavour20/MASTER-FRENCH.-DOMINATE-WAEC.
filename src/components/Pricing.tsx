/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Check, X } from "lucide-react";

interface PricingProps {
  openSignupModal: () => void;
}

export default function Pricing({ openSignupModal }: PricingProps) {
  return (
    <section className="w-full py-20 md:py-28 bg-gradient-to-b from-white to-slate-50/50 border-t border-slate-100">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-amber-50 text-amber-700 border border-amber-200 uppercase font-mono font-black tracking-wider text-[10px] px-3 py-1 rounded-full inline-block mb-3">PRICING PLANS</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-brand-blue tracking-tight leading-tight">
            Simple, honest pricing.
          </h2>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          
          {/* Free Offer - Trial Cohort */}
          <div className="bg-white border border-slate-150 rounded-3xl p-8 shadow-md flex flex-col justify-between hover:shadow-lg transition-all">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Trial Cohort</span>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-brand-blue font-mono">N0</span>
                <span className="text-slate-400 text-xs font-bold uppercase">/ cohort</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[3]" />
                  Basic Vocabulary Mocks
                </li>
                <li className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[3]" />
                  Book grammar exercises
                </li>
                <li className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[3]" />
                  Community Forum access
                </li>
                <li className="flex items-center gap-2.5 text-xs font-bold text-slate-350 line-through">
                  <X className="w-4 h-4 text-slate-300 shrink-0 stroke-[2.5]" />
                  Direct AI Chat and Feedback
                </li>
                <li className="flex items-center gap-2.5 text-xs font-bold text-slate-350 line-through">
                  <X className="w-4 h-4 text-slate-300 shrink-0 stroke-[2.5]" />
                  Daily Proctored sessions
                </li>
              </ul>
            </div>

            <button
              onClick={openSignupModal}
              className="w-full bg-slate-50 hover:bg-slate-100 text-brand-blue font-extrabold text-xs md:text-sm py-4 rounded-xl transition-all text-center cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* Premium Pass - The Premium Pass */}
          <div className="bg-brand-blue text-white border-2 border-brand-blue rounded-3xl p-8 shadow-xl flex flex-col justify-between relative transform hover:scale-102 transition-all">
            
            {/* Populaire Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full border-2 border-white shadow-md">
              MOST POPULAR
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">The Premium Pass</span>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-brand-yellow font-mono">N3,000</span>
                <span className="text-slate-300 text-xs font-bold uppercase">/ cohort</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2.5 text-xs font-bold text-slate-100">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                  Full 90-day comprehensive syllabus
                </li>
                <li className="flex items-center gap-2.5 text-xs font-bold text-slate-100">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                  Expert video explanations
                </li>
                <li className="flex items-center gap-2.5 text-xs font-bold text-slate-100">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                  Every Essay checked by our AI & native tutor
                </li>
                <li className="flex items-center gap-2.5 text-xs font-bold text-slate-100">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                  Live terminal/voice practice
                </li>
                <li className="flex items-center gap-2.5 text-xs font-bold text-slate-100">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                  Verified Completion Certificate
                </li>
                <li className="flex items-center gap-2.5 text-xs font-bold text-slate-100">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3]" />
                  Personal mock scorer & assessor
                </li>
              </ul>
            </div>

            <button
              onClick={openSignupModal}
              className="w-full bg-brand-yellow hover:bg-amber-400 text-brand-blue font-extrabold text-xs md:text-sm py-4 rounded-xl shadow-lg transition-all text-center cursor-pointer"
            >
              Join Premium
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
