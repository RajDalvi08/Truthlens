import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 400 }) {
  const mesh = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
       // Spread particles in a wide neural field
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;

      // Brown & Fade Skin palette: [1.0, 0.97, 0.96] to [0.1, 0.06, 0.04]
      const t = Math.random();
      colors[i * 3] = 0.1 + t * 0.88;       // R: Deep brown to Skin
      colors[i * 3 + 1] = 0.06 + t * 0.9;  // G
      colors[i * 3 + 2] = 0.04 + t * 0.92; // B
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.015;
    mesh.current.rotation.z = Math.cos(time * 0.01) * 0.12;

    const pos = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      pos[idx + 1] += Math.sin(time * 0.8 + i * 0.12) * 0.0015;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function ConnectionLines({ count = 100 }) {
  const linesRef = useRef();

  const lineGeo = useMemo(() => {
    const points = [];
    for (let i = 0; i < count; i++) {
      const x1 = (Math.random() - 0.5) * 18;
      const y1 = (Math.random() - 0.5) * 18;
      const z1 = (Math.random() - 0.5) * 18;
      const x2 = x1 + (Math.random() - 0.5) * 6;
      const y2 = y1 + (Math.random() - 0.5) * 6;
      const z2 = z1 + (Math.random() - 0.5) * 6;
      points.push(new THREE.Vector3(x1, y1, z1));
      points.push(new THREE.Vector3(x2, y2, z2));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [count]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
      linesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.05;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={lineGeo}>
      <lineBasicMaterial
        color="#fdf8f5"
        transparent
        opacity={0.03}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

export default function NeuralParticles() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <Particles count={500} />
        <ConnectionLines count={120} />
      </Canvas>
    </div>
  );
}
