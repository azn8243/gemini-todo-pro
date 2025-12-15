import { Task, Category } from '@/types/todo';
import { TaskItem } from './TaskItem';

type FilterOption = 'All' | Category;

interface TaskListProps {
  tasks: Task[];
  filter: FilterOption;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (task: Task) => void;
}

export const TaskList = ({ tasks, filter, onToggle, onDelete, onSelect }: TaskListProps) => {
  const filteredTasks = filter === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === filter);

  const incompleteTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  return (
    <div className="pb-24">
      <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4 animate-fade-in flex items-center gap-2" style={{ animationDelay: '0.2s' }}>
        <span className="w-8 h-0.5 bg-gradient-primary rounded-full"></span>
        Today's Tasks
      </h2>
      
      {incompleteTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="glass-card p-8 text-center animate-fade-in-up">
          <p className="text-muted-foreground">No tasks yet. Add one to get started!</p>
        </div>
      ) : (
        <>
          {incompleteTasks.map((task, index) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={onToggle}
              onDelete={onDelete}
              onSelect={onSelect}
              index={index}
            />
          ))}
          {completedTasks.map((task, index) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={onToggle}
              onDelete={onDelete}
              onSelect={onSelect}
              index={incompleteTasks.length + index}
            />
          ))}
        </>
      )}
    </div>
  );
};
