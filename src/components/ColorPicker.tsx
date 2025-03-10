
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color?: string;
  onChange: (color: string) => void;
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PRESET_COLORS = [
  '#FFFFFF', // White
  '#F8F9FA', // Light Gray
  '#E9ECEF', // Lighter Gray
  '#DEE2E6', // Light Blue Gray
  '#CED4DA', // Blue Gray
  '#F8F9D7', // Light Yellow
  '#E3F2FD', // Light Blue
  '#E8F5E9', // Light Green
  '#FFF3E0', // Light Orange
  '#FCE4EC', // Light Pink
  '#F3E5F5', // Light Purple
  '#FFEBEE', // Light Red
  '#E0F7FA', // Light Cyan
  '#FFF8E1', // Light Amber
  '#F1F8E9', // Light Lime

  // Adding darker colors for better contrast in dark mode
  '#121212', // Almost Black
  '#212121', // Dark Gray
  '#323232', // Medium Dark Gray
  '#454545', // Medium Gray
  '#1A237E', // Deep Indigo
  '#311B92', // Deep Purple
  '#880E4F', // Deep Pink
  '#B71C1C', // Deep Red
  '#004D40', // Deep Teal
  '#0D47A1', // Deep Blue
  '#F57F17', // Deep Orange
  '#33691E', // Deep Green
];

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color, 
  onChange, 
  className,
  label = "Select Color",
  size = 'md'
}) => {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectedColor, setSelectedColor] = useState(color || '#FFFFFF');
  const colorPaletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedColor(color || '#FFFFFF');
  }, [color]);

  // Handle pointer events for drag selection
  useEffect(() => {
    if (!dragging) return;
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!dragging || !colorPaletteRef.current) return;
      
      // Find the element under the pointer
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element && element.classList.contains('color-preset')) {
        const newColor = element.getAttribute('data-color');
        if (newColor && newColor !== selectedColor) {
          setSelectedColor(newColor);
          onChange(newColor);
        }
      }
    };
    
    const handlePointerUp = () => {
      setDragging(false);
    };
    
    // Add listeners to window to catch events outside the component
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging, onChange, selectedColor]);

  const handleColorSelect = (newColor: string, e?: React.MouseEvent) => {
    // If there's an event, prevent propagation to stop dialog closing
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    onChange(newColor);
    setSelectedColor(newColor);
  };

  const handlePointerDown = (e: React.PointerEvent, color: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    handleColorSelect(color);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-12 h-12';
      default: return 'w-10 h-10';
    }
  };

  // Prevent propagation on the entire component
  const stopPropagation = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={cn("flex items-center gap-2", className)} 
      onClick={stopPropagation}
      onPointerDown={stopPropagation}
    >
      {label && <span className="text-sm">{label}</span>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(getSizeClasses(), "p-0 border-2")}
            style={{ backgroundColor: selectedColor }}
            onClick={stopPropagation}
          >
            <span className="sr-only">Open color picker</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-64" 
          onClick={stopPropagation}
          onPointerDown={stopPropagation}
        >
          <div 
            ref={colorPaletteRef}
            className="grid grid-cols-8 gap-1"
            onClick={stopPropagation}
            onPointerDown={stopPropagation}
          >
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                className={cn(
                  "color-preset w-6 h-6 rounded-md border border-gray-300 cursor-pointer touch-none",
                  selectedColor === presetColor && "ring-2 ring-primary"
                )}
                style={{ backgroundColor: presetColor }}
                data-color={presetColor}
                onPointerDown={(e) => handlePointerDown(e, presetColor)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleColorSelect(presetColor, e);
                }}
                aria-label={`Select color ${presetColor}`}
              />
            ))}
          </div>
          <div 
            className="mt-3" 
            onClick={stopPropagation}
            onPointerDown={stopPropagation}
          >
            <label className="block text-sm mb-1">Custom Color</label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleColorSelect(e.target.value);
              }}
              onClick={stopPropagation}
              onPointerDown={stopPropagation}
              className="w-full h-8 cursor-pointer"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
