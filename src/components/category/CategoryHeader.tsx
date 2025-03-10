
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryHeaderProps {
  categoryId: string;
  categoryName: string;
  bookmarkCount: number;
  isExpanded: boolean;
  onToggle: (categoryId: string) => void;
  textColor?: string;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  categoryId,
  categoryName,
  bookmarkCount,
  isExpanded,
  onToggle,
  textColor = 'inherit',
}) => {
  return (
    <div 
      className="flex items-center cursor-pointer" 
      onClick={() => onToggle(categoryId)}
    >
      <Button
        variant="ghost"
        size="sm"
        className="p-1 mr-2 h-8 w-8"
        style={{ color: textColor }}
        aria-label={isExpanded ? "Collapse section" : "Expand section"}
      >
        {isExpanded ? 
          <ChevronUp className="h-5 w-5" /> : 
          <ChevronDown className="h-5 w-5" />
        }
      </Button>
      <h2 
        className="text-xl font-semibold"
        style={{ color: textColor }}
      >
        {categoryName}
      </h2>
      <span 
        className="ml-2 text-sm"
        style={{ color: textColor === 'inherit' ? 'var(--muted-foreground)' : textColor }}
      >
        ({bookmarkCount})
      </span>
    </div>
  );
};

export default CategoryHeader;
