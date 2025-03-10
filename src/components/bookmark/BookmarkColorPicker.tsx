
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ColorPicker from '@/components/ColorPicker';
import { useBookmarks } from '@/hooks/useBookmarks';

interface BookmarkColorPickerProps {
  bookmarkId: string;
  currentColor?: string;
}

const BookmarkColorPicker: React.FC<BookmarkColorPickerProps> = ({ 
  bookmarkId, 
  currentColor 
}) => {
  const { setBookmarkColor } = useBookmarks();

  const handleColorChange = (color: string) => {
    setBookmarkColor(bookmarkId, color);
  };

  const handleClearColor = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkColor(bookmarkId, '');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Palette className="h-4 w-4" />
          <span className="sr-only">Change bookmark color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        onPointerDownOutside={(e) => {
          if (e.target && (
            (e.target as HTMLElement).closest('.color-preset') || 
            (e.target as HTMLElement).closest('[role="dialog"]')
          )) {
            e.preventDefault();
          }
        }}
      >
        <DropdownMenuLabel>Bookmark Color</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div 
          className="p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <ColorPicker
            color={currentColor}
            onChange={handleColorChange}
            size="sm"
            label=""
          />
        </div>
        {currentColor && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleClearColor}>
              Reset to default
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookmarkColorPicker;
