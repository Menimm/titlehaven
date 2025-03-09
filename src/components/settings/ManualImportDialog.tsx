
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

interface ManualImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importData: string;
  onImportDataChange: (value: string) => void;
  error: string;
  onSubmit: () => void;
}

const ManualImportDialog = ({
  open,
  onOpenChange,
  importData,
  onImportDataChange,
  error,
  onSubmit
}: ManualImportDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import from JSON</DialogTitle>
          <DialogDescription>
            Paste your JSON backup data below. Make sure it follows the correct format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea 
            value={importData}
            onChange={(e) => onImportDataChange(e.target.value)}
            placeholder="Paste JSON backup data here..."
            className="min-h-[300px] font-mono text-sm"
          />
          {error && (
            <p className="text-destructive text-sm mt-2">{error}</p>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualImportDialog;
