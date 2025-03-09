
import { useState, useEffect } from 'react';
import { Category } from '@/lib/types';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all categories have the required properties
        return parsed.map((cat: Category, index: number) => ({
          ...cat,
          order: cat.order !== undefined ? cat.order : index,
          visible: cat.visible !== undefined ? cat.visible : true,
          color: cat.color || undefined
        }));
      } catch (e) {
        console.error('Failed to parse categories from localStorage', e);
        return [{ id: 'default', name: 'General', order: 0, visible: true }];
      }
    }
    return [{ id: 'default', name: 'General', order: 0, visible: true }];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (name: string) => {
    const maxOrder = Math.max(...categories.map(cat => cat.order || 0), 0);
    const newCategory = { 
      id: generateId(), 
      name, 
      order: maxOrder + 1,
      visible: true 
    };
    setCategories([...categories, newCategory]);
    return newCategory.id;
  };

  const updateCategory = (id: string, name: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name } : cat
    ));
  };

  const toggleCategoryVisibility = (id: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === id) {
        // Debug log to verify current state before toggling
        console.log(`Toggling category ${id} from ${cat.visible} to ${!cat.visible}`);
        return { ...cat, visible: !cat.visible };
      }
      return cat;
    }));
  };

  const setCategoryColor = (id: string, color: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, color } : cat
    ));
  };

  const reorderCategories = (newOrder: Category[]) => {
    setCategories(newOrder);
  };

  return {
    categories,
    addCategory,
    updateCategory,
    toggleCategoryVisibility,
    setCategoryColor,
    reorderCategories
  };
};
