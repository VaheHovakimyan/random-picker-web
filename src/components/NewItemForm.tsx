import React from 'react';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export function NewItemForm({ categoryId }: { categoryId: string }) {
  const { addItem } = useStore();
  const [newItemName, setNewItemName] = React.useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() && categoryId) {
      addItem(categoryId, newItemName.trim());
      setNewItemName('');
    }
  };

  return (
    <form onSubmit={handleAddItem} className="flex gap-2 p-4">
      <Input
        type="text"
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
        placeholder="Add a new item"
        className="flex-grow"
      />
      <Button type="submit" size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}
