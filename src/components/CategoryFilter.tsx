import { Category } from '@/types/todo';

type FilterOption = 'All' | Category;

interface CategoryFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filters: FilterOption[] = ['All', 'Work', 'Personal', 'Shopping'];

export const CategoryFilter = ({ activeFilter, onFilterChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`category-pill whitespace-nowrap ${
            activeFilter === filter 
              ? 'category-pill-active' 
              : 'category-pill-inactive'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};
