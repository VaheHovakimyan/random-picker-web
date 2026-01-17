import React from 'react';
import { useStore } from '@/store/useStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, X, Edit, Check, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/Dialog';

export function CategoryTabs() {
  const {
    categories,
    currentCategoryId,
    setCurrentCategoryId,
    addCategory,
    editCategory,
    deleteCategory,
  } = useStore();
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [editingTab, setEditingTab] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddDialogOpen(false);
    }
  };

  const handleEditCategory = (id: string, currentName: string) => {
    setEditingTab(id);
    setEditingName(currentName);
  };

  const handleUpdateCategory = (id: string) => {
    if (editingName.trim()) {
      editCategory(id, editingName.trim());
      setEditingTab(null);
      setEditingName('');
    }
  };

  return (
    <div className="px-4">
      <Tabs value={currentCategoryId ?? ''} onValueChange={setCurrentCategoryId}>
        <div className="flex items-center gap-2">
          <TabsList>
            {categories.map((category) => (
              <div key={category.id} className="relative group">
                <TabsTrigger value={category.id} className="pr-8">
                  {editingTab === category.id ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleUpdateCategory(category.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory(category.id)}
                      className="h-7 w-24"
                      autoFocus
                    />
                  ) : (
                    <span>{category.name}</span>
                  )}
                </TabsTrigger>
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(category.id, category.name);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCategory(category.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </TabsList>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <DialogFooter>
                <Button onClick={handleAddCategory}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} />
        ))}
      </Tabs>
    </div>
  );
}
