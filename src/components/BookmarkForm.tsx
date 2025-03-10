
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import ColorPicker from '@/components/ColorPicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

type BookmarkFormValues = z.infer<typeof bookmarkSchema>;

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
  onAddCategory,
  isOpen
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

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
    }
  }, [editingBookmark, form]);

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

  // Auto-fill title when URL is entered
  const handleUrlChange = (url: string) => {
    form.setValue('url', url);
    
    if (!isEditMode && !form.getValues('title') && url) {
      const extractedTitle = extractTitleFromUrl(url);
      if (extractedTitle) {
        form.setValue('title', extractedTitle);
      }
    }
  };

  const handleFormSubmit = (values: BookmarkFormValues) => {
    onSave(values);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit' : 'Add'} Bookmark</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bookmark Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <ColorPicker 
                        color={field.value} 
                        onChange={field.onChange}
                        label=""
                      />
                      {field.value && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => field.onChange('')}
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkForm;
