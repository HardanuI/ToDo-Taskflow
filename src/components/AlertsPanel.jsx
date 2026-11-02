import React from 'react';
import { AlertCircle, Clock, CheckCircle2, User, Users, Sparkles } from 'lucide-react';
import { parseISO, differenceInMinutes, isValid } from 'date-fns';

export default function AlertsPanel({ tasks = [] }) {
  const now = new Date();

  // Filter tasks: incomplete AND remaining time <= 6 hours (360 minutes)
  const urgentTasks = tasks
    .filter((task) => {
      if (task.completed || task.progress === 100) return false;
      if (!task.due_date) return false;

      try {
        const dueDate =
          typeof task.due_date === 'string'
            ? parseISO(task.due_date)
            : new Date(task.due_date);

        if (!isValid(dueDate)) return false;

        const minutesRemaining = differenceInMinutes(dueDate, now);
        // Within 6 hours (360 minutes). Also include overdue tasks that still need urgent attention.
        return minutesRemaining <= 360;
      } catch {
        return false;
      }
    })
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  const getRemainingTimeText = (dueDateStr) => {
    try {
      const dueDate =
        typeof dueDateStr === 'string'
          ? parseISO(dueDateStr)
          : new Date(dueDateStr);
      const minutes = differenceInMinutes(dueDate, now);

      if (minutes < 0) {
        const absMinutes = Math.abs(minutes);
        if (absMinutes < 60) {
          return `Overdue by ${absMinutes} min`;
        }
        const hours = Math.floor(absMinutes / 60);
        return `Overdue by ${hours} hr${hours > 1 ? 's' : ''}`;
      }

      if (minutes === 0) {
        return 'Due right now';
      }

      if (minutes < 60) {
        return `Due in ${minutes} minute${minutes > 1 ? 's' : ''}`;
      }

      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `Due in ${hours} hour${hours > 1 ? 's' : ''}`;
      }
      return `Due in ${hours}h ${remainingMinutes}m`;
    } catch {
      return 'Due soon';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <AlertCircle className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            Urgent Alerts (Next 6 Hours)
          </h3>
        </div>
        {urgentTasks.length > 0 && (
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-100">
            {urgentTasks.length} urgent
          </span>
        )}
      </div>

      {urgentTasks.length === 0 ? (
        <div className="py-8 px-4 text-center rounded-xl bg-slate-50/60 border border-dashed border-slate-200">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            You are all caught up! ✨
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            No pending tasks due within the next 6 hours.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {urgentTasks.map((task) => {
            const isGroup = task.type === 'group';
            const remainingText = getRemainingTimeText(task.due_date);
            const isOverdue = remainingText.startsWith('Overdue');

            return (
              <div
                key={task.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">
                    {task.title}
                  </h4>
                  {/* Badge: Personal (Blue) or Group (Purple) */}
                  {isGroup ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                      <Users className="w-3 h-3 text-purple-500" />
                      <span>{task.groupName || 'Group'}</span>
                    </span>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      <User className="w-3 h-3 text-blue-500" />
                      <span>Personal</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <div
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      isOverdue ? 'text-rose-600' : 'text-amber-600'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{remainingText}</span>
                  </div>

                  {task.priority === 'High' && (
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                      HIGH
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

