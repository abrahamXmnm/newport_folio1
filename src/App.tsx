import { useEffect } from 'react';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { GlitchTransition } from './components/GlitchTransition';
import { IntroSequence } from './components/IntroSequence';
import { Lab } from './components/Lab';
import { Navigation } from './components/Navigation';
import { ProjectSection } from './components/ProjectSection';
import { SignalField } from './components/SignalField';
import { CV, Expertise, Gallery, Hero, Profile } from './components/PortfolioSections';
import { useGlitch } from './hooks/useGlitch';
import { useIntroSequence } from './hooks/useIntroSequence';
import { useReducedMotion } from './hooks/useReducedMotion';

export default function App() {
  const reducedMotion = useReducedMotion();
  const { stage, replay } = useIntroSequence(reducedMotion);
  const { active: glitchActive, trigger } = useGlitch(reducedMotion);
  useEffect(() => { if (stage === 'glitch') trigger(360); }, [stage, trigger]);

  return <>
    <SignalField energy={glitchActive ? 1 : 0} />
    <IntroSequence stage={stage} glitchActive={glitchActive} />
    <GlitchTransition active={glitchActive} />
    <Navigation />
    <main id="top"><Hero /><Profile /><Expertise /><ProjectSection reducedMotion={reducedMotion} onProjectEnter={() => trigger(220)} /><Lab /><Gallery /><CV /><Contact /></main>
    <Footer onReplay={replay} />
  </>;
}
