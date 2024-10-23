import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const frequencyColors = {
  60: { color: '#00ffff', emissive: '#00dddd' },    // Cyan
  174: { color: '#00ffd5', emissive: '#00ddb3' },   // Turquoise
  222: { color: '#ffd700', emissive: '#ddb700' },   // Gold
  285: { color: '#ff8c00', emissive: '#dd7700' },   // Dark Orange
  396: { color: '#ff3d3d', emissive: '#dd2222' },   // Red
  417: { color: '#ff7f00', emissive: '#dd6600' },   // Orange
  432: { color: '#00ff88', emissive: '#00dd66' },   // Green
  444: { color: '#ffff00', emissive: '#dddd00' },   // Yellow
  528: { color: '#4d4dff', emissive: '#2222dd' },   // Blue
  639: { color: '#ff00ff', emissive: '#dd00dd' },   // Magenta
  660: { color: '#ff1493', emissive: '#dd0066' },   // Deep Pink
  741: { color: '#9400d3', emissive: '#7700aa' },   // Purple
  852: { color: '#ffffff', emissive: '#dddddd' },   // White
  888: { color: '#40e0d0', emissive: '#33b3a6' },   // Turquoise
  963: { color: '#7fffd4', emissive: '#66ddb3' }    // Aquamarine
};

const getMergedColors = (freq1, freq2) => {
  const color1 = new THREE.Color(frequencyColors[freq1]?.color || frequencyColors[432].color);
  const color2 = new THREE.Color(frequencyColors[freq2]?.color || frequencyColors[432].color);
  
  const mergedColor = new THREE.Color(
    (color1.r + color2.r) / 2,
    (color1.g + color2.g) / 2,
    (color1.b + color2.b) / 2
  );
  
  const mergedEmissive = new THREE.Color(
    (color1.r + color2.r) / 2.2,
    (color1.g + color2.g) / 2.2,
    (color1.b + color2.b) / 2.2
  );

  return {
    color: `#${mergedColor.getHexString()}`,
    emissive: `#${mergedEmissive.getHexString()}`
  };
};

export default function WaveformTube({ 
  frequency, 
  isPlaying, 
  position = [0, 0, 0], 
  amplitude = 1,
  isMerged = false,
  mergeTarget = null
}) {
  const meshRef = useRef();
  const glowRef = useRef();
  const timeRef = useRef(0);

  // Create a tube curve
  const curve = useMemo(() => {
    const points = [];
    const segments = 50;
    for (let i = 0; i <= segments; i++) {
      const x = (i - segments / 2) * 0.1;
      points.push(new THREE.Vector3(x, 0, 0));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Create geometries
  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.02, 8, false);
  }, [curve]);

  const glowGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.03, 8, false);
  }, [curve]);

  // Animation
  useFrame(() => {
    if (isPlaying && meshRef.current) {
      timeRef.current += 0.02;
      const positions = meshRef.current.geometry.attributes.position.array;
      const glowPositions = glowRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        let y = 0;

        if (isMerged && mergeTarget) {
          const primaryWave = Math.sin(x * frequency * 0.1 + timeRef.current);
          const secondaryWave = Math.sin(x * mergeTarget * 0.1 + timeRef.current);
          y = (primaryWave + secondaryWave) * 0.5;
        } else {
          y = Math.sin(x * frequency * 0.1 + timeRef.current);
        }

        positions[i + 1] = y * amplitude;
        glowPositions[i + 1] = y * amplitude * 1.2;
      }

      meshRef.current.geometry.attributes.position.needsUpdate = true;
      glowRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const colors = isMerged && mergeTarget 
    ? getMergedColors(frequency, mergeTarget)
    : frequencyColors[frequency] || frequencyColors[432];

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: colors.color,
      emissive: colors.emissive,
      emissiveIntensity: isMerged ? 1.5 : 1,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9,
    });
  }, [colors, isMerged]);

  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: colors.emissive,
      transparent: true,
      opacity: isMerged ? 0.6 : 0.4,
      side: THREE.BackSide,
    });
  }, [colors, isMerged]);

  return (
    <group position={position}>
      <mesh ref={glowRef}>
        <primitive object={glowGeometry} attach="geometry" />
        <primitive object={glowMaterial} attach="material" />
      </mesh>
      <mesh ref={meshRef}>
        <primitive object={geometry} attach="geometry" />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}