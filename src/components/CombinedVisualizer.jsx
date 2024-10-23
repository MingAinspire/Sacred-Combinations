import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import WaveformMesh from './WaveformMesh';

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

export default function CombinedVisualizer({
  isPlaying,
  frequency,
  secondaryFrequency,
  animationSpeed = 10,
  primaryVolume = 0.5,
  secondaryVolume = 0.5,
  isSynced = false
}) {
  const getColor = (freq) => colors[freq] || '#00ffff';

  return (
    <div className="relative w-full h-[400px] bg-black rounded-xl overflow-hidden">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 50 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          panSpeed={0.5}
        />
        
        <fog attach="fog" args={['#000', 15, 25]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <WaveformMesh 
          frequency={frequency}
          color={getColor(frequency)}
          isPlaying={isPlaying}
          volume={primaryVolume}
          animationSpeed={animationSpeed}
        />
        
        {secondaryFrequency && (
          <WaveformMesh 
            frequency={secondaryFrequency}
            color={getColor(secondaryFrequency)}
            isPlaying={isPlaying}
            volume={secondaryVolume}
            animationSpeed={animationSpeed}
            offset={isSynced ? 0 : 2}
          />
        )}
      </Canvas>
    </div>
  );
}