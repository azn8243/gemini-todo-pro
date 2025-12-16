export type Category = 'Work' | 'Personal' | 'Shopping';
export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  time: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  notes?: string;
  dueDate?: string;
}

export interface DailyStats {
  completed: number;
  total: number;
  streak: number;
  lastCompletedDate: string;
  totalCompleted: number; // All-time completed tasks
  milestones: number[]; // Achieved milestones
}

export interface AppSettings {
  soundEnabled: boolean;
  celebrationsEnabled: boolean;
}
