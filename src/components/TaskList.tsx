import { Task, Category } from '@/types/todo';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';

type FilterOption = 'All' | Category;

interface TaskListProps {
  tasks: Task[];
  filter: FilterOption;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (task: Task) => void;
  searchQuery?: string;
}

export const TaskList = ({ tasks, filter, onToggle, onDelete, onSelect, searchQuery = '' }: TaskListProps) => {
  // Tasks are already filtered in Index.tsx, no need to filter again
  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const getEmptyType = () => {
    if (searchQuery) return 'no-results';
    if (tasks.length === 0 && filter === 'All') return 'no-tasks';
    if (incompleteTasks.length === 0 && completedTasks.length > 0) return 'all-done';
    return 'no-tasks';
  };

  return (
    <div className="pb-24">
      <h2 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-4 animate-fade-in flex items-center gap-2" style={{ animationDelay: '0.2s' }}>
        <span className="w-8 h-0.5 bg-gradient-primary rounded-full"></span>
        Today's Tasks
        {tasks.length > 0 && (
          <span className="ml-auto text-xs font-normal text-muted-foreground/70">
            {incompleteTasks.length} remaining
          </span>
        )}
      </h2>
      
      {tasks.length === 0 ? (
        <EmptyState type={getEmptyType()} searchQuery={searchQuery} />
      ) : incompleteTasks.length === 0 && completedTasks.length > 0 ? (
        <>
          <EmptyState type="all-done" />
          <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mt-6 mb-3 flex items-center gap-2">
            <span className="w-4 h-0.5 bg-muted-foreground/30 rounded-full"></span>
            Completed
          </h3>
          {completedTasks.map((task, index) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={onToggle}
              onDelete={onDelete}
              onSelect={onSelect}
              index={index}
            />
          ))}
        </>
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
          {completedTasks.length > 0 && (
            <>
              <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mt-6 mb-3 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-muted-foreground/30 rounded-full"></span>
                Completed ({completedTasks.length})
              </h3>
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
        </>
      )}
    </div>
  );
};
