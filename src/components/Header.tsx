
import React from 'react';
import { Bookmark, Link, PlusCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onAddBookmark: () => void;
  bookmarkCount: number;
}

const Header: React.FC<HeaderProps> = ({ onAddBookmark, bookmarkCount }) => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bookmark className="h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Bookmark Haven</h1>
          <div className="hidden sm:flex items-center ml-2 px-2 py-1 bg-secondary rounded-full text-xs font-medium">
            {bookmarkCount} {bookmarkCount === 1 ? 'bookmark' : 'bookmarks'}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "gap-2 transition-all duration-300", 
              "hover:bg-primary hover:text-primary-foreground"
            )}
            onClick={onAddBookmark}
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Bookmark</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
