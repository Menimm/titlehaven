
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
}
