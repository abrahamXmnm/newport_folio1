import { useCallback, useState } from 'react';

export function useGlitch(reducedMotion: boolean) {
  const [active, setActive] = useState(false);
  const trigger = useCallback((duration = 280) => {
    if (reducedMotion) return;
    setActive(true);
    window.setTimeout(() => setActive(false), duration);
  }, [reducedMotion]);
  return { active, trigger };
}
