
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Plus, Palette, Settings } from 'lucide-react';
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
    <header className="bg-card shadow">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Bookmark Haven</h1>
            <span className="ml-3 text-muted-foreground text-sm">
              {bookmarkCount} {bookmarkCount === 1 ? 'bookmark' : 'bookmarks'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onToggleViewMode}
              title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            >
              {viewMode === 'grid' ? <List className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
            </Button>
            
            <Link to="/categories" className="inline-block">
              <Button 
                variant="outline" 
                size="sm"
                title="Manage categories"
                className="flex items-center gap-2"
              >
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
              </Button>
            </Link>
            
            <Link to="/settings" className="inline-block">
              <Button 
                variant="outline" 
                size="sm"
                title="Settings"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
            
            <Button 
              onClick={onAddBookmark}
              title="Add bookmark"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Bookmark</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
