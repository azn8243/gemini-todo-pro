import { useState, useEffect } from 'react';
import { Clock, Sparkles, Save, Loader2, MessageCircle, Wand2, Send, Lightbulb, AlertCircle, Flag, ArrowDown } from 'lucide-react';
import { Task, Category, Priority } from '@/types/todo';
import { AIInsight } from '@/hooks/useAI';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Task>) => void;
  isAIEnabled: boolean;
  isProcessing: boolean;
  onOptimize: (title: string, notes: string, category: Category) => Promise<{
    optimizedTitle: string;
    optimizedNotes: string;
    insight: AIInsight;
  }>;
  onAskFollowUp: (title: string, notes: string, question: string) => Promise<string>;
}

const categories: Category[] = ['Work', 'Personal', 'Shopping'];
const priorities: { value: Priority; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'high', label: 'High', icon: AlertCircle, color: 'text-red-400 border-red-400 bg-red-400/10' },
  { value: 'medium', label: 'Med', icon: Flag, color: 'text-amber-400 border-amber-400 bg-amber-400/10' },
  { value: 'low', label: 'Low', icon: ArrowDown, color: 'text-emerald-400 border-emerald-400 bg-emerald-400/10' },
];

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

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'question':
      return <MessageCircle className="w-4 h-4" />;
    case 'schedule':
      return <Clock className="w-4 h-4" />;
    case 'optimization':
      return <Wand2 className="w-4 h-4" />;
    default:
      return <Lightbulb className="w-4 h-4" />;
  }
};

const getInsightColor = (type: string) => {
  switch (type) {
    case 'question':
      return 'bg-secondary/20 border-secondary/30 text-secondary';
    case 'schedule':
      return 'bg-accent/20 border-accent/30 text-accent';
    case 'optimization':
      return 'bg-primary/20 border-primary/30 text-primary';
    default:
      return 'bg-[hsl(280,70%,55%)]/20 border-[hsl(280,70%,55%)]/30 text-[hsl(280,70%,55%)]';
  }
};

export const TaskDetailModal = ({ 
  task, 
  isOpen, 
  onClose, 
  onSave,
  isAIEnabled,
  isProcessing,
  onOptimize,
  onAskFollowUp
}: TaskDetailModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Personal');
  const [priority, setPriority] = useState<Priority>('medium');
  const [notes, setNotes] = useState('');
  const [time, setTime] = useState('');
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setCategory(task.category);
      setPriority(task.priority || 'medium');
      setNotes(task.notes || '');
      setTime(task.time);
      setInsight(null);
      setChatResponse('');
      setShowChat(false);
    }
  }, [task]);

  const handleOptimize = async () => {
    const result = await onOptimize(title, notes, category);
    setTitle(result.optimizedTitle);
    setNotes(result.optimizedNotes);
    setInsight(result.insight);
    toast.success('Task optimized by AI!');
  };

  const handleApplyInsightAction = () => {
    if (insight?.action) {
      setNotes(prev => prev ? `${prev}\n\n${insight.action!.value}` : insight.action!.value);
      toast.success('Suggestion applied!');
    }
  };

  const handleAskAI = async () => {
    if (!chatInput.trim()) return;
    const response = await onAskFollowUp(title, notes, chatInput);
    setChatResponse(response);
    setChatInput('');
  };

  const handleSave = () => {
    if (!task) return;
    onSave(task.id, {
      title,
      category,
      priority,
      notes,
      time,
    });
    onClose();
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            Task Details
            {isAIEnabled && (
              <span className="text-xs px-2 py-1 rounded-full bg-gradient-primary text-primary-foreground font-medium flex items-center gap-1 animate-pulse-glow">
                <Sparkles className="w-3 h-3" />
                AI
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Title with AI Optimize */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-muted-foreground">
                Title
              </label>
              {isAIEnabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleOptimize}
                  disabled={isProcessing}
                  className="text-xs text-primary hover:text-primary/80 h-7 px-2 gap-1"
                >
                  {isProcessing ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                  Optimize with AI
                </Button>
              )}
            </div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted border-border text-foreground"
            />
          </div>

          {/* AI Insight Card */}
          {insight && (
            <div className={`p-3 rounded-xl border animate-fade-in-up ${getInsightColor(insight.type)}`}>
              <div className="flex items-start gap-2">
                {getInsightIcon(insight.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{insight.message}</p>
                  {insight.action && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleApplyInsightAction}
                      className="mt-2 h-7 text-xs bg-background/50 hover:bg-background/80"
                    >
                      {insight.action.label}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Category */}
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

          {/* Priority */}
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

          {/* Time */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Time
            </label>
            <div className="flex items-center gap-2 text-muted-foreground bg-muted rounded-lg px-3 py-2">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
              {task.completed && (
                <span className="ml-auto text-primary text-sm font-medium">✓ Completed</span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this task..."
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50 min-h-[100px] resize-none"
            />
          </div>

          {/* AI Chat */}
          {isAIEnabled && (
            <div className="border border-border/50 rounded-xl p-3 bg-muted/30">
              <button
                type="button"
                onClick={() => setShowChat(!showChat)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
              >
                <MessageCircle className="w-4 h-4 text-secondary" />
                Ask AI about this task
              </button>
              
              {showChat && (
                <div className="mt-3 space-y-3 animate-fade-in">
                  {chatResponse && (
                    <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 text-sm text-foreground">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <p>{chatResponse}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask a question..."
                      className="bg-muted border-border text-foreground text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={handleAskAI}
                      disabled={isProcessing || !chatInput.trim()}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shrink-0"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
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
              className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90"
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
