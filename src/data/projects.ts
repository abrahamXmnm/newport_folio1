export type ProjectVisualType = 'data' | 'ascii' | 'drift' | 'editorial';

export type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  technology: string;
  visualType: ProjectVisualType;
};

export const projects: Project[] = [
  { id: 'cropguard', number: '01', title: 'CROPGUARD', category: 'AI / AGRICULTURE', description: 'Machine intelligence for the living world.', technology: 'PYTHON / MACHINE LEARNING', visualType: 'data' },
  { id: 'void-wars', number: '02', title: 'VOID WARS', category: 'GAME / SYSTEMS', description: 'A visual study in collision and control.', technology: 'JAVASCRIPT / CANVAS', visualType: 'ascii' },
  { id: 'canvas-drift', number: '03', title: 'CANVAS DRIFT RACING SCENE', category: 'CANVAS / MOTION', description: 'Motion, perspective, and the edge of the frame.', technology: 'HTML CANVAS / ANIMATION', visualType: 'drift' },
  { id: 'synapse', number: '04', title: 'SYNAPSE MAGAZINE', category: 'EDITORIAL / DESIGN', description: 'A publication about ideas in transmission.', technology: 'EDITORIAL / VISUAL DESIGN', visualType: 'editorial' },
];
