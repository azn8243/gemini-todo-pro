import { Category } from '@/types/todo';

type FilterOption = 'All' | Category;

interface CategoryFilterProps {
  activeFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const filters: FilterOption[] = ['All', 'Work', 'Personal', 'Shopping'];

export const CategoryFilter = ({ activeFilter, onFilterChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`category-pill ${
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
