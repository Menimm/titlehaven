
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Bookmark, List } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface HeaderProps {
  onAddBookmark: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddBookmark }) => {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Bookmark className="h-6 w-6" />
          <span className="text-xl font-bold">Bookmark Haven</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle className="mr-2" />
          
          <Link to="/categories">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
              <List className="h-4 w-4" />
              Categories
            </Button>
          </Link>
          
          <Link to="/settings">
            <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
          
          <Button onClick={onAddBookmark} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Add Bookmark</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
