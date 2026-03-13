import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

const REGION_DATA = [
  { name: "United States", lat: 38, lon: -97, bias: 0.65, articles: "142K", trend: "Right-leaning" },
  { name: "United Kingdom", lat: 52, lon: -1, bias: -0.35, articles: "89K", trend: "Center-left" },
  { name: "India", lat: 20, lon: 77, bias: 0.2, articles: "67K", trend: "Mixed" },
  { name: "Germany", lat: 51, lon: 10, bias: -0.15, articles: "45K", trend: "Center" },
  { name: "Japan", lat: 36, lon: 138, bias: 0.05, articles: "38K", trend: "Neutral" },
  { name: "Brazil", lat: -14, lon: -51, bias: 0.45, articles: "32K", trend: "Right-leaning" },
  { name: "Australia", lat: -25, lon: 134, bias: -0.2, articles: "28K", trend: "Center-left" },
  { name: "Nigeria", lat: 9, lon: 8, bias: 0.3, articles: "18K", trend: "Mixed" },
  { name: "France", lat: 46, lon: 2, bias: -0.25, articles: "52K", trend: "Center-left" },
  { name: "China", lat: 35, lon: 105, bias: 0.8, articles: "71K", trend: "State-controlled" },
  { name: "Russia", lat: 61, lon: 105, bias: 0.85, articles: "55K", trend: "State-controlled" },
  { name: "Canada", lat: 56, lon: -106, bias: -0.3, articles: "41K", trend: "Center-left" },
];

function latLonToVec3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function Globe() {
  const globeRef = useRef();

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  const wireframeGeo = useMemo(() => {
    return new THREE.SphereGeometry(2.5, 36, 24);
  }, []);

  return (
    <group ref={globeRef}>
      {/* Solid inner sphere */}
      <mesh>
        <sphereGeometry args={[2.48, 64, 48]} />
        <meshStandardMaterial color="#0a0a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Wireframe shell */}
      <mesh geometry={wireframeGeo}>
        <meshBasicMaterial color="#1e1b4b" wireframe transparent opacity={0.3} />
      </mesh>
      {/* Atmospheric glow */}
      <mesh>
        <sphereGeometry args={[2.65, 64, 48]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function RegionMarker({ region, onHover }) {
  const [hovered, setHovered] = useState(false);
  const markerRef = useRef();
  const pos = useMemo(() => latLonToVec3(region.lat, region.lon, 2.55), [region]);

  const markerColor = useMemo(() => {
    if (region.bias > 0.5) return "#ef4444";
    if (region.bias > 0.2) return "#a855f7";
    if (region.bias > -0.2) return "#06b6d4";
    return "#4f46e5";
  }, [region.bias]);

  useFrame((state) => {
    if (markerRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2 + region.lat) * 0.2;
      markerRef.current.scale.setScalar(hovered ? 1.5 : scale);
    }
  });

  return (
    <group>
      <mesh
        ref={markerRef}
        position={pos}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(region); }}
        onPointerOut={() => { setHovered(false); onHover(null); }}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={markerColor} />
      </mesh>
      {/* Pulse ring */}
      <mesh position={pos}>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial color={markerColor} transparent opacity={hovered ? 0.6 : 0.2} side={THREE.DoubleSide} />
      </mesh>
      {hovered && (
        <Html position={[pos.x * 1.15, pos.y * 1.15, pos.z * 1.15]} center>
          <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 text-center whitespace-nowrap pointer-events-none shadow-2xl">
            <p className="text-white text-sm font-bold">{region.name}</p>
            <p className="text-[10px] text-gray-400 font-mono mt-1">{region.articles} articles · {region.trend}</p>
            <p className="text-xs font-mono mt-1">
              Bias: <span className={region.bias > 0 ? "text-purple-400" : "text-cyan-400"}>
                {region.bias > 0 ? "+" : ""}{region.bias.toFixed(2)}
              </span>
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function BiasGlobe({ compact = false }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  return (
    <div className={`w-full ${compact ? "h-[400px]" : "h-[600px]"} rounded-3xl overflow-hidden border border-white/10 bg-black/40 relative`}>
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          Global Bias Intensity Map
        </h3>
        <p className="text-[10px] text-gray-600 mt-1 font-mono">HOVER REGIONS · DRAG TO ROTATE</p>
      </div>

      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 5, 10]} intensity={0.6} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4f46e5" />

        <Globe />
        {REGION_DATA.map((region, i) => (
          <RegionMarker key={i} region={region} onHover={setHoveredRegion} />
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>

      {/* Bottom Legend */}
      <div className="absolute bottom-4 right-6 z-10 flex gap-4 pointer-events-none">
        {[
          { label: "Left", color: "bg-indigo-500" },
          { label: "Neutral", color: "bg-cyan-500" },
          { label: "Right", color: "bg-purple-500" },
          { label: "State", color: "bg-red-500" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-[9px] font-mono text-gray-500">
            <div className={`w-2 h-2 rounded-full ${l.color}`} /> {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
