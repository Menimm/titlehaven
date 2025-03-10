
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Bookmark } from '@/lib/types';
import BookmarkCardHeader from '@/components/bookmark/BookmarkCardHeader';
import BookmarkCardBody from '@/components/bookmark/BookmarkCardBody';
import BookmarkCardFooter from '@/components/bookmark/BookmarkCardFooter';
import BookmarkCardMenu from '@/components/bookmark/BookmarkCardMenu';
import BookmarkColorPicker from '@/components/bookmark/BookmarkColorPicker';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (bookmark: Bookmark) => void;
  onToggleShowUrl: (bookmark: Bookmark) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({
  bookmark,
  onEdit,
  onDelete,
  onToggleShowUrl,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Helper function to handle opening a bookmark URL
  const handleOpenLink = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="relative flex flex-col h-full overflow-hidden transition-all hover:shadow-md"
      style={{ 
        backgroundColor: bookmark.color || '',
        borderColor: bookmark.color ? 'transparent' : undefined,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute top-1 right-1 flex gap-1">
        <BookmarkColorPicker 
          bookmarkId={bookmark.id} 
          currentColor={bookmark.color} 
        />
        <BookmarkCardMenu 
          bookmark={bookmark} 
          onEdit={() => onEdit(bookmark)} 
          onDelete={() => onDelete(bookmark)} 
          onToggleShowUrl={() => onToggleShowUrl(bookmark)} 
        />
      </div>
      
      <BookmarkCardHeader 
        bookmark={bookmark} 
        onEdit={() => onEdit(bookmark)} 
        onDelete={() => onDelete(bookmark)} 
        onToggleShowUrl={() => onToggleShowUrl(bookmark)} 
      />
      <BookmarkCardBody 
        bookmark={bookmark} 
        onOpenLink={handleOpenLink}
      />
      <BookmarkCardFooter 
        isHovering={isHovering}
        onOpenLink={handleOpenLink}
      />
    </Card>
  );
};

export default BookmarkCard;
