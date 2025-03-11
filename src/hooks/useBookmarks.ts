
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

  const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark | null>(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } catch (err) {
      console.error('Failed to save bookmarks to localStorage', err);
      toast.error('Failed to save bookmarks');
    }
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
    try {
      const newBookmark: Bookmark = {
        id: generateId(),
        ...bookmarkData,
        favicon: getFaviconForUrl(bookmarkData.url),
        createdAt: new Date(),
        showFullUrl: false
      };
      setBookmarks(prevBookmarks => [...prevBookmarks, newBookmark]);
      toast.success('Bookmark added successfully');
      return newBookmark;
    } catch (err) {
      console.error('Failed to add bookmark', err);
      toast.error('Failed to add bookmark');
      return null;
    }
  };

  const updateBookmark = (
    id: string, 
    bookmarkData: Partial<Omit<Bookmark, 'id' | 'createdAt' | 'favicon'>>
  ) => {
    try {
      setBookmarks(bookmarks.map(b => 
        b.id === id 
          ? { 
              ...b, 
              ...bookmarkData,
              // Only update favicon if URL has changed
              favicon: bookmarkData.url ? getFaviconForUrl(bookmarkData.url) : b.favicon
            } 
          : b
      ));
      toast.success('Bookmark updated successfully');
    } catch (err) {
      console.error('Failed to update bookmark', err);
      toast.error('Failed to update bookmark');
    }
  };

  const deleteBookmark = (bookmark: Bookmark) => {
    setBookmarkToDelete(bookmark);
  };

  const confirmDeleteBookmark = () => {
    if (bookmarkToDelete) {
      try {
        setBookmarks(bookmarks.filter(b => b.id !== bookmarkToDelete.id));
        toast.success('Bookmark deleted');
        setBookmarkToDelete(null);
      } catch (err) {
        console.error('Failed to delete bookmark', err);
        toast.error('Failed to delete bookmark');
      }
    }
  };

  const toggleShowUrl = (bookmark: Bookmark) => {
    try {
      setBookmarks(bookmarks.map(b => 
        b.id === bookmark.id ? { ...b, showFullUrl: !b.showFullUrl } : b
      ));
      toast.success(bookmark.showFullUrl ? 'Hiding full URL' : 'Showing full URL');
    } catch (err) {
      console.error('Failed to toggle URL visibility', err);
      toast.error('Failed to update bookmark');
    }
  };

  const setBookmarkColor = (id: string, color: string) => {
    try {
      setBookmarks(bookmarks.map(b => 
        b.id === id ? { ...b, color } : b
      ));
      toast.success('Bookmark color updated');
    } catch (err) {
      console.error('Failed to update bookmark color', err);
      toast.error('Failed to update bookmark color');
    }
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
    toggleShowUrl,
    setBookmarkColor
  };
};
