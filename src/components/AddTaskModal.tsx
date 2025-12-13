import { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { Category } from '@/types/todo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, category: Category, time: string) => void;
  isAIEnabled: boolean;
  onCategorize: (title: string) => Promise<{ category: Category; cleanedTitle: string }>;
  isProcessing: boolean;
}

const categories: Category[] = ['Work', 'Personal', 'Shopping'];

export const AddTaskModal = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  isAIEnabled,
  onCategorize,
  isProcessing 
}: AddTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Personal');
  const [time, setTime] = useState('12:00');

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalTitle = title;
    let finalCategory = category;

    if (isAIEnabled) {
      const result = await onCategorize(title);
      finalTitle = result.cleanedTitle;
      finalCategory = result.category;
    }

    onAdd(finalTitle, finalCategory, formatTime(time));
    setTitle('');
    setCategory('Personal');
    setTime('12:00');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            Add New Task
            {isAIEnabled && (
              <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Task Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isAIEnabled ? "Type anything, AI will clean it up..." : "Enter task title"}
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
              autoFocus
            />
            {isAIEnabled && (
              <p className="text-xs text-primary mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI will auto-categorize and clean up your task
              </p>
            )}
          </div>

          {!isAIEnabled && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Category
              </label>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`category-pill flex-1 ${
                      category === cat 
                        ? 'category-pill-active' 
                        : 'category-pill-inactive'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Time
            </label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-muted border-border text-foreground"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || isProcessing}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Add Task'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
