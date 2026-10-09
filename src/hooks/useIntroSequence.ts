import { useCallback, useEffect, useState } from 'react';

export type IntroStage = 'empty' | 'line' | 'fragments' | 'assemble' | 'glitch' | 'clean' | 'complete';
const SESSION_KEY = 'signal-intro-seen';

export function useIntroSequence(reducedMotion: boolean) {
  const [stage, setStage] = useState<IntroStage>(() => reducedMotion || (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) ? 'complete' : 'empty');

  const playIntro = useCallback(() => {
    if (reducedMotion) { setStage('complete'); return; }
    setStage('empty');
    const timers = [
      window.setTimeout(() => setStage('line'), 50),
      window.setTimeout(() => setStage('fragments'), 650),
      window.setTimeout(() => setStage('assemble'), 1500),
      window.setTimeout(() => setStage('glitch'), 2700),
      window.setTimeout(() => setStage('clean'), 3150),
      window.setTimeout(() => { setStage('complete'); sessionStorage.setItem(SESSION_KEY, 'true'); }, 3900),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [reducedMotion]);

  useEffect(() => { if (stage !== 'complete' && !sessionStorage.getItem(SESSION_KEY)) return playIntro(); }, [playIntro]);

  const replay = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    playIntro();
  }, [playIntro, reducedMotion]);

  return { stage, playIntro, replay };
}
