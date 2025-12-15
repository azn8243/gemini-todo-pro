import { Category } from '@/types/todo';
import { Briefcase, User, ShoppingBag, Layers } from 'lucide-react';

type FilterOption = 'All' | Category;

interface CategoryFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filters: { label: FilterOption; icon: React.ReactNode }[] = [
  { label: 'All', icon: <Layers className="w-3.5 h-3.5" /> },
  { label: 'Work', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { label: 'Personal', icon: <User className="w-3.5 h-3.5" /> },
  { label: 'Shopping', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
];

export const CategoryFilter = ({ activeFilter, onFilterChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide animate-fade-in" style={{ animationDelay: '0.15s' }}>
      {filters.map((filter, index) => (
        <button
          key={filter.label}
          onClick={() => onFilterChange(filter.label)}
          className={`category-pill flex items-center gap-1.5 animate-scale-in ${
            activeFilter === filter.label 
              ? 'category-pill-active' 
              : 'category-pill-inactive'
          }`}
          style={{ animationDelay: `${0.1 + index * 0.05}s` }}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  );
};
