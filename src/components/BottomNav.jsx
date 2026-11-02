import React from 'react';
import { LayoutGrid, CheckSquare, Users, Flag } from 'lucide-react';

export default function BottomNav({
  activeTab = 'dashboard',
  onSelectTab,
  tasks = [],
}) {
  const myTasksCount = tasks.filter((t) => t.type === 'personal' && !t.completed).length;
  const sharedCount = tasks.filter((t) => t.type === 'group' && !t.completed).length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'High' && !t.completed).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutGrid,
      count: null,
    },
    {
      id: 'my_tasks',
      label: 'My Tasks',
      icon: CheckSquare,
      count: myTasksCount,
    },
    {
      id: 'shared',
      label: 'Shared',
      icon: Users,
      count: sharedCount,
    },
    {
      id: 'high_priority',
      label: 'Priority',
      icon: Flag,
      count: highPriorityCount,
      isDanger: true,
    },
  ];

  return (
    <nav className="flex lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-2 shadow-lg justify-around items-center select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab && onSelectTab(item.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
              isActive
                ? 'text-indigo-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? 'text-indigo-600'
                    : item.isDanger
                    ? 'text-rose-500'
                    : 'text-slate-500'
                }`}
              />
              {item.count !== null && item.count > 0 && (
                <span
                  className={`absolute -top-1.5 -right-2 px-1 min-w-[14px] h-3.5 text-[9px] font-bold rounded-full flex items-center justify-center text-white ${
                    item.isDanger ? 'bg-rose-500' : 'bg-indigo-600'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

