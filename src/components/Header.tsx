
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, BookOpen, FolderCog, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onAddBookmark: () => void;
  bookmarkCount: number;
  viewMode: 'grid' | 'list';
  onToggleViewMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddBookmark, 
  bookmarkCount, 
  viewMode, 
  onToggleViewMode 
}) => {
  return (
    <header className="bg-background sticky top-0 border-b z-10">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Bookmark Haven</h1>
          <span className="hidden sm:inline-block ml-2 text-sm text-muted-foreground">
            ({bookmarkCount} bookmark{bookmarkCount !== 1 ? 's' : ''})
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggleViewMode}
            title={viewMode === 'grid' ? "Switch to list view" : "Switch to grid view"}
            className="mr-2"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>
          
          <Button variant="outline" size="sm" asChild>
            <Link to="/categories" className="flex items-center gap-2">
              <FolderCog className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </Link>
          </Button>
          
          <Button size="sm" onClick={onAddBookmark} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Bookmark</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
