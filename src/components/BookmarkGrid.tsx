
import React from 'react';
import BookmarkCard from './BookmarkCard';
import { Bookmark, Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ExternalLink, Trash2, Edit } from 'lucide-react';
import { useFoldableSections } from '@/hooks/useFoldableSections';

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
        <div className="flex justify-end space-x-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={expandAll}
            className="text-xs"
          >
            <ChevronDown className="h-3.5 w-3.5 mr-1" />
            Expand All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={collapseAll}
            className="text-xs"
          >
            <ChevronUp className="h-3.5 w-3.5 mr-1" />
            Collapse All
          </Button>
        </div>
      )}
      
      {visibleCategoryIds.map((categoryId) => (
        <section key={categoryId} className="animate-fade-in border rounded-lg p-4">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => toggleSection(categoryId)}
          >
            <Button
              variant="ghost"
              size="sm"
              className="p-1 mr-2 h-8 w-8"
              aria-label={expandedSections[categoryId] ? "Collapse section" : "Expand section"}
            >
              {expandedSections[categoryId] ? 
                <ChevronUp className="h-5 w-5" /> : 
                <ChevronDown className="h-5 w-5" />
              }
            </Button>
            <h2 className="text-xl font-semibold">{getCategoryName(categoryId)}</h2>
            <span className="ml-2 text-sm text-muted-foreground">
              ({groupedBookmarks[categoryId].length})
            </span>
          </div>
          
          {expandedSections[categoryId] && (
            viewMode === 'grid' ? (
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 animate-accordion-down"
              >
                {groupedBookmarks[categoryId].map((bookmark) => (
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
                {groupedBookmarks[categoryId].map((bookmark) => (
                  <div 
                    key={bookmark.id}
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
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{bookmark.title}</h3>
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
                        onClick={() => onEditBookmark(bookmark)}
                        title="Edit bookmark"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => onDeleteBookmark(bookmark)}
                        title="Delete bookmark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </section>
      ))}
    </div>
  );
};

export default BookmarkGrid;
