import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function AnalyticsPanel({ analytics = [] }) {
  if (!analytics.length) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <h3 className="font-bold text-slate-900 text-base">Performance</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">Weekly Goal</span>
      </div>

      <div className="space-y-4">
        {analytics.map((item) => {
          const isGreen = item.color === 'green';

          return (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">{item.label}</span>
                <span className={isGreen ? 'text-emerald-600' : 'text-rose-500'}>
                  {item.percentage}%
                </span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isGreen ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

