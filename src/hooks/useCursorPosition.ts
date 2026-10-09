import { useEffect, useState } from 'react';

export function useCursorPosition(element: HTMLElement | null, enabled: boolean) {
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!element || !enabled) return;
    let frame = 0;
    let next = position;
    const update = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      next = { x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height };
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPosition(next));
    };
    element.addEventListener('pointermove', update);
    return () => { element.removeEventListener('pointermove', update); cancelAnimationFrame(frame); };
  }, [element, enabled, position]);

  return position;
}
