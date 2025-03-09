
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface EditJsonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jsonData: string;
  onJsonDataChange: (value: string) => void;
  error: string;
  onSave: () => void;
}

const EditJsonDialog = ({
  open,
  onOpenChange,
  jsonData,
  onJsonDataChange,
  error,
  onSave
}: EditJsonDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Data as JSON</DialogTitle>
          <DialogDescription>
            Modify your bookmarks and settings directly as JSON. Be careful with your changes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea 
            value={jsonData}
            onChange={(e) => onJsonDataChange(e.target.value)}
            placeholder="Edit JSON data here..."
            className="min-h-[400px] font-mono text-sm"
          />
          {error && (
            <p className="text-destructive text-sm mt-2">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditJsonDialog;
