
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Bookmark, Category } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BookmarkFormFields, { BookmarkFormValues } from './bookmark/BookmarkFormFields';

// Schema for form validation
const bookmarkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Must be a valid URL'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  color: z.string().optional(),
});

interface BookmarkFormProps {
  categories: Category[];
  editingBookmark?: Bookmark;
  onSave: (values: BookmarkFormValues) => void;
  onClose: () => void;
  onAddCategory: (name: string) => string;
  isOpen: boolean;
}

const BookmarkForm: React.FC<BookmarkFormProps> = ({
  categories,
  editingBookmark,
  onSave,
  onClose,
  isOpen
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [preventClose, setPreventClose] = useState(false);

  // Set up form with default values
  const form = useForm<BookmarkFormValues>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      category: categories[0]?.id || '',
      color: '',
    },
  });

  // Update form when editing an existing bookmark
  useEffect(() => {
    if (editingBookmark) {
      setIsEditMode(true);
      form.reset({
        title: editingBookmark.title,
        url: editingBookmark.url,
        description: editingBookmark.description || '',
        category: editingBookmark.category,
        color: editingBookmark.color || '',
      });
    } else {
      setIsEditMode(false);
      // Only reset when opening form in add mode
      if (isOpen && !isEditMode) {
        form.reset({
          title: '',
          url: '',
          description: '',
          category: categories[0]?.id || '',
          color: '',
        });
      }
    }
  }, [editingBookmark, form, isOpen, isEditMode, categories]);

  const handleFormSubmit = (values: BookmarkFormValues) => {
    onSave(values);
    form.reset();
  };

  const handleColorPickerInteraction = (isInteracting: boolean) => {
    setPreventClose(isInteracting);
  };

  // Prevent propagation to avoid closing dialogs
  const stopPropagation = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open && !preventClose) {
          onClose();
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-[500px]"
        onClick={stopPropagation}
      >
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit' : 'Add'} Bookmark</DialogTitle>
        </DialogHeader>
        <BookmarkFormFields
          categories={categories}
          editingBookmark={editingBookmark}
          onSave={handleFormSubmit}
          onClose={onClose}
          formInstance={form}
          onColorPickerInteraction={handleColorPickerInteraction}
          isEditMode={isEditMode}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkForm;
