import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
  visible: boolean;
}

interface TextBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ParticleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const cursorRef = useRef({ x: 0, y: 0 });
  const textBoundsRef = useRef<TextBounds | null>(null);
  const animationRef = useRef<number>();

  // Get bounding box of hero title text
  const getTextBounds = (): TextBounds | null => {
    const titleElement = document.querySelector('h1');
    if (!titleElement) return null;
    const rect = titleElement.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const isPointInTextBounds = (x: number, y: number, bounds: TextBounds | null): boolean => {
    if (!bounds) return false;
    // Add padding around text bounds to create exclusion zone
    const padding = 40;
    return (
      x >= bounds.x - padding &&
      x <= bounds.x + bounds.width + padding &&
      y >= bounds.y - padding &&
      y <= bounds.y + bounds.height + padding
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reduce particle count on mobile
    const isMobile = window.matchMedia('(max-width: 800px)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Create particle grid
    const initializeParticles = () => {
      particlesRef.current = [];
      const gridSpacing = isMobile ? 90 : 80;
      const offsetX = canvas.width * 0.08;
      const offsetY = canvas.height * 0.12;
      const gridWidth = canvas.width * 0.84;
      const gridHeight = canvas.height * 0.76;

      textBoundsRef.current = getTextBounds();

      for (let x = offsetX; x < offsetX + gridWidth; x += gridSpacing) {
        for (let y = offsetY; y < offsetY + gridHeight; y += gridSpacing) {
          const particle: Particle = {
            x: x + (Math.random() - 0.5) * 2,
            y: y + (Math.random() - 0.5) * 2,
            originalX: x,
            originalY: y,
            vx: 0,
            vy: 0,
            visible: !isPointInTextBounds(x, y, textBoundsRef.current),
          };
          particlesRef.current.push(particle);
        }
      }
    };

    initializeParticles();

    // Handle cursor movement
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        cursorRef.current.x = e.touches[0].clientX;
        cursorRef.current.y = e.touches[0].clientY;
      }
    };

    // Animation loop
    const animate = () => {
      // Clear canvas - preserve background color
      ctx.fillStyle = 'rgba(244, 244, 241, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cursor = cursorRef.current;
      const repulsionRadius = 120;
      const maxDisplacement = 12;
      const friction = 0.88;
      const stiffness = 0.12;

      // Update particles
      particlesRef.current.forEach((particle) => {
        const dx = cursor.x - particle.x;
        const dy = cursor.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Subtle proximity-based displacement (not heavy trails)
        if (distance < repulsionRadius && distance > 1) {
          const force = (1 - distance / repulsionRadius) * 0.8; // Reduced from 3 to 0.8
          particle.vx -= (dx / distance) * force * 0.5;
          particle.vy -= (dy / distance) * force * 0.5;
        }

        // Return to original position with spring force
        const returnDx = particle.originalX - particle.x;
        const returnDy = particle.originalY - particle.y;
        particle.vx += returnDx * stiffness;
        particle.vy += returnDy * stiffness;

        // Apply friction
        particle.vx *= friction;
        particle.vy *= friction;

        // Cap maximum displacement to 10-15px range
        const distFromOriginal = Math.sqrt(
          (particle.x - particle.originalX) ** 2 +
          (particle.y - particle.originalY) ** 2
        );
        if (distFromOriginal > maxDisplacement) {
          const scale = maxDisplacement / distFromOriginal;
          particle.x = particle.originalX + (particle.x - particle.originalX) * scale;
          particle.y = particle.originalY + (particle.y - particle.originalY) * scale;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Check if particle should be visible (not in text bounds)
        particle.visible = !isPointInTextBounds(particle.x, particle.y, textBoundsRef.current);
      });

      // Draw particles only - NO connecting lines (removed heavy mesh)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)'; // Subtle: 0.12-0.25 range
      particlesRef.current.forEach((particle) => {
        if (particle.visible) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      setCanvasSize();
      initializeParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-grid"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
