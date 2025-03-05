
import React from 'react';
import { Bookmark, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddBookmark: () => void;
  isSearching?: boolean;
  searchTerm?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  onAddBookmark, 
  isSearching = false, 
  searchTerm = '' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Bookmark className="h-8 w-8 text-muted-foreground" />
      </div>
      
      {isSearching ? (
        <>
          <h3 className="text-xl font-medium mb-2">No bookmarks found</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            We couldn't find any bookmarks matching "{searchTerm}". 
            Try a different search term or add a new bookmark.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start by adding your first bookmark. You can organize them into categories 
            and access them all from this page.
          </p>
        </>
      )}
      
      <Button onClick={onAddBookmark} className="gap-2">
        <PlusCircle className="h-4 w-4" />
        Add Your First Bookmark
      </Button>
    </div>
  );
};

export default EmptyState;
