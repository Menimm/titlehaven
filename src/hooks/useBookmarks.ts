
import { useState, useEffect } from 'react';
import { Bookmark } from '@/lib/types';
import { toast } from 'sonner';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('bookmarks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        return parsed.map((b: any) => ({
          ...b,
          createdAt: new Date(b.createdAt)
        }));
      } catch (e) {
        console.error('Failed to parse bookmarks from localStorage', e);
        return [];
      }
    }
    return [];
  });

  const [bookmarkToDelete, setBookmarkToDelete] = useState<string | null>(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const getFaviconForUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}`;
    } catch {
      return undefined;
    }
  };

  const addBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'createdAt' | 'favicon'>) => {
    const newBookmark: Bookmark = {
      id: generateId(),
      ...bookmarkData,
      favicon: getFaviconForUrl(bookmarkData.url),
      createdAt: new Date(),
      showFullUrl: false
    };
    setBookmarks([...bookmarks, newBookmark]);
    toast.success('Bookmark added successfully');
    return newBookmark;
  };

  const updateBookmark = (
    id: string, 
    bookmarkData: Omit<Bookmark, 'id' | 'createdAt' | 'favicon'>
  ) => {
    setBookmarks(bookmarks.map(b => 
      b.id === id 
        ? { 
            ...b, 
            ...bookmarkData, 
            showFullUrl: b.showFullUrl,
            favicon: getFaviconForUrl(bookmarkData.url)
          } 
        : b
    ));
    toast.success('Bookmark updated successfully');
  };

  const deleteBookmark = (id: string) => {
    setBookmarkToDelete(id);
  };

  const confirmDeleteBookmark = () => {
    if (bookmarkToDelete) {
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkToDelete));
      toast.success('Bookmark deleted');
      setBookmarkToDelete(null);
    }
  };

  const toggleShowUrl = (id: string, value: boolean) => {
    setBookmarks(bookmarks.map(b => 
      b.id === id ? { ...b, showFullUrl: value } : b
    ));
    toast.success(value ? 'Showing full URL' : 'Hiding full URL');
  };

  const cancelDelete = () => {
    setBookmarkToDelete(null);
  };

  return {
    bookmarks,
    bookmarkToDelete,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    confirmDeleteBookmark,
    cancelDelete,
    toggleShowUrl
  };
};
