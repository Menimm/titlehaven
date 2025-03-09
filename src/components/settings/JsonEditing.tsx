
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface JsonEditingProps {
  onEditJson: () => void;
}

const JsonEditing = ({ onEditJson }: JsonEditingProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Manual JSON Editing</h3>
      <p className="text-sm text-muted-foreground">
        Edit your bookmarks and settings directly as JSON. Use with caution!
      </p>
      <Button 
        onClick={onEditJson}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Edit Current Data as JSON
      </Button>
    </div>
  );
};

export default JsonEditing;
