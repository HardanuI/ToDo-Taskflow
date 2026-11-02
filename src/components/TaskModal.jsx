import React, { useState, useEffect } from 'react';
import { X, User, Users, Flag, Calendar, AlertCircle } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

export default function TaskModal({ isOpen, onClose, onSave, editingTask = null }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState('personal'); // 'personal' | 'group'
  const [groupName, setGroupName] = useState('');
  const [priority, setPriority] = useState('Medium'); // 'High' | 'Medium' | 'Low'
  const [error, setError] = useState('');

  // Pre-populate fields when in edit mode
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setType(editingTask.type || 'personal');
      setGroupName(editingTask.groupName || '');
      setPriority(editingTask.priority || 'Medium');

      if (editingTask.due_date) {
        try {
          const date =
            typeof editingTask.due_date === 'string'
              ? parseISO(editingTask.due_date)
              : new Date(editingTask.due_date);
          if (isValid(date)) {
            setDueDate(format(date, "yyyy-MM-dd'T'HH:mm"));
          } else {
            setDueDate('');
          }
        } catch {
          setDueDate('');
        }
      } else {
        setDueDate('');
      }
    } else {
      // Reset to defaults
      setTitle('');
      setDueDate('');
      setType('personal');
      setGroupName('');
      setPriority('Medium');
      setError('');
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }
    if (!dueDate) {
      setError('Due date & time is required.');
      return;
    }
    if (type === 'group' && !groupName.trim()) {
      setError('Group name is required for group tasks.');
      return;
    }

    setError('');
    const taskPayload = {
      title: title.trim(),
      due_date: new Date(dueDate).toISOString(),
      start_time: editingTask ? editingTask.start_time : new Date().toISOString(),
      type,
      groupName: type === 'group' ? groupName.trim() : '',
      priority,
    };

    onSave(taskPayload, editingTask?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            <p className="text-xs text-slate-500">
              {editingTask
                ? 'Update task details and assignments'
                : 'Create a personal or team collaborative task'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Conduct usability testing on checkout flow"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Due Date & Time */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Due Date & Time <span className="text-rose-500">*</span>
              </span>
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Task Type (Radio: Personal vs Group) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Task Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  type === 'personal'
                    ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-indigo-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="taskType"
                  value="personal"
                  checked={type === 'personal'}
                  onChange={() => setType('personal')}
                  className="sr-only"
                />
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    type === 'personal'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm block">Personal</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    For yourself
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  type === 'group'
                    ? 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20 text-purple-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="taskType"
                  value="group"
                  checked={type === 'group'}
                  onChange={() => setType('group')}
                  className="sr-only"
                />
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    type === 'group'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm block">Group</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    Team project
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Group Name (Visible only when 'Group' is selected) */}
          {type === 'group' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Group Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Tim Marketing, Product Engineering"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              <span>Priority Level</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { level: 'High', color: 'border-rose-300 bg-rose-50 text-rose-700' },
                {
                  level: 'Medium',
                  color: 'border-amber-300 bg-amber-50 text-amber-700',
                },
                { level: 'Low', color: 'border-slate-300 bg-slate-100 text-slate-700' },
              ].map((p) => {
                const isSelected = priority === p.level;
                return (
                  <button
                    key={p.level}
                    type="button"
                    onClick={() => setPriority(p.level)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                      isSelected
                        ? `${p.color} ring-2 ring-indigo-500/20 shadow-xs font-bold`
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p.level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              {editingTask ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
