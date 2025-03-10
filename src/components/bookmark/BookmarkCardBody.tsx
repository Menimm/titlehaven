
import React from 'react';
import { Bookmark } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BookmarkCardBodyProps {
  bookmark: Bookmark;
  onOpenLink: () => void;
  textColor?: string;
}

const BookmarkCardBody: React.FC<BookmarkCardBodyProps> = ({
  bookmark,
  onOpenLink,
  textColor = 'inherit'
}) => {
  return (
    <div 
      className="flex-1 cursor-pointer"
      onClick={onOpenLink}
    >
      <h3 
        className="font-medium line-clamp-2 mb-1 text-md"
        style={{ color: textColor }}
      >
        {bookmark.title}
      </h3>
      
      {bookmark.description && (
        <p 
          className={cn("text-sm line-clamp-2 mb-2")}
          style={{ color: textColor === 'inherit' ? 'var(--muted-foreground)' : textColor }}
        >
          {bookmark.description}
        </p>
      )}
      
      {bookmark.showFullUrl ? (
        <div 
          className="text-xs break-all bg-muted p-2 rounded mt-2 mb-2"
          style={{ 
            color: textColor === 'inherit' ? 'var(--muted-foreground)' : textColor,
            backgroundColor: textColor === 'white' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'
          }}
        >
          {bookmark.url}
        </div>
      ) : (
        <div 
          className="text-xs truncate"
          style={{ color: textColor === 'inherit' ? 'var(--muted-foreground)' : textColor }}
        >
          {bookmark.url.replace(/^https?:\/\//i, '')}
        </div>
      )}
    </div>
  );
};

export default BookmarkCardBody;
