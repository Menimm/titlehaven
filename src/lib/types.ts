
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  favicon?: string;
  createdAt: Date;
  showFullUrl?: boolean;
  color?: string; // For bookmark background color
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
  theme?: 'light' | 'dark' | 'system'; // Theme setting
  // Add other app-wide settings here as needed
}

// Backup types
export interface BackupVersion {
  id: string;
  name: string;
  timestamp: string;
  data: {
    bookmarks: Bookmark[];
    categories: Category[];
    settings: AppSettings;
  };
}
