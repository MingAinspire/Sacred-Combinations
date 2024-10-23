import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const colors = {
  60: '#00ffff',    // Cyan
  174: '#00ffd5',   // Turquoise
  396: '#ff3d3d',   // Bright Red
  432: '#00ff88',   // Bright Green
  444: '#ffff00',   // Yellow
  528: '#4d4dff',   // Electric Blue
  741: '#ff00ff',   // Magenta
  852: '#ffa500'    // Orange
};

export default function WaveformMesh({ 
  frequency = 432, 
  volume = 0.5, 
  isPlaying = false,
  position = [0, 0, 0]
}) {
  const meshRef = useRef();
  const timeRef = useRef(0);

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(256 * 3);
    
    for (let i = 0; i < 256; i++) {
      const x = (i / 256 - 0.5) * 20;
      positions[i * 3] = x;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame(() => {
    if (meshRef.current && isPlaying) {
      timeRef.current += 0.01;
      const positions = meshRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < 256; i++) {
        const x = (i / 256 - 0.5) * 20;
        positions[i * 3 + 1] = Math.sin(x * frequency * 0.1 + timeRef.current) * 2 * volume;
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      <line ref={meshRef}>
        <bufferGeometry attach="geometry" {...geometry} />
        <lineBasicMaterial 
          attach="material" 
          color={colors[frequency] || '#4d4dff'} 
          linewidth={2} 
          opacity={volume}
          transparent
        />
      </line>
    </group>
  );
}