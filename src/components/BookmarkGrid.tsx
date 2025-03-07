
import React from 'react';
import { Bookmark, Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useFoldableSections } from '@/hooks/useFoldableSections';
import CategorySection from './category/CategorySection';
import ExpansionControls from './category/ExpansionControls';

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  onEditBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (bookmark: Bookmark) => void;
  onToggleShowUrl: (bookmark: Bookmark) => void;
  className?: string;
  viewMode: 'grid' | 'list';
  categories?: Category[];
}

const BookmarkGrid: React.FC<BookmarkGridProps> = ({ 
  bookmarks, 
  onEditBookmark, 
  onDeleteBookmark,
  onToggleShowUrl,
  className,
  viewMode,
  categories = []
}) => {
  // Group bookmarks by category
  const groupedBookmarks = bookmarks.reduce<Record<string, Bookmark[]>>((acc, bookmark) => {
    if (!acc[bookmark.category]) {
      acc[bookmark.category] = [];
    }
    acc[bookmark.category].push(bookmark);
    return acc;
  }, {});

  const categoryIds = Object.keys(groupedBookmarks);
  const { expandedSections, toggleSection, collapseAll, expandAll } = useFoldableSections(categoryIds);

  // Function to get category name from id
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Function to get category color from id
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '';
  };

  // Function to check if a category is visible
  const isCategoryVisible = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.visible !== false : true;
  };

  // Filter out hidden categories
  const visibleCategoryIds = categoryIds.filter(isCategoryVisible);

  if (bookmarks.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-8", className)}>
      {visibleCategoryIds.length > 1 && (
        <ExpansionControls 
          onExpandAll={expandAll} 
          onCollapseAll={collapseAll} 
        />
      )}
      
      {visibleCategoryIds.map((categoryId) => (
        <CategorySection
          key={categoryId}
          categoryId={categoryId}
          categoryName={getCategoryName(categoryId)}
          categoryColor={getCategoryColor(categoryId)}
          bookmarks={groupedBookmarks[categoryId]}
          viewMode={viewMode}
          isExpanded={!!expandedSections[categoryId]}
          onToggleSection={toggleSection}
          onEditBookmark={onEditBookmark}
          onDeleteBookmark={onDeleteBookmark}
          onToggleShowUrl={onToggleShowUrl}
        />
      ))}
    </div>
  );
};

export default BookmarkGrid;
