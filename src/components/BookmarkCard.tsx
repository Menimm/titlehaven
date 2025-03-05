
import React, { useState } from 'react';
import { Bookmark } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Copy, ExternalLink, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onEdit, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookmark.url);
    toast.success('Link copied to clipboard');
  };
  
  const handleOpenLink = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return null;
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 h-full",
        "hover:shadow-md hover:border-primary/20",
        "animate-slide-up"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 max-w-[80%]">
            <div className="w-6 h-6 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
              {bookmark.url && (
                <img 
                  src={getFaviconUrl(bookmark.url)} 
                  alt="" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            <Badge variant="outline" className="text-xs font-normal">
              {bookmark.category}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(bookmark)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(bookmark.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div 
          className="flex-1 cursor-pointer"
          onClick={handleOpenLink}
        >
          <h3 className="font-medium line-clamp-2 mb-1 text-md">{bookmark.title}</h3>
          
          {bookmark.description && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
              {bookmark.description}
            </p>
          )}
          
          <div className="text-xs text-muted-foreground truncate">
            {bookmark.url.replace(/^https?:\/\//i, '')}
          </div>
        </div>
        
        <div className={cn(
          "mt-3 flex justify-end gap-2 transition-opacity duration-300",
          isHovering ? "opacity-100" : "opacity-0"
        )}>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleOpenLink}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookmarkCard;
