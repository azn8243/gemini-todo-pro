import { useState } from 'react';
import { Toaster } from 'sonner';
import { Header } from '@/components/Header';
import { DailyGoals } from '@/components/DailyGoals';
import { CategoryFilter } from '@/components/CategoryFilter';
import { TaskList } from '@/components/TaskList';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { AddTaskModal } from '@/components/AddTaskModal';
import { SettingsModal } from '@/components/SettingsModal';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { useTasks } from '@/hooks/useTasks';
import { useAI } from '@/hooks/useAI';
import { Category, Task } from '@/types/todo';

type FilterOption = 'All' | Category;

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { tasks, stats, addTask, toggleTask, deleteTask, updateTask } = useTasks();
  const { isEnabled, isProcessing, apiKey, setApiKey, categorizeTask } = useAI();

  const handleAddTask = (title: string, category: Category, time: string) => {
    addTask(title, category, time);
  };

  const handleVoiceTask = (title: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    addTask(title, 'Personal', timeStr);
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
  };

  const handleSaveTask = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        <Header 
          isAIEnabled={isEnabled} 
          onSettingsClick={() => setIsSettingsOpen(true)} 
        />
        
        <DailyGoals stats={stats} />
        
        <CategoryFilter 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
        
        <TaskList 
          tasks={tasks} 
          filter={activeFilter}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onSelect={handleSelectTask}
        />
      </div>

      <FloatingActionButton 
        onAddClick={() => setIsAddModalOpen(true)} 
        onVoiceTask={handleVoiceTask}
        isAIEnabled={isEnabled}
        onCategorize={categorizeTask}
      />

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
        isAIEnabled={isEnabled}
        onCategorize={categorizeTask}
        isProcessing={isProcessing}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={setApiKey}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Index;
