import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';

const Reel = ({ items, finalIndex, spinTime }: { items: string[], finalIndex: number, spinTime: number }) => {
  const itemHeight = 64; // h-16
  const extendedItems = [...items, ...items, ...items];
  const finalPosition = -(items.length + finalIndex) * itemHeight;

  return (
    <div className="h-16 w-full overflow-hidden bg-secondary rounded-lg">
      <motion.div
        animate={{ y: [0, finalPosition] }}
        transition={{
          duration: spinTime,
          ease: 'easeOut',
        }}
      >
        {extendedItems.map((item, i) => (
          <div key={i} className="h-16 flex items-center justify-center text-2xl font-bold">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export function Slot() {
  const { categories, currentCategoryId, settings, setWinner } = useStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerItem, setWinnerItem] = useState<{ item: string, index: number } | null>(null);

  const currentCategory = categories.find(c => c.id === currentCategoryId);
  const items = currentCategory?.items ?? [];

  const spin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    setWinnerItem(null);

    const randomIndex = Math.floor(Math.random() * items.length);
    const selectedWinner = items[randomIndex];
    
    setTimeout(() => {
      setWinnerItem({ item: selectedWinner.name, index: randomIndex });
    }, 100); // give it a moment to render reels

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(selectedWinner);
    }, settings.spinTime * 1000 + 500);
  };
  
  const maxItemLength = Math.max(...items.map(i => i.name.length), 0);
  const characters = Array.from({ length: maxItemLength }, (_, i) => 
    [...new Set(items.map(item => item.name[i] || ' '))]
  );

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
      <div className="grid grid-flow-col gap-4">
        {winnerItem ? (
          characters.map((charList, i) => (
            <Reel
              key={i}
              items={charList}
              finalIndex={charList.indexOf(winnerItem.item[i] || ' ')}
              spinTime={settings.spinTime + i * 0.2}
            />
          ))
        ) : (
          characters.map((_, i) => (
             <div key={i} className="h-16 w-12 flex items-center justify-center text-4xl bg-secondary rounded-lg">?</div>
          ))
        )}
      </div>
      <Button onClick={spin} disabled={isSpinning || items.length < 2} size="lg">
        {isSpinning ? 'Spinning...' : 'Spin'}
      </Button>
    </div>
  );
}
