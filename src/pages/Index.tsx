import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BookmarkForm from '@/components/BookmarkForm';
import BookmarkGrid from '@/components/BookmarkGrid';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import { Bookmark, Category } from '@/lib/types';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

const Index = () => {
  // State
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
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse categories from localStorage', e);
        return [{ id: 'default', name: 'General' }];
      }
    }
    return [{ id: 'default', name: 'General' }];
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkToDelete, setBookmarkToDelete] = useState<string | null>(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);
  
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Handlers
  const handleAddBookmark = () => {
    setEditingBookmark(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsFormOpen(true);
  };
  
  const handleSaveBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'createdAt' | 'favicon'>) => {
    if (editingBookmark) {
      // Update existing bookmark
      setBookmarks(bookmarks.map(b => 
        b.id === editingBookmark.id 
          ? { 
              ...b, 
              ...bookmarkData, 
              showFullUrl: b.showFullUrl,
              favicon: getFaviconForUrl(bookmarkData.url)
            } 
          : b
      ));
      toast.success('Bookmark updated successfully');
    } else {
      // Add new bookmark
      const newBookmark: Bookmark = {
        id: generateId(),
        ...bookmarkData,
        favicon: getFaviconForUrl(bookmarkData.url),
        createdAt: new Date(),
        showFullUrl: false
      };
      setBookmarks([...bookmarks, newBookmark]);
      toast.success('Bookmark added successfully');
    }
    
    setIsFormOpen(false);
    setEditingBookmark(undefined);
  };
  
  const handleDeleteBookmark = (id: string) => {
    setBookmarkToDelete(id);
  };
  
  const confirmDeleteBookmark = () => {
    if (bookmarkToDelete) {
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkToDelete));
      toast.success('Bookmark deleted');
      setBookmarkToDelete(null);
    }
  };
  
  const handleAddCategory = (name: string) => {
    const newCategory = { id: generateId(), name };
    setCategories([...categories, newCategory]);
    return newCategory.id;
  };

  const handleToggleShowUrl = (id: string, value: boolean) => {
    setBookmarks(bookmarks.map(b => 
      b.id === id ? { ...b, showFullUrl: value } : b
    ));
    toast.success(value ? 'Showing full URL' : 'Hiding full URL');
  };
  
  // Helper functions
  const getFaviconForUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}`;
    } catch {
      return undefined;
    }
  };
  
  // Filter bookmarks based on search term
  const filteredBookmarks = bookmarks.filter(bookmark => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      bookmark.title.toLowerCase().includes(search) ||
      bookmark.url.toLowerCase().includes(search) ||
      (bookmark.description && bookmark.description.toLowerCase().includes(search)) ||
      bookmark.category.toLowerCase().includes(search)
    );
  });

  // Sort bookmarks by category and then by creation date (newest first)
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header onAddBookmark={handleAddBookmark} bookmarkCount={bookmarks.length} />
      
      <main className="flex-1 container max-w-7xl px-4 sm:px-6 pb-16">
        {bookmarks.length > 0 && (
          <div className="max-w-md mx-auto sm:max-w-none my-6">
            <SearchBar 
              value={searchTerm} 
              onChange={setSearchTerm} 
            />
          </div>
        )}
        
        {bookmarks.length === 0 ? (
          <EmptyState onAddBookmark={handleAddBookmark} />
        ) : filteredBookmarks.length === 0 ? (
          <EmptyState 
            onAddBookmark={handleAddBookmark} 
            isSearching={true} 
            searchTerm={searchTerm}
          />
        ) : (
          <BookmarkGrid
            bookmarks={sortedBookmarks}
            onEditBookmark={handleEditBookmark}
            onDeleteBookmark={handleDeleteBookmark}
            onToggleShowUrl={handleToggleShowUrl}
            className="mt-8"
          />
        )}
      </main>
      
      <BookmarkForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveBookmark}
        editingBookmark={editingBookmark}
        categories={categories}
        onAddCategory={handleAddCategory}
      />
      
      <AlertDialog open={!!bookmarkToDelete} onOpenChange={(open) => !open && setBookmarkToDelete(null)}>
        <AlertDialogContent className="animate-fade-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bookmark? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteBookmark}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
