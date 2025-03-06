
import React from 'react';
import BookmarkCard from './BookmarkCard';
import { Bookmark } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useFoldableSections } from '@/hooks/useFoldableSections';

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  onEditBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (id: string) => void;
  onToggleShowUrl: (id: string, value: boolean) => void;
  className?: string;
}

const BookmarkGrid: React.FC<BookmarkGridProps> = ({ 
  bookmarks, 
  onEditBookmark, 
  onDeleteBookmark,
  onToggleShowUrl,
  className 
}) => {
  // Group bookmarks by category
  const groupedBookmarks = bookmarks.reduce<Record<string, Bookmark[]>>((acc, bookmark) => {
    if (!acc[bookmark.category]) {
      acc[bookmark.category] = [];
    }
    acc[bookmark.category].push(bookmark);
    return acc;
  }, {});

  const categories = Object.keys(groupedBookmarks);
  const { expandedSections, toggleSection, collapseAll, expandAll } = useFoldableSections(categories);

  if (bookmarks.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-8", className)}>
      {categories.length > 1 && (
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
      
      {Object.entries(groupedBookmarks).map(([category, categoryBookmarks]) => (
        <section key={category} className="animate-fade-in border rounded-lg p-4">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => toggleSection(category)}
          >
            <Button
              variant="ghost"
              size="sm"
              className="p-1 mr-2 h-8 w-8"
              aria-label={expandedSections[category] ? "Collapse section" : "Expand section"}
            >
              {expandedSections[category] ? 
                <ChevronUp className="h-5 w-5" /> : 
                <ChevronDown className="h-5 w-5" />
              }
            </Button>
            <h2 className="text-xl font-semibold">{category}</h2>
            <span className="ml-2 text-sm text-muted-foreground">
              ({categoryBookmarks.length})
            </span>
          </div>
          
          {expandedSections[category] && (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 animate-accordion-down"
            >
              {categoryBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onEdit={onEditBookmark}
                  onDelete={onDeleteBookmark}
                  onToggleShowUrl={onToggleShowUrl}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default BookmarkGrid;
