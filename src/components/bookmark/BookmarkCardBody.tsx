
import React from 'react';
import { Bookmark } from '@/lib/types';

interface BookmarkCardBodyProps {
  bookmark: Bookmark;
  onOpenLink: () => void;
}

const BookmarkCardBody: React.FC<BookmarkCardBodyProps> = ({
  bookmark,
  onOpenLink
}) => {
  return (
    <div 
      className="flex-1 cursor-pointer"
      onClick={onOpenLink}
    >
      <h3 className="font-medium line-clamp-2 mb-1 text-md">{bookmark.title}</h3>
      
      {bookmark.description && (
        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
          {bookmark.description}
        </p>
      )}
      
      {bookmark.showFullUrl ? (
        <div className="text-xs text-muted-foreground break-all bg-muted p-2 rounded mt-2 mb-2">
          {bookmark.url}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground truncate">
          {bookmark.url.replace(/^https?:\/\//i, '')}
        </div>
      )}
    </div>
  );
};

export default BookmarkCardBody;
