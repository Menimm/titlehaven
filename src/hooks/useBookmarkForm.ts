
import { useState } from 'react';
import { Bookmark } from '@/lib/types';

export const useBookmarkForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>(undefined);

  const openAddForm = () => {
    setEditingBookmark(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBookmark(undefined);
  };

  return {
    isFormOpen,
    editingBookmark,
    openAddForm,
    openEditForm,
    closeForm
  };
};
