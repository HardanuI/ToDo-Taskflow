import React from 'react';
import { Layers, CheckCircle2, Clock } from 'lucide-react';

export default function TaskStats({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed || t.progress === 100).length;
  const inProgress = total - completed;

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      subtext: 'Across all workspaces',
      icon: Layers,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
      accent: 'bg-indigo-600',
    },
    {
      label: 'Completed',
      value: completed,
      subtext: `${total > 0 ? Math.round((completed / total) * 100) : 0}% completion rate`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
      accent: 'bg-emerald-600',
    },
    {
      label: 'In Progress',
      value: inProgress,
      subtext: 'Pending actions required',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
      accent: 'bg-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {item.label}
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                {item.value}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {item.subtext}
              </p>
            </div>

            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${item.bg}`}
            >
              <Icon className={`w-6 h-6 ${item.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

