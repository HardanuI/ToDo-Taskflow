import React from 'react';
import { Calendar, Smartphone, Users, ArrowUpRight } from 'lucide-react';

const iconMap = {
  CalendarIcon: Calendar,
  DeviceMobile: Smartphone,
  Users: Users,
};

const cardTheme = [
  {
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    iconBg: 'bg-amber-100 text-amber-600',
    border: 'hover:border-amber-200',
    accent: 'text-amber-600',
  },
  {
    gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-indigo-100 text-indigo-600',
    border: 'hover:border-indigo-200',
    accent: 'text-indigo-600',
  },
  {
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-emerald-100 text-emerald-600',
    border: 'hover:border-emerald-200',
    accent: 'text-emerald-600',
  },
];

export default function QuickAccessCards({ cards = [] }) {
  if (!cards.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {cards.map((card, index) => {
        const Icon = iconMap[card.icon] || Calendar;
        const theme = cardTheme[index % cardTheme.length];

        return (
          <div
            key={card.id}
            className={`group relative overflow-hidden bg-white border border-slate-150 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 ${theme.border} cursor-pointer flex flex-col justify-between`}
          >
            {/* Ambient subtle glow background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity`}
            />

            <div className="relative z-10 flex items-start justify-between">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${theme.iconBg} shadow-xs`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="relative z-10 mt-5">
              <h3 className="font-semibold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

