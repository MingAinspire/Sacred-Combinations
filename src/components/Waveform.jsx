import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import WaveformTube from './WaveformTube';

export default function Waveform({ primaryFrequency, secondaryFrequency, isPlaying, isMerged }) {
  return (
    <div className="h-[400px] w-full bg-black rounded-xl overflow-hidden backdrop-blur-sm">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 2, 5], fov: 75 }}>
        <color attach="background" args={['#000000']} />
        
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Grid */}
        <Grid
          args={[20, 20]}
          position={[0, -1, 0]}
          cellColor="#333"
          sectionColor="#666"
          fadeDistance={30}
          fadeStrength={1}
        />
        
        {/* Primary Waveform */}
        <WaveformTube 
          frequency={primaryFrequency} 
          isPlaying={isPlaying} 
          position={[0, 0, 0]}
          amplitude={0.5}
          isMerged={isMerged}
          mergeTarget={secondaryFrequency}
        />

        {/* Secondary Waveform */}
        {secondaryFrequency && !isMerged && (
          <WaveformTube 
            frequency={secondaryFrequency} 
            isPlaying={isPlaying} 
            position={[0, 0, 1]}
            amplitude={0.5}
          />
        )}
        
        {/* Camera Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}