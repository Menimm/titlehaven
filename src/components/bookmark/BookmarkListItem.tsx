
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark } from '@/lib/types';
import { ExternalLink, Trash2, Edit } from 'lucide-react';

interface BookmarkListItemProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
  onToggleShowUrl: (bookmark: Bookmark) => void;
  onOpenLink: (url: string) => void;
}

const BookmarkListItem: React.FC<BookmarkListItemProps> = ({
  bookmark,
  onEdit,
  onDelete,
  onToggleShowUrl,
  onOpenLink,
}) => {
  return (
    <div 
      className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {bookmark.favicon && (
          <img 
            src={bookmark.favicon} 
            alt="" 
            className="w-5 h-5 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div 
          className="flex-1 min-w-0 cursor-pointer" 
          onClick={() => onOpenLink(bookmark.url)}
        >
          <h3 className="font-medium truncate hover:text-primary">{bookmark.title}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {bookmark.showFullUrl ? bookmark.url : new URL(bookmark.url).hostname}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onToggleShowUrl(bookmark)}
          title={bookmark.showFullUrl ? "Hide full URL" : "Show full URL"}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onEdit(bookmark)}
          title="Edit bookmark"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(bookmark)}
          title="Delete bookmark"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BookmarkListItem;
