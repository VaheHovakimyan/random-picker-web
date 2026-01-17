import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useStore } from '@/store/useStore';

export function Confetti() {
  const { winner, settings } = useStore();
  const { width, height } = useWindowSize();

  if (!winner || !settings.confetti) {
    return null;
  }

  return (
    <ReactConfetti
      width={width}
      height={height}
      numberOfPieces={200}
      recycle={false}
      onConfettiComplete={(confetti) => {
        if (confetti) {
            confetti.reset();
        }
      }}
    />
  );
}
