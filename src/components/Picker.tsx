import { useStore } from '@/store/useStore';
import { Wheel } from '@/components/Wheel';
import { Slot } from '@/components/Slot';
import { AnimatePresence, motion } from 'framer-motion';

export function Picker() {
  const { settings } = useStore();

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={settings.pickerType}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {settings.pickerType === 'wheel' ? <Wheel /> : <Slot />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
