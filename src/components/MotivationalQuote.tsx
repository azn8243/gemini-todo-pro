import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Small daily improvements are the key to long-term results.", author: "Unknown" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "Your future is created by what you do today.", author: "Robert Kiyosaki" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "The best time to plant a tree was yesterday. The second best time is now.", author: "Chinese Proverb" },
];

export const MotivationalQuote = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Get a different quote each day
    const dayIndex = new Date().getDate() % quotes.length;
    setQuote(quotes[dayIndex]);
  }, []);

  return (
    <div className="glass-card p-4 mb-4 animate-fade-in relative overflow-hidden">
      <div className="absolute -top-2 -left-2 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-secondary/10 rounded-full blur-xl" />
      
      <div className="relative flex items-start gap-3">
        <Quote className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-foreground/90 italic leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-xs text-muted-foreground mt-1.5">
            — {quote.author}
          </p>
        </div>
      </div>
    </div>
  );
};
