
import React from 'react';
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
import { Bookmark } from '@/lib/types';

const Index = () => {
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
    sortedBookmarks 
  } = useSearch(bookmarks);

  // Handle save bookmark action (add or update)
  const handleSaveBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'createdAt' | 'favicon'>) => {
    if (editingBookmark) {
      updateBookmark(editingBookmark.id, bookmarkData);
    } else {
      addBookmark(bookmarkData);
    }
    closeForm();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onAddBookmark={openAddForm} bookmarkCount={bookmarks.length} />
      
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
          <EmptyState onAddBookmark={openAddForm} />
        ) : filteredBookmarks.length === 0 ? (
          <EmptyState 
            onAddBookmark={openAddForm} 
            isSearching={true} 
            searchTerm={searchTerm}
          />
        ) : (
          <BookmarkGrid
            bookmarks={sortedBookmarks}
            onEditBookmark={openEditForm}
            onDeleteBookmark={deleteBookmark}
            onToggleShowUrl={toggleShowUrl}
            className="mt-8"
          />
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
