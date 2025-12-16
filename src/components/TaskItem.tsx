import { Check, Trash2, Clock, ChevronRight, Flag, AlertCircle, ArrowDown } from 'lucide-react';
import { Task, Priority } from '@/types/todo';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (task: Task) => void;
  index: number;
}

const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Work':
      return { text: 'text-secondary', bg: 'bg-secondary/20', glow: 'glow-secondary' };
    case 'Shopping':
      return { text: 'text-accent', bg: 'bg-accent/20', glow: 'glow-accent' };
    case 'Personal':
      return { text: 'text-[hsl(280,70%,55%)]', bg: 'bg-[hsl(280,70%,55%)]/20', glow: '' };
    default:
      return { text: 'text-muted-foreground', bg: 'bg-muted/20', glow: '' };
  }
};

const getPriorityConfig = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return { 
        icon: AlertCircle, 
        color: 'text-red-400', 
        bg: 'bg-red-400/20', 
        label: 'High',
        border: 'border-l-red-400'
      };
    case 'medium':
      return { 
        icon: Flag, 
        color: 'text-amber-400', 
        bg: 'bg-amber-400/20', 
        label: 'Med',
        border: 'border-l-amber-400'
      };
    case 'low':
      return { 
        icon: ArrowDown, 
        color: 'text-emerald-400', 
        bg: 'bg-emerald-400/20', 
        label: 'Low',
        border: 'border-l-emerald-400'
      };
  }
};

export const TaskItem = ({ task, onToggle, onDelete, onSelect, index }: TaskItemProps) => {
  const categoryStyles = getCategoryStyles(task.category);
  const priorityConfig = getPriorityConfig(task.priority || 'medium');
  const PriorityIcon = priorityConfig.icon;
  
  return (
    <div 
      className={`glass-card p-4 mb-3 animate-fade-in-up hover-lift group border-l-4 ${priorityConfig.border}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 mt-0.5 hover:scale-110 ${
            task.completed
              ? 'checkbox-complete border-transparent'
              : 'border-muted-foreground/40 hover:border-secondary hover:shadow-lg'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 text-secondary-foreground animate-scale-in" />}
        </button>

        <button
          onClick={() => onSelect(task)}
          className="flex-1 min-w-0 text-left group/text"
        >
          <div className="flex items-center gap-2">
            <h3 
              className={`text-base font-medium transition-all duration-300 break-words ${
                task.completed ? 'task-completed text-muted-foreground' : 'text-foreground group-hover/text:text-primary'
              }`}
            >
              {task.title}
            </h3>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryStyles.bg} ${categoryStyles.text}`}>
              {task.category}
            </span>
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${priorityConfig.bg} ${priorityConfig.color} flex items-center gap-0.5`}>
              <PriorityIcon className="w-3 h-3" />
              {priorityConfig.label}
            </span>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {task.completed ? `Done ${task.completedAt}` : task.time}
              </span>
            </div>
          </div>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="p-1.5 text-muted-foreground/40 hover:text-destructive hover:scale-110 transition-all duration-300 flex-shrink-0 opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
