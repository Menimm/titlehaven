
import { useState, useMemo } from 'react';
import { Bookmark } from '@/lib/types';

export const useSearch = (bookmarks: Bookmark[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter bookmarks based on search term
  const filteredBookmarks = useMemo(() => {
    if (!searchTerm) return bookmarks;
    
    const search = searchTerm.toLowerCase();
    return bookmarks.filter(bookmark => (
      bookmark.title.toLowerCase().includes(search) ||
      bookmark.url.toLowerCase().includes(search) ||
      (bookmark.description && bookmark.description.toLowerCase().includes(search)) ||
      bookmark.category.toLowerCase().includes(search)
    ));
  }, [bookmarks, searchTerm]);

  // Sort bookmarks by category and then by creation date (newest first)
  const sortedBookmarks = useMemo(() => {
    return [...filteredBookmarks].sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  }, [filteredBookmarks]);

  return {
    searchTerm,
    setSearchTerm,
    filteredBookmarks,
    sortedBookmarks
  };
};
