import DotField from './DotField';

export function HeroDotField() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <DotField
        dotRadius={1.8}
        dotSpacing={12}
        cursorRadius={450}
        cursorForce={0.1}
        bulgeOnly={true}
        bulgeStrength={85}
        glowRadius={120}
        sparkle={false}
        waveAmplitude={0}
        gradientFrom="rgba(0, 0, 0, 0.55)"
        gradientTo="rgba(0, 0, 0, 0.15)"
        glowColor="rgba(0, 0, 0, 0.08)"
      />
    </div>
  );
}
