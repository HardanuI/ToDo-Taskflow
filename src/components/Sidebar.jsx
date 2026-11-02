import React from 'react';
import {
  LayoutGrid,
  CheckSquare,
  Users,
  Flag,
  Settings,
  HelpCircle,
  LogOut,
  Pencil,
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

export default function Sidebar({
  activeTab = 'dashboard',
  onSelectTab,
  appMeta,
  tasks = [],
}) {
  const { name, openEditModal } = useUserStore();
  const displayName = name.trim() ? name.trim() : 'Guest';

  const myTasksCount = tasks.filter((t) => t.type === 'personal' && !t.completed).length;
  const sharedCount = tasks.filter((t) => t.type === 'group' && !t.completed).length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High' && !t.completed).length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutGrid,
      count: null,
      iconColor: '',
    },
    {
      id: 'my_tasks',
      label: 'My Tasks',
      icon: CheckSquare,
      count: myTasksCount,
      iconColor: '',
    },
    {
      id: 'shared',
      label: 'Shared with Me (Grup)',
      icon: Users,
      count: sharedCount,
      iconColor: '',
    },
    {
      id: 'high_priority',
      label: 'High Priority',
      icon: Flag,
      count: highPriorityCount,
      iconColor: 'text-rose-500',
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col justify-between p-5 min-h-screen shrink-0 select-none transition-all">
      {/* Top Brand Logo */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-lg tracking-tight">
              {appMeta?.title || 'TaskFlow'}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Personal & Group Tasks
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
            Navigation
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab && onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    item.iconColor
                      ? item.iconColor
                      : isActive
                      ? 'text-indigo-600'
                      : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.count !== null && item.count > 0 && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                      item.id === 'high_priority'
                        ? 'bg-rose-100 text-rose-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                {isActive && item.count === null && (
                  <span className="ml-auto w-1.5 h-5 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Profile & Settings */}
      <div className="border-t border-slate-100 pt-4 space-y-2">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Help & Support</span>
        </button>

        {/* User Card with Name from useUserStore */}
        <div className="flex items-center gap-3 p-2 mt-2 bg-slate-50 rounded-2xl border border-slate-100 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center ring-2 ring-white shadow-xs shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {name ? `${displayName.toLowerCase().replace(/\s+/g, '')}@taskflow.app` : 'Local User'}
            </p>
          </div>
          <button
            type="button"
            onClick={openEditModal}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition-colors"
            title="Edit name"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
