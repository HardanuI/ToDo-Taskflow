import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function PromoCard({ promo }) {
  if (!promo) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6 text-white shadow-lg shadow-indigo-200">
      {/* Decorative blurred circles */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
            Premium Plan
          </span>
        </div>

        <h3 className="text-xl font-bold mb-2 tracking-tight">
          {promo.title}
        </h3>
        <p className="text-xs text-indigo-100/90 leading-relaxed mb-5">
          {promo.description}
        </p>

        <button
          type="button"
          className="group inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white text-indigo-700 text-xs font-bold rounded-xl shadow-md hover:bg-indigo-50 active:scale-[0.98] transition-all"
        >
          <span>{promo.button_text || 'Find out more'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

