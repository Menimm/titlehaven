
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogsProps {
  deleteId: string | null;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  restoreId: string | null;
  onRestoreCancel: () => void;
  onRestoreConfirm: () => void;
}

const ConfirmationDialogs = ({
  deleteId,
  onDeleteCancel,
  onDeleteConfirm,
  restoreId,
  onRestoreCancel,
  onRestoreConfirm
}: ConfirmationDialogsProps) => {
  return (
    <>
      {/* Delete Version Confirmation */}
      <AlertDialog 
        open={deleteId !== null} 
        onOpenChange={(open) => !open && onDeleteCancel()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Version</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this version? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Restore Version Confirmation */}
      <AlertDialog 
        open={restoreId !== null} 
        onOpenChange={(open) => !open && onRestoreCancel()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this version? This will replace all your current bookmarks, categories, and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onRestoreCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onRestoreConfirm}>
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConfirmationDialogs;
