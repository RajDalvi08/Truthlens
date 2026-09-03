"use client"
import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { getNetworkData } from "../../services/analysisService";

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

function NetworkLines({ sources }) {
  const linesRef = useRef();

  const geometry = useMemo(() => {
    const points = [];
    // Random connections for visual effect
    for (let i = 0; i < sources.length; i++) {
        const nearCount = 2;
        for(let j=1; j<=nearCount; j++) {
            const next = (i + j) % sources.length;
            points.push(new THREE.Vector3(sources[i].x, sources[i].y, sources[i].z));
            points.push(new THREE.Vector3(sources[next].x, sources[next].y, sources[next].z));
        }
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [sources]);

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
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        try {
            const data = await getNetworkData();
            setSources(data);
        } catch (e) {
            console.error("Network data fetch failed", e);
        } finally {
            setLoading(false);
        }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="w-full h-full flex items-center justify-center font-black text-[10px] tracking-[0.3em] text-[#8d7b68] animate-pulse">
        CONNECTING_NODES...
    </div>
  );

  return (
    <div className="w-full h-[550px] rounded-none overflow-hidden border border-[#fdf8f5]/10 bg-[#1a0f0a]/60 relative shadow-2xl group">
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
            {sources.map((source, i) => (
              <SourceNode key={source.id || i} source={source} onHover={setHoveredSource} />
            ))}
            {sources.length > 0 && <NetworkLines sources={sources} />}
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
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#fdf8f5]/20 to-transparent" />
    </div>
  );
}
