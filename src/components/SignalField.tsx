import { useEffect, useRef } from 'react';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Props = { energy: number };

export function SignalField({ energy }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { lowPower } = useDeviceCapability();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    let frame = 0;
    let last = performance.now();
    let time = 0;
    let pointer = { x: .5, y: .5 };
    let smooth = { x: .5, y: .5 };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr); canvas.height = Math.floor(window.innerHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (event: PointerEvent) => { pointer = { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight }; };
    const draw = (now: number) => {
      const elapsed = now - last; last = now; time += elapsed * .001;
      smooth.x += (pointer.x - smooth.x) * .025; smooth.y += (pointer.y - smooth.y) * .025;
      const width = window.innerWidth; const height = window.innerHeight;
      context.clearRect(0, 0, width, height); context.lineWidth = .7;
      for (let row = -1; row < height / 58 + 2; row += 1) {
        context.beginPath(); const base = row * 58;
        for (let x = -30; x <= width + 30; x += 26) {
          const dx = x - smooth.x * width; const dy = base - smooth.y * height; const influence = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / Math.max(100, width * .24));
          const y = base + Math.sin(x * .006 + time * .18 + row * .7) * 10 + Math.sin(x * .014 - time * .12) * 4 + influence * Math.sin(x * .03 + time) * 18 * (1 + energy * 2);
          if (x === -30) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(17,17,17,${.045 + energy * .035})`; context.stroke();
      }
      frame = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize', resize); window.addEventListener('pointermove', move, { passive: true }); frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); };
  }, [energy, lowPower, reducedMotion]);

  return <canvas ref={canvasRef} className="signal-field" aria-hidden="true" />;
}
