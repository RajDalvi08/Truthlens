import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

const SOURCES = [
  { name: "CNN", bias: -0.65, x: -3, y: 1.5, z: 0, color: "#4f46e5" },
  { name: "Fox News", bias: 0.82, x: 3, y: 1, z: -1, color: "#a855f7" },
  { name: "BBC", bias: -0.15, x: -1, y: -1.5, z: 2, color: "#06b6d4" },
  { name: "Reuters", bias: 0.05, x: 0.5, y: -2, z: -0.5, color: "#06b6d4" },
  { name: "The Guardian", bias: -0.72, x: -3.5, y: -0.5, z: -2, color: "#4f46e5" },
  { name: "Al Jazeera", bias: -0.4, x: -2, y: 2.5, z: 1.5, color: "#818cf8" },
  { name: "MSNBC", bias: -0.7, x: -4, y: 0, z: 1, color: "#4f46e5" },
  { name: "NY Times", bias: -0.5, x: -2.5, y: -2, z: -1.5, color: "#818cf8" },
  { name: "WSJ", bias: 0.3, x: 2, y: -1, z: 2, color: "#c084fc" },
  { name: "AP News", bias: 0.02, x: 0, y: 0, z: 0, color: "#06b6d4" },
];

const CONNECTIONS = [
  [0, 6], [0, 7], [1, 8], [2, 3], [2, 9], [3, 9],
  [4, 0], [4, 6], [5, 2], [5, 7], [6, 7], [1, 8],
  [7, 5], [8, 1], [9, 2], [9, 3], [0, 5],
];

function SourceNode({ source, onHover }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = source.y + Math.sin(state.clock.getElapsedTime() * 0.5 + source.x) * 0.15;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[source.x, source.y, source.z]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(source); }}
        onPointerOut={() => { setHovered(false); onHover(null); }}
      >
        <sphereGeometry args={[hovered ? 0.35 : 0.25, 32, 32]} />
        <meshStandardMaterial
          color={source.color}
          emissive={source.color}
          emissiveIntensity={hovered ? 1.5 : 0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Glow ring */}
      <mesh position={[source.x, source.y, source.z]}>
        <ringGeometry args={[0.35, 0.45, 32]} />
        <meshBasicMaterial
          color={source.color}
          transparent
          opacity={hovered ? 0.5 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      {hovered && (
        <Html position={[source.x, source.y + 0.6, source.z]} center>
          <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-center whitespace-nowrap pointer-events-none">
            <p className="text-white text-sm font-bold">{source.name}</p>
            <p className="text-xs text-gray-400 font-mono">
              Bias: <span className={source.bias > 0 ? "text-purple-400" : source.bias < -0.3 ? "text-indigo-400" : "text-cyan-400"}>
                {source.bias > 0 ? "+" : ""}{source.bias.toFixed(2)}
              </span>
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

function NetworkLines() {
  const linesRef = useRef();

  const geometry = useMemo(() => {
    const points = [];
    CONNECTIONS.forEach(([a, b]) => {
      points.push(new THREE.Vector3(SOURCES[a].x, SOURCES[a].y, SOURCES[a].z));
      points.push(new THREE.Vector3(SOURCES[b].x, SOURCES[b].y, SOURCES[b].z));
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.12 + Math.sin(state.clock.getElapsedTime()) * 0.05;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

export default function BiasNetwork() {
  const [hoveredSource, setHoveredSource] = useState(null);

  return (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-black/40 relative">
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          3D Bias Relationship Network
        </h3>
        <p className="text-[10px] text-gray-600 mt-1 font-mono">DRAG TO ROTATE · SCROLL TO ZOOM</p>
      </div>

      {hoveredSource && (
        <div className="absolute bottom-4 left-6 z-10 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 pointer-events-none">
          <p className="text-xs text-gray-400 font-mono">FOCUSED: <span className="text-white font-bold">{hoveredSource.name}</span></p>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 9], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#a855f7" />

        {SOURCES.map((source, i) => (
          <SourceNode key={i} source={source} onHover={setHoveredSource} />
        ))}
        <NetworkLines />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={15}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-4 right-6 z-10 flex gap-4 pointer-events-none">
        {[
          { label: "Left", color: "bg-indigo-500" },
          { label: "Neutral", color: "bg-cyan-500" },
          { label: "Right", color: "bg-purple-500" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-[9px] font-mono text-gray-500">
            <div className={`w-2 h-2 rounded-full ${l.color}`} /> {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
