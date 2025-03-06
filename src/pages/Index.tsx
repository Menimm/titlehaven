
import React, { useState } from 'react';
import Header from '@/components/Header';
import BookmarkForm from '@/components/BookmarkForm';
import BookmarkGrid from '@/components/BookmarkGrid';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCategories } from '@/hooks/useCategories';
import { useSearch } from '@/hooks/useSearch';
import { useBookmarkForm } from '@/hooks/useBookmarkForm';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Bookmark } from '@/lib/types';

const Index = () => {
  // View mode state (grid or list)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const savedViewMode = localStorage.getItem('viewMode');
    return (savedViewMode === 'list' ? 'list' : 'grid') as 'grid' | 'list';
  });

  // Custom hooks
  const { 
    bookmarks, 
    bookmarkToDelete, 
    addBookmark, 
    updateBookmark, 
    deleteBookmark, 
    confirmDeleteBookmark, 
    cancelDelete, 
    toggleShowUrl 
  } = useBookmarks();
  
  const { categories, addCategory } = useCategories();
  
  const { 
    isFormOpen, 
    editingBookmark, 
    openAddForm, 
    openEditForm, 
    closeForm 
  } = useBookmarkForm();
  
  const { 
    searchTerm, 
    setSearchTerm, 
    filteredBookmarks, 
    sortedBookmarks, 
    isLoading 
  } = useSearch(bookmarks);

  const { settings } = useAppSettings();

  // Toggle between grid and list view
  const handleToggleViewMode = () => {
    const newMode = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newMode);
    localStorage.setItem('viewMode', newMode);
  };

  // Handle save bookmark action (add or update)
  const handleSaveBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'createdAt' | 'favicon'>) => {
    if (editingBookmark) {
      updateBookmark(editingBookmark.id, bookmarkData);
    } else {
      addBookmark(bookmarkData);
    }
    closeForm();
  };

  // Handle add bookmark action
  const handleAddBookmark = () => {
    openAddForm();
  };

  // Handle edit bookmark action
  const handleEditBookmark = (bookmark: Bookmark) => {
    openEditForm(bookmark);
  };

  // Handle delete bookmark action
  const handleDeleteBookmarkIntent = (bookmark: Bookmark) => {
    deleteBookmark(bookmark);
  };

  // Handle toggle show URL action
  const handleToggleShowUrl = (bookmark: Bookmark) => {
    toggleShowUrl(bookmark);
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: settings?.backgroundColor || 'var(--background)',
        color: settings?.backgroundColor ? 'inherit' : 'var(--foreground)'
      }}
    >
      <Header 
        onAddBookmark={handleAddBookmark}
        bookmarkCount={filteredBookmarks.length}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
      />
      
      <main className="flex-grow container max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
          onClearSearch={() => setSearchTerm('')}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        ) : filteredBookmarks.length > 0 ? (
          <BookmarkGrid 
            bookmarks={filteredBookmarks}
            onEditBookmark={handleEditBookmark}
            onDeleteBookmark={handleDeleteBookmarkIntent}
            onToggleShowUrl={handleToggleShowUrl}
            viewMode={viewMode}
            categories={categories}
          />
        ) : (
          <EmptyState onAddBookmark={handleAddBookmark} />
        )}
      </main>
      
      <BookmarkForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={handleSaveBookmark}
        editingBookmark={editingBookmark}
        categories={categories}
        onAddCategory={addCategory}
      />
      
      <DeleteConfirmation
        isOpen={!!bookmarkToDelete}
        onCancel={cancelDelete}
        onConfirm={confirmDeleteBookmark}
      />
    </div>
  );
};

export default Index;
