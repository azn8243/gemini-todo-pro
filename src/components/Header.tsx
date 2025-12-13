import { Sparkles } from 'lucide-react';

interface HeaderProps {
  isAIEnabled: boolean;
  onSettingsClick: () => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const getFormattedDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

export const Header = ({ isAIEnabled, onSettingsClick }: HeaderProps) => {
  return (
    <header className="flex items-start justify-between gap-4 mb-6">
      <div className="min-w-0 flex-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
          {getGreeting()}
        </h1>
        <p className="text-muted-foreground mt-0.5 text-base">{getFormattedDate()}</p>
      </div>
      
      <button
        onClick={onSettingsClick}
        className={isAIEnabled ? 'ai-badge' : 'ai-badge-disabled'}
      >
        <Sparkles className="w-4 h-4" />
        <span>{isAIEnabled ? 'AI' : 'AI'}</span>
      </button>
    </header>
  );
};
