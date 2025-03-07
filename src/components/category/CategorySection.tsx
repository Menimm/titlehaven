
import React from 'react';
import { Bookmark, Category } from '@/lib/types';
import BookmarkCard from '@/components/BookmarkCard';
import CategoryHeader from './CategoryHeader';
import BookmarkListItem from '@/components/bookmark/BookmarkListItem';

interface CategorySectionProps {
  categoryId: string;
  bookmarks: Bookmark[];
  viewMode: 'grid' | 'list';
  isExpanded: boolean;
  onToggleSection: (categoryId: string) => void;
  onEditBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (bookmark: Bookmark) => void;
  onToggleShowUrl: (bookmark: Bookmark) => void;
  categoryName: string;
  categoryColor?: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categoryId,
  bookmarks,
  viewMode,
  isExpanded,
  onToggleSection,
  onEditBookmark,
  onDeleteBookmark,
  onToggleShowUrl,
  categoryName,
  categoryColor,
}) => {
  // Helper function to handle opening a bookmark URL
  const handleOpenLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section 
      key={categoryId} 
      className="animate-fade-in border rounded-lg p-4"
      style={{ backgroundColor: categoryColor || '' }}
    >
      <CategoryHeader
        categoryId={categoryId}
        categoryName={categoryName}
        bookmarkCount={bookmarks.length}
        isExpanded={isExpanded}
        onToggle={onToggleSection}
      />
      
      {isExpanded && (
        viewMode === 'grid' ? (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 animate-accordion-down"
          >
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={() => onEditBookmark(bookmark)}
                onDelete={() => onDeleteBookmark(bookmark)}
                onToggleShowUrl={() => onToggleShowUrl(bookmark)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-2 animate-accordion-down">
            {bookmarks.map((bookmark) => (
              <BookmarkListItem
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={onEditBookmark}
                onDelete={onDeleteBookmark}
                onToggleShowUrl={onToggleShowUrl}
                onOpenLink={handleOpenLink}
              />
            ))}
          </div>
        )
      )}
    </section>
  );
};

export default CategorySection;
