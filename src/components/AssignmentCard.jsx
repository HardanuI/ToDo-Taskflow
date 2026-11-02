import React from 'react';
import { Sparkles, Calendar, Tag, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export default function AssignmentCard({ assignment }) {
  if (!assignment) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
              {assignment.project}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              • {assignment.category}
            </span>
          </div>

          <span
            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${
              assignment.priority === 'High'
                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                : 'bg-amber-50 text-amber-600 border border-amber-100'
            }`}
          >
            {assignment.priority} Priority
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
          {assignment.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {assignment.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium"
            >
              <Tag className="w-3 h-3 text-slate-400" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          {/* Assignee */}
          <div className="flex items-center gap-2.5">
            <img
              src={assignment.avatar}
              alt={assignment.assignee}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-50"
            />
            <div>
              <p className="text-xs font-semibold text-slate-800">
                {assignment.assignee}
              </p>
              <p className="text-[11px] text-slate-400">Assigned Lead</p>
            </div>
          </div>

          {/* Due Date & Action */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 justify-end">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Due {formatDate(assignment.due_date, 'dd MMM yyyy')}</span>
            </div>
            <span className="text-[11px] text-indigo-600 font-medium capitalize">
              {assignment.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

