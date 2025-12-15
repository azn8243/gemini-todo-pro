import { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Lightbulb, Clock, Zap, RefreshCw, Loader2 } from 'lucide-react';
import { Task } from '@/types/todo';
import { AIInsight } from '@/hooks/useAI';
import { Button } from '@/components/ui/button';

interface AIInsightsCardProps {
  tasks: Task[];
  isAIEnabled: boolean;
  isProcessing: boolean;
  onGetInsights: (tasks: Task[]) => Promise<AIInsight[]>;
}

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'schedule':
      return <Clock className="w-4 h-4" />;
    case 'optimization':
      return <Zap className="w-4 h-4" />;
    default:
      return <Lightbulb className="w-4 h-4" />;
  }
};

export const AIInsightsCard = ({ 
  tasks, 
  isAIEnabled, 
  isProcessing,
  onGetInsights 
}: AIInsightsCardProps) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchInsights = async () => {
    if (!isAIEnabled || tasks.length === 0) return;
    setIsLoading(true);
    const result = await onGetInsights(tasks);
    setInsights(result);
    setIsLoading(false);
    setHasLoaded(true);
  };

  useEffect(() => {
    // Auto-fetch insights when AI is enabled and tasks change significantly
    if (isAIEnabled && tasks.length > 0 && !hasLoaded) {
      fetchInsights();
    }
  }, [isAIEnabled, tasks.length]);

  if (!isAIEnabled) return null;

  return (
    <div className="glass-card p-4 mb-5 animate-fade-in-up hover-lift overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
            <p className="text-xs text-muted-foreground">Smart suggestions for your day</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {isLoading || isProcessing ? (
            <div className="flex items-center justify-center py-4 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-sm">Analyzing your tasks...</span>
            </div>
          ) : insights.length > 0 ? (
            <>
              {insights.map((insight, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-xl bg-muted/50 border border-border/50 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 ${
                      insight.type === 'schedule' ? 'text-accent' : 
                      insight.type === 'optimization' ? 'text-primary' : 
                      'text-secondary'
                    }`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <p className="text-sm text-foreground flex-1">{insight.message}</p>
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchInsights}
                disabled={isLoading}
                className="w-full text-muted-foreground hover:text-foreground text-xs"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh insights
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">No insights yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchInsights}
                disabled={isLoading}
                className="text-xs"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Generate insights
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
