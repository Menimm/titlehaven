
import React from 'react';
import { Bookmark } from '@/lib/types';
import { toast } from 'sonner';
import { 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Copy, Pencil, Trash2, Link } from 'lucide-react';

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
  onToggleShowUrl
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookmark.url);
    toast.success('Link copied to clipboard');
  };

  return (
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={onEdit}>
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleCopyLink}>
        <Copy className="h-4 w-4 mr-2" />
        Copy Link
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onToggleShowUrl}>
        <Link className="h-4 w-4 mr-2" />
        {bookmark.showFullUrl ? "Hide Full URL" : "Show Full URL"}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        onClick={onDelete}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};

export default BookmarkCardMenu;
