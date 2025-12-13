import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <button onClick={onClick} className="fab">
      <Plus className="w-7 h-7" />
    </button>
  );
};
