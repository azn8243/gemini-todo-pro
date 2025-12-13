import { Task, Category } from '@/types/todo';
import { TaskItem } from './TaskItem';

type FilterOption = 'All' | Category;

interface TaskListProps {
  tasks: Task[];
  filter: FilterOption;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskList = ({ tasks, filter, onToggle, onDelete }: TaskListProps) => {
  const filteredTasks = filter === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === filter);

  const incompleteTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  return (
    <div className="pb-24">
      <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4">
        Today's Tasks
      </h2>
      
      {incompleteTasks.length === 0 && completedTasks.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground">No tasks yet. Add one to get started!</p>
        </div>
      ) : (
        <>
          {incompleteTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
          {completedTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </>
      )}
    </div>
  );
};
