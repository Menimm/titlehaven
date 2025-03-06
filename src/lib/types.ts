
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  favicon?: string;
  createdAt: Date;
  showFullUrl?: boolean;
}

export interface Category {
  id: string;
  name: string;
  order?: number; // For drag and drop ordering
  visible?: boolean; // For show/hide functionality
  color?: string; // For category background color
}

// Add an interface for app settings
export interface AppSettings {
  backgroundColor?: string;
  // Add other app-wide settings here as needed
}
