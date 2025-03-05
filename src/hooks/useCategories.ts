
import { useState, useEffect } from 'react';
import { Category } from '@/lib/types';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse categories from localStorage', e);
        return [{ id: 'default', name: 'General' }];
      }
    }
    return [{ id: 'default', name: 'General' }];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (name: string) => {
    const newCategory = { id: generateId(), name };
    setCategories([...categories, newCategory]);
    return newCategory.id;
  };

  return {
    categories,
    addCategory
  };
};
