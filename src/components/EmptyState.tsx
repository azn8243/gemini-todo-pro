import { CheckCircle2, Sparkles, Target } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-tasks' | 'all-done' | 'no-results';
  searchQuery?: string;
}

const states = {
  'no-tasks': {
    icon: Target,
    title: "No tasks yet",
    description: "Add your first task to get started on your productivity journey!",
    gradient: "from-primary to-secondary",
  },
  'all-done': {
    icon: CheckCircle2,
    title: "All done! 🎉",
    description: "You've completed all your tasks. Time to celebrate or add more goals!",
    gradient: "from-secondary to-accent",
  },
  'no-results': {
    icon: Sparkles,
    title: "No matches found",
    description: "Try adjusting your search or filters",
    gradient: "from-accent to-primary",
  },
};

export const EmptyState = ({ type, searchQuery }: EmptyStateProps) => {
  const state = states[type];
  const Icon = state.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${state.gradient} flex items-center justify-center mb-6 animate-float shadow-lg`}>
        <Icon className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
        {state.title}
      </h3>
      <p className="text-muted-foreground text-center max-w-xs">
        {type === 'no-results' && searchQuery 
          ? `No tasks matching "${searchQuery}"`
          : state.description
        }
      </p>
    </div>
  );
};
