
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkCardFooterProps {
  isHovering: boolean;
  onOpenLink: () => void;
}

const BookmarkCardFooter: React.FC<BookmarkCardFooterProps> = ({
  isHovering,
  onOpenLink
}) => {
  return (
    <div className={cn(
      "mt-3 flex justify-end gap-2 transition-opacity duration-300",
      isHovering ? "opacity-100" : "opacity-0"
    )}>
      <Button
        variant="outline"
        size="sm"
        className="h-8"
        onClick={onOpenLink}
      >
        <ExternalLink className="h-3.5 w-3.5 mr-1" />
        Open
      </Button>
    </div>
  );
};

export default BookmarkCardFooter;
