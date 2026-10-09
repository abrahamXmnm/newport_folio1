import { useEffect, useRef } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { HeroDotField } from './HeroDotField';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null); const progress = useScrollProgress();
  useEffect(() => { document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(3)); }, [progress]);
  useEffect(() => { const hero = heroRef.current; if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return; const move = (event: PointerEvent) => { const bounds = hero.getBoundingClientRect(); hero.style.setProperty('--cursor-x', ((event.clientX - bounds.left) / bounds.width).toFixed(3)); hero.style.setProperty('--cursor-y', ((event.clientY - bounds.top) / bounds.height).toFixed(3)); }; hero.addEventListener('pointermove', move); return () => hero.removeEventListener('pointermove', move); }, []);
  return <section ref={heroRef} className="hero section-grid" aria-labelledby="hero-title"><HeroDotField /><div className="hero-lines" aria-hidden="true"><i /><i /><i /><i /><i /></div><p className="eyebrow hero-index">01 / SIGNAL</p><div className="hero-title-wrap"><h1 id="hero-title"><span>ABRAHAM</span><span>C MARTIN</span></h1><p className="hero-subtitle">AI &amp; DATA SCIENCE <b>/</b> CREATIVE TECHNOLOGY</p></div><a className="scroll-cue" href="#profile">SCROLL TO ENTER <span>↓</span></a></section>;
}

export function Profile() {
  return <section className="profile section-grid" id="profile" aria-labelledby="profile-title"><p className="eyebrow">02 / PROFILE</p><h2 id="profile-title" className="section-title">WHO<br />AM I?</h2><div className="profile-copy"><p className="lead">I am Abraham C Martin, a fifth-semester student studying the space where intelligence meets expression.</p><dl className="identity-list"><div><dt>Academic identity</dt><dd>S5 AD</dd></div><div><dt>Primary field</dt><dd>Artificial Intelligence &amp; Data Science</dd></div><div><dt>College</dt><dd>Rajagiri School of Engineering and Technology (RSET)</dd></div><div><dt>Department</dt><dd>Department of Artificial Intelligence and Data Science</dd></div></dl><p className="interest-line">Visual design / Animation / Creative technology / Interactive experiences</p></div><div className="portrait reconstructable" role="img" aria-label="Abstract monochrome portrait placeholder for Abraham C Martin"><span className="portrait-mark">ACM</span><span className="portrait-coordinates">09° 58′ N<br />76° 17′ E</span><span className="portrait-scan" /></div></section>;
}

export function Expertise() {
  return <section className="expertise section-grid" aria-labelledby="expertise-title"><p className="eyebrow">03 / EXPERTISE</p><h2 id="expertise-title" className="section-title">A FEW<br />LANGUAGES.</h2><div className="expertise-list"><article><h3>AI</h3><p>Machine Learning<br />Computer Vision<br />Artificial Intelligence</p></article><article><h3>DATA</h3><p>Python<br />Data Analysis<br />Visualization</p></article><article><h3>CODE</h3><p>JavaScript<br />React<br />HTML / CSS</p></article><article><h3>DESIGN</h3><p>Graphic Design<br />Animation<br />Creative Technology</p></article></div></section>;
}

export function Gallery() {
  return <section className="archive section-grid" aria-labelledby="archive-title"><p className="eyebrow">06 / ARCHIVE</p><h2 id="archive-title" className="section-title">OTHER<br />FREQUENCIES.</h2><div className="archive-grid"><div className="archive-piece archive-tall"><span>VISUAL<br />DESIGN</span></div><div className="archive-piece archive-wide"><span>ANIMATION<br />/ FRAME 001</span></div><div className="archive-piece archive-small"><span>EVENT<br />WORK</span></div><div className="archive-piece archive-small archive-red"><span>CREATIVE<br />EXPERIMENTS</span></div></div></section>;
}

export function CV() {
  return <section className="cv section-grid" id="cv" aria-labelledby="cv-title"><p className="eyebrow">07 / CV</p><div><h2 id="cv-title" className="section-title">THE<br />SHORT<br />VERSION.</h2><a className="outline-button" href="#cv">DOWNLOAD CV <span>↗</span></a></div><div className="cv-details"><div><span>EDUCATION</span><p>S5 AD<br />Rajagiri School of Engineering and Technology</p></div><div><span>TECHNICAL EXPERTISE</span><p>Artificial Intelligence &amp; Data Science<br />Creative Technology / Visual Design</p></div><div><span>PROJECTS</span><p>CropGuard AI / Void Wars<br />Canvas Drift Racing Scene / SYNAPSE Magazine</p></div><div><span>ACTIVITIES</span><p>Animation / Interactive experiences</p></div></div></section>;
}
