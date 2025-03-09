
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface VersionNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versionName: string;
  onVersionNameChange: (value: string) => void;
  isEditing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const VersionNameDialog = ({
  open,
  onOpenChange,
  versionName,
  onVersionNameChange,
  isEditing,
  onCancel,
  onConfirm
}: VersionNameDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Rename Version' : 'Save Version'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Enter a new name for this version.'
              : 'Give your version a descriptive name to help you identify it later.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            value={versionName}
            onChange={(e) => onVersionNameChange(e.target.value)}
            placeholder="Version name"
            className="w-full"
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            {isEditing ? 'Update Name' : 'Save Version'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VersionNameDialog;
