import { Flame } from 'lucide-react';
import { DailyStats } from '@/types/todo';

interface DailyGoalsProps {
  stats: DailyStats;
}

export const DailyGoals = ({ stats }: DailyGoalsProps) => {
  const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="glass-card p-4 mb-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-foreground">Daily Goals</h2>
        <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
          {percentage}% Done
        </span>
      </div>
      
      <div className="progress-bar mb-3">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-sm">
          {stats.completed}/{stats.total} Tasks Completed
        </span>
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-accent" />
          <span className="text-sm">{stats.streak} Day Streak</span>
        </div>
      </div>
    </div>
  );
};
