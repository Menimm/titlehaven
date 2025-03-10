
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Bookmark } from '@/lib/types';
import BookmarkCardHeader from '@/components/bookmark/BookmarkCardHeader';
import BookmarkCardBody from '@/components/bookmark/BookmarkCardBody';
import BookmarkCardFooter from '@/components/bookmark/BookmarkCardFooter';
import BookmarkCardMenu from '@/components/bookmark/BookmarkCardMenu';
import BookmarkColorPicker from '@/components/bookmark/BookmarkColorPicker';
import { getContrastColor } from '@/lib/utils';

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

  // Determine text color based on background color
  const textColor = bookmark.color ? getContrastColor(bookmark.color) : 'inherit';

  return (
    <Card 
      className="relative flex flex-col h-full overflow-hidden transition-all hover:shadow-md"
      style={{ 
        backgroundColor: bookmark.color || '',
        borderColor: bookmark.color ? 'transparent' : undefined,
        color: textColor,
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
          textColor={textColor}
        />
      </div>
      
      <BookmarkCardHeader 
        bookmark={bookmark} 
        onEdit={() => onEdit(bookmark)} 
        onDelete={() => onDelete(bookmark)} 
        onToggleShowUrl={() => onToggleShowUrl(bookmark)} 
        textColor={textColor}
      />
      <BookmarkCardBody 
        bookmark={bookmark} 
        onOpenLink={handleOpenLink}
        textColor={textColor}
      />
      <BookmarkCardFooter 
        isHovering={isHovering}
        onOpenLink={handleOpenLink}
        textColor={textColor}
      />
    </Card>
  );
};

export default BookmarkCard;
