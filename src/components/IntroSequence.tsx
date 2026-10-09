import type { IntroStage } from '../hooks/useIntroSequence';

type Props = { stage: IntroStage; glitchActive: boolean };

export function IntroSequence({ stage, glitchActive }: Props) {
  return <div className={`opening ${stage === 'complete' ? 'is-complete' : ''}`} data-stage={stage} aria-hidden="true"><span className="opening-time">04:27:19</span><span className="opening-line" /><span className="opening-fragment fragment-a">AB</span><span className="opening-fragment fragment-b">RAHAM</span><span className="opening-fragment fragment-c">C</span><span className="opening-fragment fragment-d">MARTIN</span><span className={`opening-ghost ghost-one ${glitchActive ? 'glitch-active' : ''}`}>ABRAHAM</span><span className="opening-ghost ghost-two">ABRAHAM</span></div>;
}
