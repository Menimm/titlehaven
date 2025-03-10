
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get contrasting text color (black or white) based on background color
 * @param bgColor Background color in hex format (e.g. #FFFFFF)
 * @returns 'black' or 'white' based on which has better contrast
 */
export function getContrastColor(bgColor: string): string {
  // Default to black if no color or invalid color
  if (!bgColor || bgColor === '') return 'inherit';
  
  // Remove hash if present
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1) : bgColor;
  
  // Handle shortened hex format (e.g. #FFF)
  const r = color.length === 3 
    ? parseInt(color.substring(0, 1).repeat(2), 16)
    : parseInt(color.substring(0, 2), 16);
  const g = color.length === 3 
    ? parseInt(color.substring(1, 2).repeat(2), 16) 
    : parseInt(color.substring(2, 4), 16);
  const b = color.length === 3 
    ? parseInt(color.substring(2, 3).repeat(2), 16)
    : parseInt(color.substring(4, 6), 16);
  
  // If invalid values, return 'inherit'
  if (isNaN(r) || isNaN(g) || isNaN(b)) return 'inherit';
  
  // Calculate relative luminance using the formula from WCAG 2.0
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for bright colors, white for dark colors
  return luminance > 0.5 ? 'black' : 'white';
}
