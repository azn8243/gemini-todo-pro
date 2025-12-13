import { useState } from 'react';
import { Toaster } from 'sonner';
import { Header } from '@/components/Header';
import { DailyGoals } from '@/components/DailyGoals';
import { CategoryFilter } from '@/components/CategoryFilter';
import { TaskList } from '@/components/TaskList';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { AddTaskModal } from '@/components/AddTaskModal';
import { SettingsModal } from '@/components/SettingsModal';
import { useTasks } from '@/hooks/useTasks';
import { useAI } from '@/hooks/useAI';
import { Category } from '@/types/todo';

type FilterOption = 'All' | Category;

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { tasks, stats, addTask, toggleTask, deleteTask } = useTasks();
  const { isEnabled, isProcessing, apiKey, setApiKey, categorizeTask } = useAI();

  const handleAddTask = (title: string, category: Category, time: string) => {
    addTask(title, category, time);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      
      <div className="container max-w-lg mx-auto px-5 py-8">
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
        />
      </div>

      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

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
    </div>
  );
};

export default Index;
