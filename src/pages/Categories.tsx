
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Category } from '@/lib/types';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Edit, Trash2, ArrowLeft, Plus, GripVertical, Eye, EyeOff, Palette } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useAppSettings } from '@/hooks/useAppSettings';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Checkbox } from '@/components/ui/checkbox';
import ColorPicker from '@/components/ColorPicker';

const Categories = () => {
  const navigate = useNavigate();
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    toggleCategoryVisibility,
    setCategoryColor,
    reorderCategories 
  } = useCategories();
  
  const { settings, setBackgroundColor } = useAppSettings();

  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    addCategory(newCategory.trim());
    setNewCategory('');
    toast.success('Category added');
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    
    updateCategory(editingCategory.id, editingCategory.name);
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
    reorderCategories(updatedCategories);
    setCategoryToDelete(null);
    toast.success('Category deleted');
  };

  const handleToggleVisibility = (category: Category) => {
    toggleCategoryVisibility(category.id);
    toast.success(`Category ${category.visible ? 'hidden' : 'shown'}`);
  };

  const handleSetCategoryColor = (categoryId: string, color: string) => {
    setCategoryColor(categoryId, color);
    toast.success('Category color updated');
  };

  const handleSetBackgroundColor = (color: string) => {
    setBackgroundColor(color);
    toast.success('Background color updated');
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    reorderCategories(updatedItems);
    toast.success('Categories reordered');
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: settings.backgroundColor || 'var(--background)',
        color: settings.backgroundColor ? 'inherit' : 'var(--foreground)'
      }}
    >
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
          <h2 className="text-xl font-semibold mb-4">App Background</h2>
          <div className="flex items-center gap-4">
            <ColorPicker 
              color={settings.backgroundColor} 
              onChange={handleSetBackgroundColor}
              label="Page Background Color"
            />
            {settings.backgroundColor && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSetBackgroundColor('')}
              >
                Reset to Default
              </Button>
            )}
          </div>
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
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop to reorder categories. Set colors, visibility, and more for each category.
          </p>
          {categories.length === 0 ? (
            <p className="text-muted-foreground">No categories found.</p>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {categories.map((category, index) => (
                      <Draggable 
                        key={category.id} 
                        draggableId={category.id} 
                        index={index}
                      >
                        {(provided) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center justify-between p-3 rounded-md border bg-background"
                            style={{ 
                              backgroundColor: category.color || '',
                              ...provided.draggableProps.style
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                {...provided.dragHandleProps}
                                className="cursor-grab"
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <span className="font-medium">{category.name}</span>
                              <ColorPicker 
                                color={category.color} 
                                onChange={(color) => handleSetCategoryColor(category.id, color)}
                                className="ml-2"
                                label=""
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  id={`visibility-${category.id}`}
                                  checked={category.visible}
                                  onCheckedChange={() => handleToggleVisibility(category)}
                                />
                                <label 
                                  htmlFor={`visibility-${category.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {category.visible ? (
                                    <span className="flex items-center gap-1">
                                      <Eye className="h-4 w-4" />
                                      Visible
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                      <EyeOff className="h-4 w-4" />
                                      Hidden
                                    </span>
                                  )}
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingCategory(category)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setCategoryToDelete(category)}
                                  disabled={categories.length <= 1}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
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
    </div>
  );
};

export default Categories;
