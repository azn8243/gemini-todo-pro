import { useState, useEffect, useCallback } from 'react';
import { Task, Category, DailyStats } from '@/types/todo';

const TASKS_KEY = 'ai-todo-tasks';
const STATS_KEY = 'ai-todo-stats';

const getInitialTasks = (): Task[] => {
  const stored = localStorage.getItem(TASKS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    {
      id: '1',
      title: 'Review Q3 Design Mockups',
      category: 'Work',
      time: '10:00 AM',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Grocery Shopping',
      category: 'Shopping',
      time: '5:00 PM',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Morning Standup',
      category: 'Work',
      time: '9:30 AM',
      completed: true,
      completedAt: '9:30 AM',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Buy new shoes',
      category: 'Shopping',
      time: '3:00 PM',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Team sync meeting',
      category: 'Work',
      time: '2:00 PM',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];
};

const getInitialStats = (): DailyStats => {
  const stored = localStorage.getItem(STATS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    completed: 1,
    total: 5,
    streak: 3,
    lastCompletedDate: new Date().toDateString(),
  };
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);
  const [stats, setStats] = useState<DailyStats>(getInitialStats);

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    const completed = tasks.filter(t => t.completed).length;
    const newStats = { ...stats, completed, total: tasks.length };
    setStats(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  }, [tasks]);

  const addTask = useCallback((title: string, category: Category, time: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      category,
      time,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? timeStr : undefined,
        };
      }
      return task;
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  }, []);

  return {
    tasks,
    stats,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    setTasks,
  };
};
