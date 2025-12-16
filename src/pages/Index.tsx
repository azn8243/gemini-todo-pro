import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { Header } from '@/components/Header';
import { DailyGoals } from '@/components/DailyGoals';
import { CategoryFilter } from '@/components/CategoryFilter';
import { TaskList } from '@/components/TaskList';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { AddTaskModal } from '@/components/AddTaskModal';
import { SettingsModal } from '@/components/SettingsModal';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { AIInsightsCard } from '@/components/AIInsightsCard';
import { SearchBar } from '@/components/SearchBar';
import { MotivationalQuote } from '@/components/MotivationalQuote';
import { MilestoneContent } from '@/components/MilestoneToast';
import { useTasks } from '@/hooks/useTasks';
import { useAI } from '@/hooks/useAI';
import { useConfetti } from '@/hooks/useConfetti';
import { Category, Task, Priority } from '@/types/todo';

type FilterOption = 'All' | Category;

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [prevCompleted, setPrevCompleted] = useState(0);

  const { tasks, stats, addTask, toggleTask, deleteTask, updateTask, newMilestone, clearMilestone } = useTasks();
  const { 
    isEnabled, 
    isProcessing, 
    apiKey, 
    setApiKey, 
    categorizeTask,
    optimizeTask,
    getScheduleInsights,
    askFollowUp 
  } = useAI();
  const { fireConfetti } = useConfetti();

  // Fire confetti on task completion
  useEffect(() => {
    if (stats.completed > prevCompleted && prevCompleted > 0) {
      fireConfetti('task');
    }
    setPrevCompleted(stats.completed);
  }, [stats.completed]);

  // Fire confetti and show toast on milestone
  useEffect(() => {
    if (newMilestone) {
      fireConfetti('milestone');
      toast.custom(() => <MilestoneContent count={newMilestone} />, {
        duration: 5000,
      });
      clearMilestone();
    }
  }, [newMilestone]);

  const handleAddTask = (title: string, category: Category, time: string, priority: Priority) => {
    addTask(title, category, time, priority);
    toast.success('Task added!');
  };

  const handleVoiceTask = (title: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    addTask(title, 'Personal', timeStr, 'medium');
    toast.success('Task added via voice!');
  };

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
  };

  const handleSaveTask = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
  };

  const handleToggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      toast.success('Task completed! 🎉');
    }
    toggleTask(id);
  };

  // Filter tasks by search and category
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || task.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" richColors />
      
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        <Header 
          isAIEnabled={isEnabled} 
          onSettingsClick={() => setIsSettingsOpen(true)} 
        />

        <MotivationalQuote />
        
        <DailyGoals stats={stats} />

        {isEnabled && (
          <AIInsightsCard
            tasks={tasks}
            isAIEnabled={isEnabled}
            isProcessing={isProcessing}
            onGetInsights={getScheduleInsights}
          />
        )}

        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        <CategoryFilter 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
        
        <TaskList 
          tasks={filteredTasks} 
          filter={activeFilter}
          onToggle={handleToggleTask}
          onDelete={deleteTask}
          onSelect={handleSelectTask}
          searchQuery={searchQuery}
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
        isAIEnabled={isEnabled}
        isProcessing={isProcessing}
        onOptimize={optimizeTask}
        onAskFollowUp={askFollowUp}
      />
    </div>
  );
};

export default Index;
