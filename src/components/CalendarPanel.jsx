import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  User,
  Users,
  Flag,
} from 'lucide-react';
import {
  format,
  startOfWeek,
  addDays,
  subWeeks,
  addWeeks,
  isToday,
  isSameDay,
  parseISO,
  isValid,
} from 'date-fns';
import { formatTime } from '../utils/dateUtils';

export default function CalendarPanel({ tasks = [] }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate 7 days for the active week starting Monday
  const weekStart = startOfWeek(viewDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Navigate weeks
  const handlePrevWeek = () => setViewDate((prev) => subWeeks(prev, 1));
  const handleNextWeek = () => setViewDate((prev) => addWeeks(prev, 1));
  const handleJumpToToday = () => {
    const today = new Date();
    setViewDate(today);
    setSelectedDate(today);
  };

  // Find tasks due on a given day
  const getTasksForDay = (day) => {
    return tasks.filter((t) => {
      if (!t.due_date) return false;
      try {
        const d =
          typeof t.due_date === 'string' ? parseISO(t.due_date) : new Date(t.due_date);
        return isValid(d) && isSameDay(d, day);
      } catch {
        return false;
      }
    });
  };

  // Tasks due on the selected date
  const selectedDateTasks = getTasksForDay(selectedDate);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
      <div>
        {/* Calendar Header with Dynamic Month & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-4 sm:w-5 h-4 sm:h-5 text-indigo-600" />
              <span>{format(viewDate, 'MMMM yyyy')}</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
              Interactive Deadline Calendar
            </p>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={handleJumpToToday}
              className="px-2 sm:px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors mr-0.5 sm:mr-1"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handlePrevWeek}
              className="p-1 sm:p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Previous week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextWeek}
              className="p-1 sm:p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Next week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of the Week Selector */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 p-1 bg-slate-50/70 rounded-2xl border border-slate-100 mb-5 sm:mb-6">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrent = isToday(day);
            const dayTasks = getTasksForDay(day);
            const hasDeadlines = dayTasks.length > 0;
            const hasHighPriority = dayTasks.some(
              (t) => t.priority === 'High' && !t.completed
            );

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={`relative flex flex-col items-center py-2.5 px-1 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300 scale-102 font-bold'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                } ${isCurrent && !isSelected ? 'ring-2 ring-indigo-500/30' : ''}`}
              >
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${
                    isSelected ? 'text-indigo-100' : 'text-slate-400'
                  }`}
                >
                  {format(day, 'EEE')}
                </span>
                <span className="text-sm font-bold">{format(day, 'd')}</span>

                {/* Deadlines indicator dot */}
                {hasDeadlines && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                      isSelected
                        ? 'bg-white'
                        : hasHighPriority
                        ? 'bg-rose-500 animate-pulse'
                        : 'bg-indigo-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Deadlines on Selected Date */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Deadlines for {format(selectedDate, 'dd MMM yyyy')}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {selectedDateTasks.length === 0 ? (
            <div className="py-6 px-4 text-center rounded-xl bg-slate-50/50 border border-dashed border-slate-200 text-slate-400 text-xs">
              No task deadlines scheduled for this date.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {selectedDateTasks.map((task) => {
                const isGroup = task.type === 'group';
                const isCompleted = Boolean(task.completed);

                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-slate-50 border-slate-100 opacity-70'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0">
                          <h5
                            className={`text-xs font-semibold truncate ${
                              isCompleted
                                ? 'line-through text-slate-400'
                                : 'text-slate-800'
                            }`}
                          >
                            {task.title}
                          </h5>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{formatTime(task.due_date)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isGroup ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-100 font-medium">
                            Group
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 font-medium">
                            Personal
                          </span>
                        )}

                        {task.priority === 'High' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 font-bold border border-rose-100">
                            High
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
