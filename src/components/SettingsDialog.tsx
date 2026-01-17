import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { useStore } from '@/store/useStore';

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, setSettings } = useStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your random picker experience.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Picker Type</Label>
            <RadioGroup
              value={settings.pickerType}
              onValueChange={(value) => setSettings({ pickerType: value as 'wheel' | 'slot' })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wheel" id="wheel" />
                <Label htmlFor="wheel">Wheel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="slot" id="slot" />
                <Label htmlFor="slot">Slot</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <Label>Spin Time: {settings.spinTime}s</Label>
            <Slider
              min={1}
              max={20}
              step={1}
              value={[settings.spinTime]}
              onValueChange={([value]) => setSettings({ spinTime: value })}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="sound-effects">Sound Effects</Label>
            <Switch
              id="sound-effects"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => setSettings({ soundEnabled: checked })}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="confetti-effect">Confetti Effect</Label>
            <Switch
              id="confetti-effect"
              checked={settings.confetti}
              onCheckedChange={(checked) => setSettings({ confetti: checked })}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
