import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const fireConfetti = useCallback((type: 'task' | 'milestone' | 'streak') => {
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
    
    switch (type) {
      case 'task':
        // Small burst for task completion
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors,
          disableForReducedMotion: true,
        });
        break;
      
      case 'milestone':
        // Big celebration for milestones
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
        
        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors,
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors,
          });
        }, 150);
        break;
      
      case 'streak':
        // Fire effect for streaks
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#EF4444', '#F97316'],
          shapes: ['circle'],
        });
        break;
    }
  }, []);

  return { fireConfetti };
};
