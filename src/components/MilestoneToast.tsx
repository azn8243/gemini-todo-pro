import { Trophy, Star, Flame, Crown, Zap } from 'lucide-react';

interface MilestoneConfig {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const getMilestoneConfig = (count: number): MilestoneConfig => {
  if (count >= 100) {
    return {
      icon: Crown,
      title: "Legendary! 👑",
      description: `${count} tasks completed! You're unstoppable!`,
      color: "text-amber-400",
    };
  }
  if (count >= 50) {
    return {
      icon: Star,
      title: "Superstar! ⭐",
      description: `${count} tasks done! Keep shining!`,
      color: "text-yellow-400",
    };
  }
  if (count >= 25) {
    return {
      icon: Flame,
      title: "On Fire! 🔥",
      description: `${count} tasks completed! You're blazing!`,
      color: "text-orange-400",
    };
  }
  if (count >= 10) {
    return {
      icon: Zap,
      title: "Power Up! ⚡",
      description: `${count} tasks done! Gaining momentum!`,
      color: "text-blue-400",
    };
  }
  return {
    icon: Trophy,
    title: "First Steps! 🏆",
    description: `${count} tasks completed! Great start!`,
    color: "text-emerald-400",
  };
};

export const MilestoneContent = ({ count }: { count: number }) => {
  const config = getMilestoneConfig(count);
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <div className={`${config.color} animate-bounce`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{config.title}</p>
        <p className="text-sm text-muted-foreground">{config.description}</p>
      </div>
    </div>
  );
};

export const MILESTONES = [5, 10, 25, 50, 100, 250, 500, 1000];
