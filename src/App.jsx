import React, { useState } from 'react';
import dashboardConfig from './data/dashboard-config.json';
import { useTaskStore } from './store/useTaskStore';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import TaskStats from './components/TaskStats';
import TaskList from './components/TaskList';
import CalendarPanel from './components/CalendarPanel';
import HighPriorityPanel from './components/HighPriorityPanel';
import AlertsPanel from './components/AlertsPanel';
import TaskModal from './components/TaskModal';
import SetupProfileModal from './components/SetupProfileModal';
import BottomNav from './components/BottomNav';

export default function App() {
  const {
    tasks,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    activeSidebarTab,
    setActiveSidebarTab,
    isTaskModalOpen,
    editingTask,
    openTaskModal,
    closeTaskModal,
  } = useTaskStore();

  const [searchQuery, setSearchQuery] = useState('');

  const { app_meta } = dashboardConfig;

  // Filter tasks if user is searching in TopBar
  const searchedTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveTask = (taskPayload, editId) => {
    if (editId) {
      updateTask(editId, taskPayload);
    } else {
      addTask(taskPayload);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* 1. SIDEBAR (Desktop: visible, Mobile: hidden) */}
      <Sidebar
        activeTab={activeSidebarTab}
        onSelectTab={setActiveSidebarTab}
        appMeta={app_meta}
        tasks={tasks}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
          {/* Header / TopBar */}
          <TopBar
            unreadNotificationsCount={
              tasks.filter((t) => !t.completed && t.priority === 'High').length
            }
            onAddTask={() => openTaskModal(null)}
            onSearch={setSearchQuery}
          />

          {/* Task Statistics (Total, Completed, In Progress) - 1 col on mobile, 3 cols on tablet/desktop */}
          <section aria-label="Task Statistics">
            <TaskStats tasks={tasks} />
          </section>

          {/* Main Content Grid: 2 Columns on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column (High Priority Focus + Task List) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* High Priority Focus Panel (Synchronized from Zustand) */}
              <HighPriorityPanel
                tasks={tasks}
                onToggleTask={toggleTaskCompletion}
              />

              {/* Task List with Filter Tabs & Checkbox UX */}
              <TaskList
                tasks={searchedTasks}
                sidebarFilter={activeSidebarTab}
                onSelectSidebarTab={setActiveSidebarTab}
                onToggleTask={toggleTaskCompletion}
                onEditTask={(task) => openTaskModal(task)}
                onDeleteTask={deleteTask}
                onAddTask={() => openTaskModal(null)}
              />
            </div>

            {/* Right Column (Dynamic Calendar + Alerts Panel <= 6 Jam) */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              {/* Interactive Calendar Panel */}
              <CalendarPanel tasks={tasks} />

              {/* Alerts / Urgent Reminders (Tasks <= 6 Hours) */}
              <AlertsPanel tasks={tasks} />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile screens) */}
      <BottomNav
        activeTab={activeSidebarTab}
        onSelectTab={setActiveSidebarTab}
        tasks={tasks}
      />

      {/* Task Creation / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        editingTask={editingTask}
        onClose={closeTaskModal}
        onSave={handleSaveTask}
      />

      {/* FASE 1: Setup Profile Modal (Welcome modal when isSetup is false or when editing name) */}
      <SetupProfileModal />
    </div>
  );
}
