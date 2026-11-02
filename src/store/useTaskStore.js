import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Default initial tasks
const getInitialTasks = () => {
  const now = new Date();
  
  // Urgent task due in 2 hours
  const urgentDue = new Date(now.getTime() + 2 * 3600 * 1000).toISOString();
  // Tomorrow
  const tomorrowDue = new Date(now.getTime() + 24 * 3600 * 1000).toISOString();
  // In 3 days
  const futureDue = new Date(now.getTime() + 3 * 24 * 3600 * 1000).toISOString();

  return [
    {
      id: 'task_1',
      title: 'Conduct research for new dashboard UI',
      type: 'group',
      groupName: 'Tim Product',
      priority: 'High',
      start_time: new Date().toISOString(),
      due_date: urgentDue,
      completed: false,
      assignees: [1, 2, 3],
      comments: 4,
      attachments: 2,
      created_at: new Date(now.getTime() - 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'task_2',
      title: 'Schedule quarterly sync meeting',
      type: 'personal',
      groupName: '',
      priority: 'Medium',
      start_time: new Date().toISOString(),
      due_date: tomorrowDue,
      completed: false,
      assignees: [1, 4],
      comments: 4,
      attachments: 3,
      created_at: new Date(now.getTime() - 48 * 3600 * 1000).toISOString(),
    },
    {
      id: 'task_3',
      title: 'Send out weekly reminder emails',
      type: 'group',
      groupName: 'Tim Marketing',
      priority: 'Low',
      start_time: new Date().toISOString(),
      due_date: futureDue,
      completed: true,
      assignees: [1, 5, 6],
      comments: 16,
      attachments: 3,
      created_at: new Date(now.getTime() - 72 * 3600 * 1000).toISOString(),
    },
    {
      id: 'task_4',
      title: 'Finalize branding guidelines & color palettes',
      type: 'personal',
      groupName: '',
      priority: 'High',
      start_time: new Date().toISOString(),
      due_date: new Date(now.getTime() + 4 * 3600 * 1000).toISOString(),
      completed: false,
      assignees: [1],
      comments: 2,
      attachments: 1,
      created_at: new Date().toISOString(),
    },
  ];
};

export const useTaskStore = create(
  persist(
    (set) => ({
      tasks: getInitialTasks(),
      activeSidebarTab: 'dashboard',
      isTaskModalOpen: false,
      editingTask: null,

      // Actions
      setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),

      openTaskModal: (task = null) =>
        set({ isTaskModalOpen: true, editingTask: task }),

      closeTaskModal: () =>
        set({ isTaskModalOpen: false, editingTask: null }),

      addTask: (newTask) =>
        set((state) => ({
          tasks: [
            {
              id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              completed: false,
              assignees: [1],
              comments: 0,
              attachments: 0,
              created_at: new Date().toISOString(),
              ...newTask,
            },
            ...state.tasks,
          ],
        })),

      updateTask: (taskId, updatedData) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, ...updatedData, updated_at: new Date().toISOString() }
              : task
          ),
        })),

      toggleTaskCompletion: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                completed: !task.completed,
              };
            }
            return task;
          }),
        })),

      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        })),
    }),
    {
      name: 'taskflow-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
