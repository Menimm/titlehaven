
import React, { useState } from 'react';
import { Bookmark } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import BookmarkCardHeader from './bookmark/BookmarkCardHeader';
import BookmarkCardBody from './bookmark/BookmarkCardBody';
import BookmarkCardFooter from './bookmark/BookmarkCardFooter';
import BookmarkCardMenu from './bookmark/BookmarkCardMenu';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onToggleShowUrl: (id: string, value: boolean) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ 
  bookmark, 
  onEdit, 
  onDelete, 
  onToggleShowUrl 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleOpenLink = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const handleToggleShowUrl = () => {
    onToggleShowUrl(bookmark.id, !bookmark.showFullUrl);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 h-full",
        "hover:shadow-md hover:border-primary/20",
        "animate-slide-up"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <BookmarkCardHeader 
          bookmark={bookmark} 
          onEdit={() => onEdit(bookmark)}
          onDelete={() => onDelete(bookmark.id)}
          onToggleShowUrl={handleToggleShowUrl}
        />
        
        <BookmarkCardBody 
          bookmark={bookmark}
          onOpenLink={handleOpenLink}
        />
        
        <BookmarkCardFooter 
          isHovering={isHovering}
          onOpenLink={handleOpenLink}
        />
      </CardContent>
    </Card>
  );
};

export default BookmarkCard;
