import React, { useRef, useEffect } from 'react';
import SyncControls from './SyncControls';

export default function WaveformVisualizer({ 
  primaryFrequency, 
  secondaryFrequency, 
  isPlaying,
  primaryVolume,
  secondaryVolume,
  animationSpeed
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isSynced, setIsSynced] = React.useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let offset = 0;
    
    const getColor = (frequency) => {
      const colors = {
        60: 'rgba(147, 197, 253, 0.9)',   // blue-300
        174: 'rgba(129, 140, 248, 0.9)',  // indigo-400
        396: 'rgba(248, 113, 113, 0.9)',  // red-400
        432: 'rgba(52, 211, 153, 0.9)',   // emerald-400
        444: 'rgba(251, 191, 36, 0.9)',   // yellow-400
        528: 'rgba(96, 165, 250, 0.9)',   // blue-400
        741: 'rgba(192, 132, 252, 0.9)',  // purple-400
        852: 'rgba(245, 158, 11, 0.9)',   // amber-400
      };
      return colors[frequency] || 'rgba(129, 140, 248, 0.9)';
    };

    const createGradient = (color) => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      const rgba = color.replace('0.9', '0.2');
      gradient.addColorStop(0, rgba);
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, rgba);
      return gradient;
    };

    const drawWave = (frequency, amplitude, color, yOffset, syncOffset = 0) => {
      const points = [];
      const segments = canvas.width;
      const wavelength = canvas.width / (frequency / 10);
      
      for (let x = 0; x <= segments; x++) {
        const xPos = (x / segments) * canvas.width;
        const phase = ((xPos + (isPlaying ? offset : 0)) / wavelength * Math.PI * 2) + syncOffset;
        const yPos = Math.sin(phase) * (80 * amplitude) + yOffset;
        points.push({ x: xPos, y: yPos });
      }

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 2; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fillStyle = createGradient(color);
      ctx.fill();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const syncOffset = isSynced ? (offset * (primaryFrequency / secondaryFrequency)) % (Math.PI * 2) : 0;

      if (primaryFrequency) {
        drawWave(
          primaryFrequency, 
          primaryVolume, 
          getColor(primaryFrequency),
          canvas.height / 3
        );
      }

      if (secondaryFrequency) {
        drawWave(
          secondaryFrequency, 
          isSynced ? primaryVolume : secondaryVolume,
          getColor(secondaryFrequency),
          (canvas.height / 3) * 2,
          syncOffset
        );
      }

      if (isPlaying) {
        offset += (animationSpeed / 10) * 1.5;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = 300 * dpr;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = '300px';
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, primaryFrequency, secondaryFrequency, primaryVolume, secondaryVolume, isSynced, animationSpeed]);

  const handleSyncToggle = () => {
    setIsSynced(!isSynced);
  };

  return (
    <div className="space-y-4">
      <SyncControls 
        onSyncToggle={handleSyncToggle}
        isSynced={isSynced}
        hasSecondaryFrequency={!!secondaryFrequency}
      />
      <div className="w-full h-[300px] bg-gray-900/30 rounded-xl overflow-hidden backdrop-blur-sm">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}