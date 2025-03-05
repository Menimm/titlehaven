
import React from 'react';
import BookmarkCard from './BookmarkCard';
import { Bookmark } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  onEditBookmark: (bookmark: Bookmark) => void;
  onDeleteBookmark: (id: string) => void;
  className?: string;
}

const BookmarkGrid: React.FC<BookmarkGridProps> = ({ 
  bookmarks, 
  onEditBookmark, 
  onDeleteBookmark,
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

  if (bookmarks.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-8", className)}>
      {Object.entries(groupedBookmarks).map(([category, categoryBookmarks]) => (
        <section key={category} className="animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={onEditBookmark}
                onDelete={onDeleteBookmark}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default BookmarkGrid;
