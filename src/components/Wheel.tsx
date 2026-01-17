import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';

const bgColors = [
  "#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6",
  "#FCA5A5", "#FCD34D", "#6EE7B7", "#93C5FD", "#C4B5FD", "#F9A8D4"
];

const getSegmentColors = (count: number) => {
  if (count === 0) return [];
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(bgColors[i % bgColors.length]);
  }
  return colors;
};

export function Wheel() {
  const { categories, currentCategoryId, settings, setWinner } = useStore();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const currentCategory = categories.find(c => c.id === currentCategoryId);
  const items = currentCategory?.items ?? [];
  const numItems = items.length;
  const anglePerItem = 360 / (numItems || 1);

  const segmentColors = getSegmentColors(numItems);
  const conicGradient = numItems > 0 
    ? `conic-gradient(${segmentColors.map((color, i) => `${color} ${i * anglePerItem}deg ${(i + 1) * anglePerItem}deg`).join(', ')})`
    : 'conic-gradient(#ddd 0deg 360deg)';

  const spin = () => {
    if (isSpinning || numItems < 2) return;

    setIsSpinning(true);
    setWinner(null);

    const randomItemIndex = Math.floor(Math.random() * numItems);
    // The pointer is at the top (0 degrees). We want the segment's center to align with the pointer.
    // The start of the winning segment is `randomItemIndex * anglePerItem`.
    // The center of the winning segment is `(randomItemIndex + 0.5) * anglePerItem`.
    // We need to rotate the wheel so that this center angle ends up at the top.
    // The rotation should be negative to bring it to the top.
    const targetAngle = 360 - (randomItemIndex * anglePerItem + anglePerItem / 2);

    const fullSpins = 5;
    const finalRotation = rotation + (360 * fullSpins) + targetAngle;
    
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(items[randomItemIndex]);
    }, settings.spinTime * 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="relative w-72 h-72 md:w-96 md:h-96 select-none">
        {/* Pointer */}
        <div 
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-10" 
          style={{ 
            width: 0, height: 0, 
            borderLeft: '15px solid transparent', 
            borderRight: '15px solid transparent', 
            borderTop: '30px solid hsl(var(--primary))'
          }}
        />

        {/* Wheel */}
        <motion.div
          className="relative w-full h-full rounded-full border-8 border-primary shadow-2xl overflow-hidden"
          style={{ background: conicGradient }}
          animate={{ rotate: rotation }}
          transition={{
            ease: 'easeOut',
            duration: settings.spinTime,
          }}
        >
          {items.map((item, i) => {
            const angle = anglePerItem * i + anglePerItem / 2;
            const radius = 130; // md: 180
            const x = Math.sin((angle * Math.PI) / 180) * radius;
            const y = -Math.cos((angle * Math.PI) / 180) * radius;

            return (
              <div
                key={item.id}
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`,
                }}
              >
                <span 
                  className="font-bold text-lg text-white" 
                  style={{ textShadow: '0 0 5px rgba(0,0,0,0.5)' }}
                >
                  {item.name}
                </span>
              </div>
            );
          })}
        </motion.div>
        
        {/* Center spin button */}
        <Button 
          onClick={spin} 
          disabled={isSpinning || numItems < 2}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full text-xl font-bold z-10"
        >
          SPIN
        </Button>
      </div>
    </div>
  );
}