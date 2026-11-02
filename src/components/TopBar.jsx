import React from 'react';
import { Search, Bell, Plus, Command } from 'lucide-react';

export default function TopBar({
  userProfile,
  unreadNotificationsCount = 0,
  onAddTask,
  onSearch,
}) {
  const greeting = userProfile?.greeting_template
    ? userProfile.greeting_template.replace('{name}', userProfile.name)
    : `Hi, ${userProfile?.name || 'User'}!`;

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
      {/* Left: Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          {greeting} <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1 font-normal">
          {userProfile?.sub_greeting || 'What are your plans for today?'}
        </p>
      </div>

      {/* Right: Search Bar & Single '+ Add Task' Button */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1 sm:w-72 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks or commands..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 text-sm pl-10 pr-12 py-2.5 rounded-xl shadow-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-100 border border-slate-200/80 rounded-md text-[10px] font-medium text-slate-500 pointer-events-none">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Notifications Button */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 shadow-xs transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Main Single Action Button: + Add Task */}
        <button
          type="button"
          onClick={onAddTask}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-200 hover:shadow-md transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
}
