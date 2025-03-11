
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import ColorPicker from '@/components/ColorPicker';
import { BookmarkFormValues } from './BookmarkFormFields';

interface BookmarkColorFieldProps {
  form: UseFormReturn<BookmarkFormValues>;
  onInteractionChange: (isInteracting: boolean) => void;
}

const BookmarkColorField: React.FC<BookmarkColorFieldProps> = ({
  form,
  onInteractionChange
}) => {
  const handleColorChange = (color: string) => {
    form.setValue('color', color);
  };

  const handleColorPickerMouseDown = () => {
    onInteractionChange(true);
  };

  const handleColorPickerMouseUp = () => {
    setTimeout(() => onInteractionChange(false), 100);
  };

  return (
    <FormField
      control={form.control}
      name="color"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bookmark Color</FormLabel>
          <FormControl>
            <div 
              className="flex items-center gap-2" 
              onMouseDown={handleColorPickerMouseDown}
              onMouseUp={handleColorPickerMouseUp}
            >
              <ColorPicker 
                color={field.value} 
                onChange={handleColorChange}
                label=""
              />
              {field.value && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    field.onChange('');
                  }}
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
  );
};

export default BookmarkColorField;
