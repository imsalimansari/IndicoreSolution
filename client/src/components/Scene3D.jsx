import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../theme.jsx";

const ptr = { x: 0, y: 0 };            // normalised mouse position, shared with the scene
if (typeof window !== "undefined") addEventListener("pointermove", e => { ptr.x = (e.clientX / innerWidth) * 2 - 1; ptr.y = -((e.clientY / innerHeight) * 2 - 1); }, { passive: true });

function Core({ small }) {
  const group = useRef(), ring1 = useRef(), ring2 = useRef(), moon = useRef();
  const shards = useMemo(() => Array.from({ length: small ? 8 : 14 }, () => ({
    p: [(Math.random() - .5) * 9, (Math.random() - .5) * 6, (Math.random() - .5) * 4 - 1],
    s: .08 + Math.random() * .18, c: Math.random() > .5 ? "#ff8a00" : "#0a84ff"
  })), [small]);
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime, wide = state.size.width > 820;
    const p = Math.min(1, scrollY / Math.max(1, innerHeight));          // hero scroll progress
    const g = group.current;
    g.position.x = THREE.MathUtils.damp(g.position.x, wide ? 2.5 - p * 1.2 : 0, 3, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, wide ? 0 : 1.5, 3, dt);
    g.rotation.y = t * .25 + p * Math.PI * 2 + ptr.x * .6;
    g.rotation.x = ptr.y * -.4 + p * 1.2;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, (wide ? 1 : .68) * (1 - p * .3), 3, dt));
    ring1.current.rotation.z = t * .5; ring2.current.rotation.x = t * .35;
    moon.current.position.set(Math.cos(t * 1.2) * 2.3, Math.sin(t * 1.2) * .6, Math.sin(t * 1.2) * 2.3);
  });
  return (
    <group ref={group}>
      <Float speed={2} floatIntensity={1}>
        <mesh><icosahedronGeometry args={[1.2, small ? 3 : 4]} /><MeshDistortMaterial color="#0a6cff" emissive="#0b2a8a" distort={.35} speed={2} roughness={.15} metalness={.8} /></mesh>
        <mesh scale={1.35}><icosahedronGeometry args={[1.2, 1]} /><meshBasicMaterial color="#5cc8ff" wireframe transparent opacity={.3} /></mesh>
      </Float>
      <mesh ref={ring1} rotation={[1.2, .2, 0]}><torusGeometry args={[2.1, .035, 16, 120]} /><meshStandardMaterial color="#ff8a00" emissive="#ff6a00" emissiveIntensity={1.2} /></mesh>
      <mesh ref={ring2} rotation={[.3, 1, 0]}><torusGeometry args={[2.6, .02, 16, 120]} /><meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={1} /></mesh>
      <mesh ref={moon}><sphereGeometry args={[.16, 24, 24]} /><meshStandardMaterial color="#ff9d2e" emissive="#ff8a00" emissiveIntensity={2} /></mesh>
      {shards.map((s, i) => (
        <Float key={i} speed={1 + i * .1} rotationIntensity={2} floatIntensity={2}>
          <mesh position={s.p} scale={s.s}><octahedronGeometry /><meshStandardMaterial color={s.c} emissive={s.c} emissiveIntensity={.6} /></mesh>
        </Float>
      ))}
    </group>
  );
}

export default function Scene3D() {
  const { theme } = useTheme(), box = useRef(), [live, setLive] = useState(true);
  const small = typeof innerWidth !== "undefined" && innerWidth < 820;
  useEffect(() => {      // stop rendering when the hero is off-screen or the tab is hidden
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0 });
    io.observe(box.current); return () => io.disconnect();
  }, []);
  return (
    <div ref={box} className="hero-scene" aria-hidden="true">
      <Canvas frameloop={live ? "always" : "never"} camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, small ? 1.25 : 1.75]} gl={{ antialias: !small, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={theme === "dark" ? .6 : .9} />
        <pointLight position={[5, 5, 5]} intensity={60} color="#ffffff" />
        <pointLight position={[-6, -3, 2]} intensity={40} color="#ff8a00" />
        {theme === "dark" && <Stars radius={60} depth={40} count={small ? 900 : 1800} factor={3} fade speed={1} />}
        <Core small={small} />
      </Canvas>
    </div>
  );
}
