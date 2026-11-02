import React from 'react';
import { Flag, Clock, User, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatDateTime } from '../utils/dateUtils';

export default function HighPriorityPanel({
  tasks = [],
  onToggleTask,
  onSelectTask,
}) {
  // Filter: priority === 'High' and status belum selesai (!completed)
  const highPriorityTasks = tasks
    .filter((task) => task.priority === 'High' && !task.completed)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  if (highPriorityTasks.length === 0) {
    return null; // Clean dashboard when no urgent high priority tasks exist
  }

  const primaryTask = highPriorityTasks[0];
  const isGroup = primaryTask.type === 'group';

  return (
    <div className="bg-gradient-to-r from-rose-50/90 via-white to-white rounded-2xl p-6 border border-rose-200/80 shadow-xs relative overflow-hidden transition-all">
      {/* Decorative accent element */}
      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-rose-500 rounded-l-2xl" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 tracking-wide uppercase">
              <Flag className="w-3 h-3 fill-rose-600 text-rose-600" />
              <span>High Priority Focus</span>
            </span>

            {highPriorityTasks.length > 1 && (
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                +{highPriorityTasks.length - 1} more pending
              </span>
            )}

            {isGroup ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                <Users className="w-3 h-3 text-purple-500" />
                <span>Group: {primaryTask.groupName || 'Team'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <User className="w-3 h-3 text-blue-500" />
                <span>Personal</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 leading-snug truncate">
            {primaryTask.title}
          </h3>

          {/* Due date */}
          <div className="flex items-center gap-2 text-xs text-rose-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            <span>
              Deadline: {formatDateTime(primaryTask.due_date, 'dd MMM yyyy, HH:mm')}
            </span>
          </div>
        </div>

        {/* Quick Complete Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onToggleTask && onToggleTask(primaryTask.id)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Complete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

