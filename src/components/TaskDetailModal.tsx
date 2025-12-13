import { useState, useEffect } from 'react';
import { Clock, Sparkles, Save } from 'lucide-react';
import { Task, Category } from '@/types/todo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Task>) => void;
}

const categories: Category[] = ['Work', 'Personal', 'Shopping'];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Work':
      return 'bg-secondary/20 text-secondary border-secondary/30';
    case 'Shopping':
      return 'bg-accent/20 text-accent border-accent/30';
    case 'Personal':
      return 'bg-[hsl(280,70%,55%)]/20 text-[hsl(280,70%,55%)] border-[hsl(280,70%,55%)]/30';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export const TaskDetailModal = ({ task, isOpen, onClose, onSave }: TaskDetailModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Personal');
  const [notes, setNotes] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setCategory(task.category);
      setNotes(task.notes || '');
      setTime(task.time);
    }
  }, [task]);

  const handleSave = () => {
    if (!task) return;
    onSave(task.id, {
      title,
      category,
      notes,
      time,
    });
    onClose();
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Task Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted border-border text-foreground"
            />
          </div>

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

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Time
            </label>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted rounded-lg px-3 py-2">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
              {task.completed && (
                <span className="ml-auto text-primary text-sm">Completed</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this task..."
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50 min-h-[120px] resize-none"
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
              onClick={handleSave}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
