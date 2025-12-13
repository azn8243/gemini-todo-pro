import { Sparkles, Settings } from 'lucide-react';

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
    <header className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">{getFormattedDate()}</p>
      </div>
      
      <button
        onClick={onSettingsClick}
        className={isAIEnabled ? 'ai-badge' : 'ai-badge-disabled'}
      >
        <Sparkles className="w-4 h-4" />
        <span>{isAIEnabled ? 'AI Enabled' : 'Enable AI'}</span>
      </button>
    </header>
  );
};
