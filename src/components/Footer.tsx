type Props = { onReplay: () => void };

export function Footer({ onReplay }: Props) {
  return <footer className="site-footer"><strong>SIGNAL LOST.</strong><a href="#top" onClick={(event) => { event.preventDefault(); onReplay(); }}>REPLAY EXPERIENCE ↗</a><span>© 2026 ABRAHAM C MARTIN</span></footer>;
}
