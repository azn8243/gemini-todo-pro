import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Mic, MicOff, Flag, AlertCircle, ArrowDown } from 'lucide-react';
import { Category, Priority } from '@/types/todo';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, category: Category, time: string, priority: Priority) => void;
  isAIEnabled: boolean;
  onCategorize: (title: string) => Promise<{ category: Category; cleanedTitle: string }>;
  isProcessing: boolean;
}

const categories: Category[] = ['Work', 'Personal', 'Shopping'];
const priorities: { value: Priority; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'high', label: 'High', icon: AlertCircle, color: 'text-red-400 border-red-400 bg-red-400/10' },
  { value: 'medium', label: 'Med', icon: Flag, color: 'text-amber-400 border-amber-400 bg-amber-400/10' },
  { value: 'low', label: 'Low', icon: ArrowDown, color: 'text-emerald-400 border-emerald-400 bg-emerald-400/10' },
];

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
  const [priority, setPriority] = useState<Priority>('medium');
  const [time, setTime] = useState('12:00');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTitle(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Voice input failed. Please try again.');
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognition) {
      toast.error('Voice input not supported in this browser');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info('Listening... Speak now');
    }
  };

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

    onAdd(finalTitle, finalCategory, formatTime(time), priority);
    setTitle('');
    setCategory('Personal');
    setPriority('medium');
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
            <div className="flex gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isAIEnabled ? "Type anything, AI will clean it up..." : "Enter task title"}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50 flex-1"
                autoFocus
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={toggleVoiceInput}
                className={`border-border shrink-0 ${isListening ? 'bg-destructive/20 text-destructive border-destructive' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            {isAIEnabled && (
              <p className="text-xs text-primary mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI will auto-categorize and clean up your task
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Priority
            </label>
            <div className="flex gap-2">
              {priorities.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-1.5 text-sm font-medium ${
                      priority === p.value 
                        ? p.color
                        : 'border-border text-muted-foreground hover:border-muted-foreground/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {p.label}
                  </button>
                );
              })}
            </div>
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
