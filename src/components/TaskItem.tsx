import { Check, Trash2, Clock } from 'lucide-react';
import { Task } from '@/types/todo';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Work':
      return 'text-secondary';
    case 'Shopping':
      return 'text-accent';
    case 'Personal':
      return 'text-[hsl(280,70%,55%)]';
    default:
      return 'text-muted-foreground';
  }
};

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  return (
    <div className="glass-card p-4 mb-3 animate-fade-in">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 ${
            task.completed
              ? 'bg-secondary border-secondary'
              : 'border-muted-foreground/40 hover:border-secondary'
          }`}
        >
          {task.completed && <Check className="w-3.5 h-3.5 text-secondary-foreground" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3 
            className={`text-base font-medium transition-all duration-200 break-words ${
              task.completed ? 'task-completed text-muted-foreground' : 'text-foreground'
            }`}
          >
            {task.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-sm font-medium ${getCategoryColor(task.category)}`}>
              {task.category}
            </span>
            <span className="text-muted-foreground/40">•</span>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {task.completed ? `Completed ${task.completedAt}` : task.time}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-muted-foreground/40 hover:text-destructive transition-colors flex-shrink-0"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
