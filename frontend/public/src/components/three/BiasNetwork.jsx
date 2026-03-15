import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

const SOURCES = [
  { name: "CNN Protocol", bias: -0.65, x: -3, y: 1.5, z: 0, color: "#fdf8f5" },
  { name: "Fox News Node", bias: 0.82, x: 3, y: 1, z: -1, color: "#8d7b68" },
  { name: "BBC Meridian", bias: -0.15, x: -1, y: -1.5, z: 2, color: "#d6c2b8" },
  { name: "Reuters Core", bias: 0.05, x: 0.5, y: -2, z: -0.5, color: "#fdf8f5" },
  { name: "The Guardian Path", bias: -0.72, x: -3.5, y: -0.5, z: -2, color: "#8d7b68" },
  { name: "Al Jazeera Array", bias: -0.4, x: -2, y: 2.5, z: 1.5, color: "#d6c2b8" },
  { name: "MSNBC Vector", bias: -0.7, x: -4, y: 0, z: 1, color: "#fdf8f5" },
  { name: "NY Times Ingest", bias: -0.5, x: -2.5, y: -2, z: -1.5, color: "#8d7b68" },
  { name: "WSJ Quant", bias: 0.3, x: 2, y: -1, z: 2, color: "#d6c2b8" },
  { name: "AP News Root", bias: 0.02, x: 0, y: 0, z: 0, color: "#f5ebe0" },
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
      meshRef.current.position.y = source.y + Math.sin(state.clock.getElapsedTime() * 0.7 + source.x) * 0.12;
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
        <sphereGeometry args={[hovered ? 0.38 : 0.28, 48, 48]} />
        <meshStandardMaterial
          color={source.color}
          emissive={source.color}
          emissiveIntensity={hovered ? 2.5 : 0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Glow ring - Sharp Square aesthetics projected in 3D */}
      <mesh position={[source.x, source.y, source.z]}>
        <ringGeometry args={[0.42, 0.48, 4]} />
        <meshBasicMaterial
          color={source.color}
          transparent
          opacity={hovered ? 0.7 : 0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      {hovered && (
        <Html position={[source.x, source.y + 0.8, source.z]} center>
          <div className="bg-[#1a0f0a]/95 backdrop-blur-3xl border border-[#fdf8f5]/20 rounded-none px-6 py-3 text-center whitespace-nowrap pointer-events-none shadow-2xl scale-in-center">
            <p className="text-[#fdf8f5] text-base font-black uppercase italic tracking-tighter">{source.name}</p>
            <p className="text-[10px] text-[#8d7b68] font-black mt-2 uppercase tracking-[0.25em] italic underline decoration-[#fdf8f5]/10">
              BIAS_VECTOR: <span className="text-[#fdf8f5]">
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
      linesRef.current.material.opacity = 0.06 + Math.sin(state.clock.getElapsedTime()) * 0.04;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#fdf8f5" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

export default function BiasNetwork() {
  const [hoveredSource, setHoveredSource] = useState(null);

  return (
    <div className="w-full h-[550px] rounded-none overflow-hidden border border-[#fdf8f5]/10 bg-[#1a0f0a]/60 relative shadow-2xl group">
      <div className="absolute top-8 left-10 z-10 pointer-events-none">
        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#fdf8f5] flex items-center gap-4 italic leading-none">
          <span className="w-2.5 h-2.5 rounded-none bg-[#fdf8f5] shadow-[0_0_15px_rgba(253,248,245,0.4)]" />
          Narrative Topology Matrix
        </h3>
        <p className="text-[9px] text-[#8d7b68] mt-3 font-black uppercase tracking-[0.3em] italic opacity-60">Navigate the 3D nexus of source inter-relationships.</p>
      </div>

      {hoveredSource && (
        <div className="absolute bottom-10 left-10 z-10 bg-[#1a0f0a]/90 backdrop-blur-3xl border border-[#fdf8f5]/10 rounded-none px-6 py-4 pointer-events-none shadow-2xl border-l-4 border-l-[#fdf8f5]">
          <p className="text-[10px] text-[#8d7b68] font-black uppercase tracking-[0.3em] italic">ACTIVE_NODE_FOCUS: <span className="text-[#fdf8f5]">{hoveredSource.name}</span></p>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#fdf8f5" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#8d7b68" />
        <spotLight position={[0, 0, 15]} intensity={0.3} color="#fdf8f5" />

        <group rotation={[0, 0, 0]}>
            {SOURCES.map((source, i) => (
              <SourceNode key={i} source={source} onHover={setHoveredSource} />
            ))}
            <NetworkLines />
        </group>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={6}
          maxDistance={18}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-10 right-10 z-10 flex gap-8 pointer-events-none bg-gradient-to-l from-[#1a0f0a]/40 to-transparent pl-12 py-4">
        {[
          { label: "Vector Alpha", color: "bg-[#fdf8f5]" },
          { label: "Neural Flux", color: "bg-[#d6c2b8]" },
          { label: "Vector Beta", color: "bg-[#8d7b68]" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-[#8d7b68] italic group-hover:text-[#fdf8f5] transition-colors">
            <div className={`w-3 h-3 rounded-none shadow-2xl ${l.color}`} /> {l.label}
          </div>
        ))}
      </div>
      
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#fdf8f5]/20 to-transparent" />
    </div>
  );
}
