import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function ParticleSwarm(props) {
  const ref = useRef();
  
  // Generate a sphere of 4000 particles
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(4000 * 3), { radius: 1.5 });
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
    
    // Slight mouse interaction for the swarm
    const x = (state.pointer.x * 0.2);
    const y = (state.pointer.y * 0.2);
    ref.current.position.x += (x - ref.current.position.x) * 0.05;
    ref.current.position.y += (y - ref.current.position.y) * 0.05;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#f59e0b" // amber-500 from the portfolio
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function AntigravityBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, background: '#0a0c14', pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleSwarm />
      </Canvas>
      {/* Subtle overlay gradient to blend into the darkness */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at center, transparent 0%, rgba(10, 12, 20, 0.8) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
