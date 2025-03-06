
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color?: string;
  onChange: (color: string) => void;
  className?: string;
  label?: string;
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
];

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color, 
  onChange, 
  className,
  label = "Select Color" 
}) => {
  const [open, setOpen] = useState(false);

  const handleColorSelect = (newColor: string) => {
    onChange(newColor);
    setOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <span className="text-sm">{label}</span>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-10 h-10 p-0 border-2"
            style={{ backgroundColor: color || '#FFFFFF' }}
          >
            <span className="sr-only">Open color picker</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                className={cn(
                  "w-8 h-8 rounded-md border border-gray-300 cursor-pointer",
                  color === presetColor && "ring-2 ring-primary"
                )}
                style={{ backgroundColor: presetColor }}
                onClick={() => handleColorSelect(presetColor)}
              />
            ))}
          </div>
          <div className="mt-3">
            <label className="block text-sm mb-1">Custom Color</label>
            <input
              type="color"
              value={color || '#FFFFFF'}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ColorPicker;
