import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { ProjectVisualType } from '../data/projects';

type Props = { type: ProjectVisualType; active: boolean };

export function ProjectVisual({ type, active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active || (type !== 'data' && type !== 'ascii')) return;
    const canvas = canvasRef.current; const context = canvas?.getContext('2d'); if (!canvas || !context) return;
    const resize = () => { const bounds = canvas.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 1.5); canvas.width = bounds.width * dpr; canvas.height = bounds.height * dpr; context.setTransform(dpr, 0, 0, dpr, 0, 0); };
    let frame = 0; const started = performance.now(); let target = { x: .5, y: .5 };
    const move = (event: PointerEvent) => { const bounds = canvas.getBoundingClientRect(); target = { x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height }; };
    const draw = (now: number) => { const time = now - started; const { width, height } = canvas.getBoundingClientRect(); context.clearRect(0, 0, width, height); context.lineWidth = .8;
      if (type === 'data') { for (let index = 0; index < 22; index += 1) { const x = width * (.08 + index / 22 * .84); const y = height * (.48 + Math.sin(index * 1.8 + time * .001) * .22 + Math.sin(index * .34) * .1); context.fillStyle = index % 5 === 0 ? '#2457FF' : 'rgba(17,17,17,.42)'; context.fillRect(x, y, 2.2, 2.2); if (index) { context.beginPath(); context.moveTo(x - width / 22, y); context.lineTo(x, y); context.strokeStyle = 'rgba(17,17,17,.18)'; context.stroke(); } } context.beginPath(); context.moveTo(width * .08, height * .76); context.bezierCurveTo(width * .32, height * .35, width * .58, height * .72, width * .92, height * .2); context.strokeStyle = 'rgba(36,87,255,.5)'; context.stroke(); }
      else { context.fillStyle = 'rgba(244,244,241,.65)'; context.font = '10px monospace'; for (let index = 0; index < 20; index += 1) context.fillText(index % 3 ? '·' : '010', ((index * 73 + time * .02) % (width + 30)) - 15, (index * 47) % height); context.fillStyle = '#FF3B30'; context.fillRect(target.x * width - 2, target.y * height - 2, 4, 4); context.fillStyle = 'rgba(36,87,255,.7)'; context.fillText('VOID / ACTIVE', 12, height - 14); }
      frame = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize', resize); canvas.addEventListener('pointermove', move); frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); canvas.removeEventListener('pointermove', move); };
  }, [active, type]);
  const visualClass = type === 'data' ? 'crop-visual' : type === 'ascii' ? 'void-visual' : type === 'drift' ? 'drift-visual' : 'synapse-visual';
  const reconstructionClass = type === 'editorial' ? '' : ' reconstructable';
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (type !== 'editorial' || !visualRef.current) return;
    const bounds = visualRef.current.getBoundingClientRect();
    visualRef.current.style.setProperty('--synapse-cursor-x', `${((event.clientX - bounds.left) / bounds.width - .5) * 2}`);
    visualRef.current.style.setProperty('--synapse-cursor-y', `${((event.clientY - bounds.top) / bounds.height - .5) * 2}`);
  };
  return <div ref={visualRef} onPointerMove={handlePointerMove} className={`project-visual ${visualClass}${reconstructionClass}`} role="img" aria-label={type === 'editorial' ? 'SYNAPSE Magazine front cover with interactive corner framing' : `${type} project visual placeholder`}><canvas ref={canvasRef} className={`project-canvas ${type === 'data' ? 'crop-canvas' : 'void-canvas'}`} aria-hidden={type !== 'ascii'} />{type === 'editorial' && <><img className="synapse-cover" src="/AD-MAGAZINE.png" alt="SYNAPSE Magazine front cover" loading="lazy" /><span className="synapse-corner-art" aria-hidden="true"><i className="synapse-corner synapse-corner-top" /><i className="synapse-corner synapse-corner-bottom" /><i className="synapse-corner-dot" /><i className="synapse-corner-cross" /></span></>}{type !== 'editorial' && <span className={`${type === 'data' ? 'crop-ring' : type === 'ascii' ? 'void-orbit' : 'drift-track'}`} /> }<span className={`${type}-label`}>{type === 'data' ? 'FIELD / 01' : type === 'ascii' ? 'PLAYER / 02' : type === 'drift' ? 'SPEED / 03' : 'ISSUE / 04'}</span>{type === 'data' && <span className="crop-axis" />}{type === 'ascii' && <span className="void-core" />}{type === 'drift' && <span className="drift-car" />}</div>;
}
