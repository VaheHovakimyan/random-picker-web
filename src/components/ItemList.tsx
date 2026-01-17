import React from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Edit, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function ItemList({ categoryId }: { categoryId: string }) {
  const { categories, editItem, deleteItem } = useStore();
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState('');

  const currentCategory = categories.find((c) => c.id === categoryId);
  const items = currentCategory?.items ?? [];

  const handleEdit = (id: string, name: string) => {
    setEditingItemId(id);
    setEditingName(name);
  };

  const handleUpdate = (itemId: string) => {
    if (editingName.trim() && categoryId) {
      editItem(categoryId, itemId, editingName.trim());
      setEditingItemId(null);
      setEditingName('');
    }
  };

  return (
    <div className="p-4 space-y-2">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 p-2 rounded-md bg-secondary"
          >
            {editingItemId === item.id ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleUpdate(item.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdate(item.id)}
                autoFocus
                className="flex-grow"
              />
            ) : (
              <span className="flex-grow">{item.name}</span>
            )}

            <div className="flex items-center">
              {editingItemId === item.id ? (
                <Button size="icon" variant="ghost" onClick={() => handleUpdate(item.id)}>
                  <Check className="h-4 w-4" />
                </Button>
              ) : (
                <Button size="icon" variant="ghost" onClick={() => handleEdit(item.id, item.name)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button size="icon" variant="ghost" onClick={() => deleteItem(categoryId, item.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
