import { useState, useEffect, useCallback } from 'react';
import { Task, Category, Priority, DailyStats } from '@/types/todo';
import { MILESTONES } from '@/components/MilestoneToast';

const TASKS_KEY = 'ai-todo-tasks';
const STATS_KEY = 'ai-todo-stats';

const getInitialTasks = (): Task[] => {
  const stored = localStorage.getItem(TASKS_KEY);
  if (stored) {
    // Migrate old tasks to include priority
    const tasks = JSON.parse(stored);
    return tasks.map((task: Task) => ({
      ...task,
      priority: task.priority || 'medium',
    }));
  }
  return [
    {
      id: '1',
      title: 'Review Q3 Design Mockups',
      category: 'Work',
      priority: 'high',
      time: '10:00 AM',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Grocery Shopping',
      category: 'Shopping',
      priority: 'medium',
      time: '5:00 PM',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Morning Standup',
      category: 'Work',
      priority: 'high',
      time: '9:30 AM',
      completed: true,
      completedAt: '9:30 AM',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Buy new shoes',
      category: 'Shopping',
      priority: 'low',
      time: '3:00 PM',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Team sync meeting',
      category: 'Work',
      priority: 'medium',
      time: '2:00 PM',
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];
};

const getInitialStats = (): DailyStats => {
  const stored = localStorage.getItem(STATS_KEY);
  if (stored) {
    const stats = JSON.parse(stored);
    const today = new Date().toDateString();
    const lastDate = stats.lastCompletedDate;
    
    // Migrate old stats
    const migratedStats = {
      ...stats,
      totalCompleted: stats.totalCompleted || stats.completed || 0,
      milestones: stats.milestones || [],
    };
    
    // Check if streak should reset (more than 1 day gap)
    if (lastDate) {
      const lastDateObj = new Date(lastDate);
      const todayObj = new Date(today);
      const diffDays = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        return { ...migratedStats, streak: 0 };
      }
    }
    return migratedStats;
  }
  return {
    completed: 1,
    total: 5,
    streak: 1,
    lastCompletedDate: new Date().toDateString(),
    totalCompleted: 1,
    milestones: [],
  };
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);
  const [stats, setStats] = useState<DailyStats>(getInitialStats);
  const [newMilestone, setNewMilestone] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    const completed = tasks.filter(t => t.completed).length;
    const today = new Date().toDateString();
    
    let newStreak = stats.streak;
    let newTotalCompleted = stats.totalCompleted;
    let newMilestones = [...stats.milestones];
    
    // Track total completions
    if (completed > stats.completed) {
      newTotalCompleted += (completed - stats.completed);
      
      // Check for new milestones
      const nextMilestone = MILESTONES.find(m => !newMilestones.includes(m) && newTotalCompleted >= m);
      if (nextMilestone) {
        newMilestones.push(nextMilestone);
        setNewMilestone(nextMilestone);
      }
    }
    
    // Update streak when completing tasks
    if (completed > stats.completed && completed > 0) {
      if (stats.lastCompletedDate !== today) {
        const lastDate = new Date(stats.lastCompletedDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak = stats.streak + 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      }
    }
    
    const newStats = { 
      completed, 
      total: tasks.length,
      streak: newStreak,
      lastCompletedDate: completed > 0 ? today : stats.lastCompletedDate,
      totalCompleted: newTotalCompleted,
      milestones: newMilestones,
    };
    setStats(newStats);
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  }, [tasks]);

  const addTask = useCallback((title: string, category: Category, time: string, priority: Priority = 'medium') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      category,
      priority,
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

  const clearMilestone = useCallback(() => {
    setNewMilestone(null);
  }, []);

  return {
    tasks,
    stats,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    setTasks,
    newMilestone,
    clearMilestone,
  };
};
