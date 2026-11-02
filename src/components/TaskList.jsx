import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  User,
  Users,
  Flag,
  Plus,
  Coffee,
} from 'lucide-react';
import { formatDateTime } from '../utils/dateUtils';

export default function TaskList({
  tasks = [],
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
  sidebarFilter = 'dashboard',
  onSelectSidebarTab,
}) {
  const [tabFilter, setTabFilter] = useState('all'); // 'all' | 'personal' | 'group'
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When sidebarFilter changes, sync tabFilter if appropriate
  useEffect(() => {
    if (sidebarFilter === 'my_tasks') {
      setTabFilter('personal');
    } else if (sidebarFilter === 'shared') {
      setTabFilter('group');
    } else if (sidebarFilter === 'dashboard') {
      // Keep or default to all
    }
  }, [sidebarFilter]);

  // Handle user clicking tabs
  const handleTabChange = (newTab) => {
    setTabFilter(newTab);
    // If user clicked 'personal' while on 'shared' or vice versa, reset sidebar to dashboard or sync
    if (sidebarFilter === 'my_tasks' && newTab !== 'personal') {
      if (onSelectSidebarTab) onSelectSidebarTab('dashboard');
    } else if (sidebarFilter === 'shared' && newTab !== 'group') {
      if (onSelectSidebarTab) onSelectSidebarTab('dashboard');
    } else if (sidebarFilter === 'high_priority') {
      if (onSelectSidebarTab) onSelectSidebarTab('dashboard');
    }
  };

  // 1. Filter logic
  const filteredTasks = tasks.filter((task) => {
    // Sidebar specific filter
    if (sidebarFilter === 'my_tasks' && task.type !== 'personal') return false;
    if (sidebarFilter === 'shared' && task.type !== 'group') return false;
    if (sidebarFilter === 'high_priority' && (task.priority !== 'High' || task.completed)) {
      return false;
    }

    // Tab filter
    if (tabFilter === 'personal' && task.type !== 'personal') return false;
    if (tabFilter === 'group' && task.type !== 'group') return false;

    return true;
  });

  // 2. Sort logic: Active (incomplete) tasks first, Completed tasks at the bottom
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed === b.completed) {
      // Secondary sort: High priority first, then date
      if (a.priority === 'High' && b.priority !== 'High') return -1;
      if (b.priority === 'High' && a.priority !== 'High') return 1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return Number(a.completed) - Number(b.completed);
  });

  const getSectionTitle = () => {
    if (sidebarFilter === 'my_tasks') return 'My Personal Tasks';
    if (sidebarFilter === 'shared') return 'Shared Group Tasks';
    if (sidebarFilter === 'high_priority') return 'High Priority Tasks (Active)';
    if (tabFilter === 'personal') return 'Personal Tasks';
    if (tabFilter === 'group') return 'Group Tasks';
    return "Today's Tasks";
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
      {/* Header with Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {getSectionTitle()}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600">
            {filteredTasks.length}
          </span>
        </div>

        {/* Tab Filters (All, Personal, Groups) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            {[
              { id: 'all', label: 'All' },
              { id: 'personal', label: 'Personal' },
              { id: 'group', label: 'Groups' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  tabFilter === tab.id
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onAddTask}
            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="Add task"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Task List or Empty State */}
      {sortedTasks.length === 0 ? (
        <div className="py-14 px-6 text-center rounded-2xl bg-slate-50/50 border border-dashed border-slate-200">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
            <Coffee className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            You're all caught up! ✨
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No tasks found in this view. Enjoy your break or create a new task to get
            started.
          </p>
          <button
            type="button"
            onClick={onAddTask}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Task</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3" ref={menuRef}>
          {sortedTasks.map((task) => {
            const isCompleted = Boolean(task.completed);
            const isHighPriority = task.priority === 'High';
            const isGroup = task.type === 'group';
            const isMenuOpen = activeMenuId === task.id;

            return (
              <div
                key={task.id}
                className={`group relative p-4 rounded-xl border transition-all duration-200 ${
                  isCompleted
                    ? 'bg-slate-50/60 border-slate-100 opacity-75'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* UX Checklist Button */}
                    <button
                      type="button"
                      onClick={() => onToggleTask && onToggleTask(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-transform active:scale-90 shrink-0"
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 hover:text-indigo-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* Title & Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {/* Type Badge: Personal (Blue) or Group (Purple) */}
                        {isGroup ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            <Users className="w-3 h-3 text-purple-500" />
                            <span>Group: {task.groupName || 'Team'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <User className="w-3 h-3 text-blue-500" />
                            <span>Personal</span>
                          </span>
                        )}

                        {/* Completed Status Tag */}
                        {isCompleted && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-wider">
                            Completed
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm font-semibold truncate transition-colors ${
                          isCompleted
                            ? 'line-through text-slate-400'
                            : 'text-slate-900 group-hover:text-indigo-600'
                        }`}
                      >
                        {task.title}
                      </h4>

                      {/* Due date info */}
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          Due {formatDateTime(task.due_date, 'dd MMM yyyy, HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Right Badges & Dropdown More Options */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* High Priority Badge in Top Right Corner */}
                    {isHighPriority && !isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-200 uppercase tracking-wider">
                        <Flag className="w-3 h-3 fill-rose-500 text-rose-500" />
                        <span>High Priority</span>
                      </span>
                    )}

                    {/* Three Dots More Options Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : task.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-8 z-30 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 animate-in fade-in zoom-in-95 duration-150">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(null);
                              if (onEditTask) onEditTask(task);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(null);
                              if (onDeleteTask) onDeleteTask(task.id);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
