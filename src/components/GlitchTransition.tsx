type Props = { active: boolean };

export function GlitchTransition({ active }: Props) {
  return <span className={`glitch-transition ${active ? 'is-active' : ''}`} aria-hidden="true" />;
}
