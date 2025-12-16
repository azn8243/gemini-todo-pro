import { Flame, Zap, Target, Trophy } from 'lucide-react';
import { DailyStats } from '@/types/todo';

interface DailyGoalsProps {
  stats: DailyStats;
}

export const DailyGoals = ({ stats }: DailyGoalsProps) => {
  const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="glass-card p-4 mb-5 animate-fade-in-up hover-lift">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary animate-float" />
          <h2 className="text-lg font-semibold text-foreground">Daily Goals</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-500 ${
          percentage === 100 
            ? 'bg-gradient-primary text-primary-foreground animate-scale-bounce glow-primary' 
            : 'bg-primary/20 text-primary'
        }`}>
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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-secondary animate-pulse" />
            <span className="text-sm">
              <span className="text-secondary font-semibold">{stats.completed}</span>/{stats.total}
            </span>
          </div>
          {stats.totalCompleted > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
              <Trophy className="w-3 h-3 text-amber-400" />
              <span>{stats.totalCompleted} all-time</span>
            </div>
          )}
        </div>
        <div className="streak-badge">
          <Flame className={`w-4 h-4 ${stats.streak > 0 ? 'animate-wiggle' : ''}`} />
          <span>{stats.streak} Day Streak</span>
        </div>
      </div>
    </div>
  );
};
