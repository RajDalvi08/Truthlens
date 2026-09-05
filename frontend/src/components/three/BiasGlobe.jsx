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
      globeRef.current.rotation.y += 0.0008;
    }
  });

  const wireframeGeo = useMemo(() => {
    return new THREE.SphereGeometry(2.5, 48, 36);
  }, []);

  return (
    <group ref={globeRef}>
      {/* Solid inner sphere - Espresso */}
      <mesh>
        <sphereGeometry args={[2.48, 64, 48]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Wireframe shell - Brown */}
      <mesh geometry={wireframeGeo}>
        <meshBasicMaterial color="#8d7b68" wireframe transparent opacity={0.15} />
      </mesh>
      {/* Atmospheric glow - Skin */}
      <mesh>
        <sphereGeometry args={[2.7, 64, 48]} />
        <meshBasicMaterial color="#fdf8f5" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function RegionMarker({ region, onHover }) {
  const [hovered, setHovered] = useState(false);
  const markerRef = useRef();
  const pos = useMemo(() => latLonToVec3(region.lat, region.lon, 2.55), [region]);

  const markerColor = useMemo(() => {
    if (region.bias > 0.5) return "#8d7b68"; // Deep Brown
    if (region.bias > 0.2) return "#d6c2b8"; // Light Brown
    if (region.bias > -0.2) return "#fdf8f5"; // Skin/Off-white
    return "#f5ebe0";
  }, [region.bias]);

  useFrame((state) => {
    if (markerRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 1.5 + region.lat) * 0.15;
      markerRef.current.scale.setScalar(hovered ? 2 : scale);
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
        <sphereGeometry args={[0.07, 32, 32]} />
        <meshBasicMaterial color={markerColor} />
      </mesh>
      {/* Pulse ring */}
      <mesh position={pos}>
        <ringGeometry args={[0.09, 0.14, 32]} />
        <meshBasicMaterial color={markerColor} transparent opacity={hovered ? 0.8 : 0.1} side={THREE.DoubleSide} />
      </mesh>
      {hovered && (
        <Html position={[pos.x * 1.25, pos.y * 1.25, pos.z * 1.25]} center>
          <div className="bg-[#1a0f0a]/95 backdrop-blur-3xl border border-[#fdf8f5]/20 rounded-none px-6 py-4 text-center whitespace-nowrap pointer-events-none shadow-2xl">
            <p className="text-[#fdf8f5] text-base font-black uppercase italic tracking-tighter">{region.name}</p>
            <p className="text-[10px] text-[#8d7b68] font-black mt-2 uppercase tracking-[0.2em] italic underline decoration-[#fdf8f5]/10">{region.articles} articles · {region.trend}</p>
            <p className="text-xs font-black mt-3 uppercase tracking-widest text-[#fdf8f5]">
              BIAS_DELTA: <span className="underline decoration-[#fdf8f5]/30">
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
    <div className={`w-full ${compact ? "h-[450px]" : "h-[650px]"} rounded-none overflow-hidden border border-[#fdf8f5]/10 bg-[#1a0f0a]/60 relative group shadow-2xl`}>

      <Canvas camera={{ position: [0, 0, 6.5], fov: 40 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 5, 10]} intensity={0.8} color="#fdf8f5" />
        <pointLight position={[-10, -5, -10]} intensity={0.5} color="#8d7b68" />
        <spotLight position={[0, 10, 0]} intensity={0.5} color="#fdf8f5" />

        <Globe />
        {REGION_DATA.map((region, i) => (
          <RegionMarker key={i} region={region} onHover={setHoveredRegion} />
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={12}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>

      
      <div className="absolute inset-0 border-[20px] border-[#1a0f0a]/10 pointer-events-none z-0" />
    </div>
  );
}
