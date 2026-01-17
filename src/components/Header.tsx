import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SettingsDialog } from '@/components/SettingsDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import React from 'react';

export function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Random Picker</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </header>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
}
