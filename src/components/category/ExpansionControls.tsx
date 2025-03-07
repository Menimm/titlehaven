
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpansionControlsProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

const ExpansionControls: React.FC<ExpansionControlsProps> = ({
  onExpandAll,
  onCollapseAll,
}) => {
  return (
    <div className="flex justify-end space-x-2 mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onExpandAll}
        className="text-xs"
      >
        <ChevronDown className="h-3.5 w-3.5 mr-1" />
        Expand All
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onCollapseAll}
        className="text-xs"
      >
        <ChevronUp className="h-3.5 w-3.5 mr-1" />
        Collapse All
      </Button>
    </div>
  );
};

export default ExpansionControls;
