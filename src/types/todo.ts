export type Category = 'Work' | 'Personal' | 'Shopping';

export interface Task {
  id: string;
  title: string;
  category: Category;
  time: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  notes?: string;
}

export interface DailyStats {
  completed: number;
  total: number;
  streak: number;
  lastCompletedDate: string;
}
