import React, { useState, useEffect } from 'react';
import { Sparkles, User, X } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

export default function SetupProfileModal() {
  const { name, isSetup, isEditModalOpen, setName, closeEditModal } = useUserStore();
  const [inputName, setInputName] = useState('');
  const [error, setError] = useState('');

  const isOpen = !isSetup || isEditModalOpen;

  useEffect(() => {
    if (isOpen) {
      setInputName(name || '');
      setError('');
    }
  }, [isOpen, name]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputName.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    setName(inputName.trim());
  };

  const isEditing = isSetup && isEditModalOpen;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md mx-4 p-6 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Icon & Close Button if editing */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={closeEditModal}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Title & Description */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {isEditing ? 'Edit Your Name' : 'Welcome to TaskFlow!'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isEditing
              ? 'Update how your name appears on your dashboard and workspace.'
              : 'Let’s personalize your dashboard experience to get you started.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              What should we call you?
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your name (e.g. Alex, James)"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={closeEditModal}
                className="flex-1 py-2.5 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              {isEditing ? 'Save Changes' : "Let's Go! 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

