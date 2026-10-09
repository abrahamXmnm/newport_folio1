import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import { ProjectVisual } from './ProjectVisual';
import { MagazineReader } from './MagazineReader';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

type Props = { onProjectEnter: () => void; reducedMotion: boolean };

function ProjectCard({ project, onEnter, onRead }: { project: Project; onEnter: () => void; onRead: () => void }) {
  const [active, setActive] = useState(false); const ref = useRef<HTMLElement>(null);
  useEffect(() => { const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setActive(true); onEnter(); } }, { threshold: .4 }); if (ref.current) observer.observe(ref.current); return () => observer.disconnect(); }, [onEnter]);
  const [first, ...rest] = project.title.split(' ');
  const projectClass = project.visualType === 'data' ? 'crop' : project.visualType === 'ascii' ? 'void' : project.visualType === 'editorial' ? 'synapse' : 'drift';
  return <article ref={ref} className={`project project-${projectClass}`} data-project={project.visualType}><div className="project-meta"><span>{project.number}</span><span>{project.category}</span></div><h3>{first}<br /><em>{rest.join(' ')}</em></h3><p>{project.description}</p><ProjectVisual type={project.visualType} active={active} /><div className="project-detail"><span>{project.technology}</span>{project.visualType === 'editorial' ? <button className="read-trigger" type="button" onClick={onRead}>READ MAGAZINE ↗</button> : <a href="#contact">VIEW PROJECT ↗</a>}</div></article>;
}

export function ProjectSection({ onProjectEnter, reducedMotion }: Props) {
  const workRef = useRef<HTMLElement>(null);
  const projectListRef = useRef<HTMLDivElement>(null);
  const [readerOpen, setReaderOpen] = useState(false);

  useEffect(() => {
    if (reducedMotion || !projectListRef.current) return;

    // Only apply horizontal scroll on desktop
    if (window.innerWidth <= 800) return;

    const projectList = projectListRef.current;
    const projectCards = projectList.querySelectorAll('.project');
    const projectCount = projectCards.length;

    // Calculate the total scroll distance needed
    // Each project should take 1.5x window height of scroll for proper pause/display
    const scrollPerProject = window.innerHeight * 1.5;
    const totalDistance = projectCount * scrollPerProject;

    // Create GSAP animation for horizontal scroll
    gsap.to(projectList, {
      x: () => -(projectList.scrollWidth - window.innerWidth),
      scrollTrigger: {
        trigger: workRef.current,
        start: 'top top',
        end: () => `+=${totalDistance}`,
        scrub: 0.8, // Slightly slower scrubbing for better pause effect
        pin: true, // Pin the container
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Update project visibility for animations
          projectCards.forEach((card, index) => {
            const progress = self.progress;
            const cardProgress = index / projectCount;
            if (Math.abs(progress - cardProgress) < 0.15) {
              card.classList.add('is-visible');
            } else {
              card.classList.remove('is-visible');
            }
          });
        },
      },
      ease: 'none',
    });

    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Kill the animation on cleanup
      gsap.killTweensOf(projectList);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [reducedMotion]);

  return (
    <>
      <section ref={workRef} className="work" id="work" aria-labelledby="work-title">
        <div className="section-grid work-heading">
          <p className="eyebrow">04 / SELECTED WORK</p>
          <h2 id="work-title" className="section-title">SIGNALS<br />IN MOTION.</h2>
        </div>
        <div ref={projectListRef} className="project-list">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEnter={onProjectEnter}
              onRead={() => setReaderOpen(true)}
            />
          ))}
        </div>
      </section>
      {readerOpen && <MagazineReader onClose={() => setReaderOpen(false)} />}
    </>
  );
}
