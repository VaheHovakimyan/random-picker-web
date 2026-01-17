import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Header } from '@/components/Header';
import { CategoryTabs } from '@/components/CategoryTabs';
import { ItemList } from '@/components/ItemList';
import { NewItemForm } from '@/components/NewItemForm';
import { Picker } from '@/components/Picker';
import { Confetti } from '@/components/Confetti';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { categories, currentCategoryId, winner, addCategory, setCurrentCategoryId, addItem } = useStore();

  useEffect(() => {
    const isFirstRun = categories.length === 0;
    if (isFirstRun) {
      // Add default data if it's the first time
      addCategory('Movies');
      const state = useStore.getState();
      const moviesId = state.categories.find(c => c.name === 'Movies')?.id;
      if(moviesId) {
        addItem(moviesId, 'The Matrix');
        addItem(moviesId, 'Inception');
        addItem(moviesId, 'Interstellar');
        addItem(moviesId, 'Parasite');
      }

      addCategory('Music');
      const musicId = useStore.getState().categories.find(c => c.name === 'Music')?.id;
      if(musicId) {
        addItem(musicId, 'Rock');
        addItem(musicId, 'Pop');
        addItem(musicId, 'Hip Hop');
        addItem(musicId, 'Jazz');
      }

      addCategory('Lunch');
      const lunchId = useStore.getState().categories.find(c => c.name === 'Lunch')?.id;
      if(lunchId) {
        addItem(lunchId, 'Pizza');
        addItem(lunchId, 'Burger');
        addItem(lunchId, 'Salad');
        addItem(lunchId, 'Sushi');
      }
      
      // Set the current category to the first one
      const finalState = useStore.getState();
      if(finalState.categories.length > 0) {
          setCurrentCategoryId(finalState.categories[0].id);
      }

    } else if (!currentCategoryId && categories.length > 0) {
      setCurrentCategoryId(categories[0].id);
    }
  }, []); // Run only once on mount

  const currentCategory = categories.find(c => c.id === currentCategoryId);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Picker />
          </div>
          <div className="space-y-4">
            <CategoryTabs />
            {currentCategory && (
              <>
                <NewItemForm categoryId={currentCategory.id} />
                <ItemList categoryId={currentCategory.id} />
              </>
            )}
          </div>
        </div>
      </main>
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => useStore.getState().setWinner(null)}
          >
            <motion.div
              initial={{ scale: 0.5, y: -100 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card p-8 rounded-lg shadow-2xl text-center"
            >
              <h2 className="text-2xl font-bold mb-4">The Winner Is...</h2>
              <p className="text-4xl font-extrabold text-primary">{winner.name}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Confetti />
    </div>
  );
}

export default App;