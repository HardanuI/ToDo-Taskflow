import React from 'react';
import { Bell, Calendar, MessageSquare, ExternalLink } from 'lucide-react';
import { formatDateTime, formatDate, formatTimeRange } from '../utils/dateUtils';

export default function NotificationsPanel({ notifications = [] }) {
  if (!notifications.length) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">Updates & Alerts</h3>
        </div>
        <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-medium">
          Mark all read
        </span>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const isEvent = notif.type === 'event';

          return (
            <div
              key={notif.id}
              className={`p-3.5 rounded-xl border transition-all ${
                !notif.is_read
                  ? 'bg-slate-50/70 border-slate-200/80'
                  : 'bg-white border-slate-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {isEvent ? (
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                ) : (
                  <img
                    src={notif.avatar || 'https://i.pravatar.cc/150?img=5'}
                    alt="avatar"
                    className="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {notif.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {notif.start_time
                        ? formatDateTime(notif.start_time, 'dd MMM, HH:mm')
                        : formatDate(notif.created_at, 'dd MMM')}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">
                    {notif.content}
                  </p>

                  {isEvent && (
                    <div className="mt-1 text-xs text-indigo-600 font-medium">
                      Time: {formatTimeRange(notif.start_time, notif.end_time)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

