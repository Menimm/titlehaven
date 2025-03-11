
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bookmark, Category } from '@/lib/types';
import BookmarkColorField from './BookmarkColorField';
import { Button } from '@/components/ui/button';
import * as z from 'zod';

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

export type BookmarkFormValues = z.infer<typeof bookmarkSchema>;

interface BookmarkFormFieldsProps {
  categories: Category[];
  editingBookmark?: Bookmark;
  onSave: (values: BookmarkFormValues) => void;
  onClose: () => void;
  formInstance: ReturnType<typeof useForm<BookmarkFormValues>>;
  onColorPickerInteraction: (isInteracting: boolean) => void;
  isEditMode: boolean;
}

const BookmarkFormFields: React.FC<BookmarkFormFieldsProps> = ({
  categories,
  onSave,
  onClose,
  formInstance,
  onColorPickerInteraction,
  isEditMode,
}) => {
  // Auto-fill title when URL is entered
  const handleUrlChange = (url: string) => {
    formInstance.setValue('url', url);
    
    if (!isEditMode && !formInstance.getValues('title') && url) {
      const extractedTitle = extractTitleFromUrl(url);
      if (extractedTitle) {
        formInstance.setValue('title', extractedTitle);
      }
    }
  };

  // Try to extract title from URL
  const extractTitleFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      const parts = domain.split('.');
      if (parts.length >= 2) {
        // Get the domain name without the TLD
        return parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1);
      }
      return domain;
    } catch {
      return '';
    }
  };

  const handleColorChange = (color: string) => {
    formInstance.setValue('color', color);
  };

  return (
    <Form {...formInstance}>
      <form onSubmit={formInstance.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={formInstance.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL*</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formInstance.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title*</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formInstance.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter description (optional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={formInstance.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category*</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <BookmarkColorField
          form={formInstance}
          onInteractionChange={onColorPickerInteraction}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditMode ? 'Update' : 'Add'} Bookmark
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookmarkFormFields;
