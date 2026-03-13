import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 400 }) {
  const mesh = useRef();
  const light = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Cyan-to-purple gradient palette
      const t = Math.random();
      colors[i * 3] = 0.02 + t * 0.6;       // R
      colors[i * 3 + 1] = 0.7 - t * 0.4;   // G
      colors[i * 3 + 2] = 0.85 + t * 0.15;  // B

      sizes[i] = Math.random() * 3 + 1;
    }
    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.02;
    mesh.current.rotation.x = Math.sin(time * 0.01) * 0.1;

    const pos = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      pos[idx + 1] += Math.sin(time + i * 0.1) * 0.002;
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
        size={0.08}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function ConnectionLines({ count = 60 }) {
  const linesRef = useRef();

  const lineGeo = useMemo(() => {
    const points = [];
    for (let i = 0; i < count; i++) {
      const x1 = (Math.random() - 0.5) * 16;
      const y1 = (Math.random() - 0.5) * 16;
      const z1 = (Math.random() - 0.5) * 16;
      const x2 = x1 + (Math.random() - 0.5) * 4;
      const y2 = y1 + (Math.random() - 0.5) * 4;
      const z2 = z1 + (Math.random() - 0.5) * 4;
      points.push(new THREE.Vector3(x1, y1, z1));
      points.push(new THREE.Vector3(x2, y2, z2));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [count]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={lineGeo}>
      <lineBasicMaterial
        color="#06b6d4"
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

export default function NeuralParticles() {
  return (
    <div className="absolute inset-0 z-0" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <Particles count={400} />
        <ConnectionLines count={80} />
      </Canvas>
    </div>
  );
}
