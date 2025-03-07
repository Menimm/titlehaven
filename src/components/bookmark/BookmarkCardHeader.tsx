
import React from 'react';
import { Bookmark } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import BookmarkCardMenu from './BookmarkCardMenu';

interface BookmarkCardHeaderProps {
  bookmark: Bookmark;
  onEdit: () => void;
  onDelete: () => void;
  onToggleShowUrl: () => void;
}

const BookmarkCardHeader: React.FC<BookmarkCardHeaderProps> = ({
  bookmark,
  onEdit,
  onDelete,
  onToggleShowUrl
}) => {
  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return null;
    }
  };

  return (
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2 max-w-[80%]">
        <div className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
          {bookmark.url && (
            <img 
              src={getFaviconUrl(bookmark.url)} 
              alt="" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
        </div>
        <Badge variant="outline" className="text-xs font-normal">
          {bookmark.category}
        </Badge>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <BookmarkCardMenu 
          bookmark={bookmark}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleShowUrl={onToggleShowUrl}
        />
      </DropdownMenu>
    </div>
  );
};

export default BookmarkCardHeader;
