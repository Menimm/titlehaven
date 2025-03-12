
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Link2 } from 'lucide-react';
import { Bookmark } from '@/lib/types';

interface BookmarkCardMenuProps {
  bookmark: Bookmark;
  onEdit: () => void;
  onDelete: () => void;
  onToggleShowUrl: () => void;
  textColor?: string;
}

const BookmarkCardMenu: React.FC<BookmarkCardMenuProps> = ({
  bookmark,
  onEdit,
  onDelete,
  onToggleShowUrl,
  textColor = 'inherit',
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0"
          onClick={(e) => e.preventDefault()}
          style={{ color: textColor }}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onToggleShowUrl}>
          <Link2 className="mr-2 h-4 w-4" />
          Toggle URL
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookmarkCardMenu;
