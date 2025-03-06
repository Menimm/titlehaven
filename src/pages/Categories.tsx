
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Category } from '@/lib/types';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Edit, Trash2, ArrowLeft, Plus } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();
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

  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const saveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    const id = Math.random().toString(36).substring(2, 9);
    const updatedCategories = [...categories, { id, name: newCategory.trim() }];
    saveCategories(updatedCategories);
    setNewCategory('');
    toast.success('Category added');
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    
    const updatedCategories = categories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    );
    saveCategories(updatedCategories);
    setEditingCategory(null);
    toast.success('Category updated');
  };

  const handleDeleteCategory = () => {
    if (!categoryToDelete) return;
    
    // Get bookmarks to update their category if they use the deleted one
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      try {
        const bookmarks = JSON.parse(savedBookmarks);
        const updatedBookmarks = bookmarks.map((bookmark: any) => {
          if (bookmark.category === categoryToDelete.id) {
            return {
              ...bookmark,
              category: 'default' // Move to default category
            };
          }
          return bookmark;
        });
        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      } catch (e) {
        console.error('Failed to update bookmarks when deleting category', e);
      }
    }
    
    const updatedCategories = categories.filter(cat => cat.id !== categoryToDelete.id);
    saveCategories(updatedCategories);
    setCategoryToDelete(null);
    toast.success('Category deleted');
  };

  return (
    <div className="container max-w-4xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookmarks
        </Button>
        <h1 className="text-2xl font-bold">Manage Categories</h1>
      </div>
      
      <div className="bg-card rounded-lg border shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
        <div className="flex gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="flex-1"
          />
          <Button 
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Categories</h2>
        {categories.length === 0 ? (
          <p className="text-muted-foreground">No categories found.</p>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="flex items-center justify-between p-3 rounded-md border bg-background"
              >
                <span className="font-medium">{category.name}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingCategory(category)}
                    disabled={category.id === 'default'}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCategoryToDelete(category)}
                    disabled={category.id === 'default'}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Category Dialog */}
      <AlertDialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Category</AlertDialogTitle>
            <AlertDialogDescription>
              Update the name of this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={editingCategory?.name || ''}
              onChange={(e) => setEditingCategory(prev => prev ? {...prev, name: e.target.value} : null)}
              placeholder="Category name"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleUpdateCategory}
              disabled={!editingCategory?.name.trim()}
            >
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? All bookmarks in this category will be moved to the "General" category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;
