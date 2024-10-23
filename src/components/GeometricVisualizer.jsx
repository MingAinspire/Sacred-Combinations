import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const patterns = {
  hexagon: "M50,0 L93.3,25 L93.3,75 L50,100 L6.7,75 L6.7,25 Z",
  spiral: "M50,50 m0,-45 a45,45 0 1,1 0,90 a45,45 0 1,1 0,-90",
  lotus: "M50,0 C80,40 100,50 100,50 C100,80 80,100 50,100 C20,100 0,80 0,50 C0,50 20,40 50,0",
  merkaba: "M0,50 L50,0 L100,50 L50,100 Z",
  circles: "M50,50 m-45,0 a45,45 0 1,0 90,0 a45,45 0 1,0 -90,0"
};

const colors = {
  60: "text-blue-300",
  174: "text-indigo-400",
  396: "text-red-400",
  432: "text-emerald-400",
  444: "text-yellow-400",
  528: "text-blue-400",
  741: "text-purple-400",
  852: "text-amber-400",
};

export default function GeometricVisualizer({ 
  pattern, 
  isPlaying, 
  frequency, 
  secondaryFrequency,
  rotationSpeed = 10000,
  animationSpeed = 10
}) {
  const primarySpeed = rotationSpeed / (animationSpeed / 10);
  const secondarySpeed = secondaryFrequency ? 
    (primarySpeed * (frequency / secondaryFrequency)) : primarySpeed;

  const primaryAnimation = useSpring({
    from: { rotate: 0, scale: 1, opacity: 0.9 },
    to: { 
      rotate: isPlaying ? 360 : 0,
      scale: isPlaying ? 1.1 : 1,
      opacity: 1
    },
    loop: isPlaying,
    config: { 
      duration: primarySpeed,
      tension: 300,
      friction: 10
    }
  });

  const secondaryAnimation = useSpring({
    from: { rotate: 0, scale: 0.7, opacity: 0.9 },
    to: { 
      rotate: isPlaying ? -360 : 0,
      scale: isPlaying ? 0.75 : 0.7,
      opacity: 1
    },
    loop: isPlaying,
    config: { 
      duration: secondarySpeed,
      tension: 300,
      friction: 10
    }
  });

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl" />
      <div className="relative p-8">
        <div className="relative">
          <animated.svg
            viewBox="0 0 100 100"
            className="absolute inset-0"
            style={{
              width: '100%',
              height: '100%',
              transform: primaryAnimation.rotate.to(
                (r) => `rotate(${r}deg) scale(${primaryAnimation.scale.get()})`
              ),
              opacity: primaryAnimation.opacity,
              filter: 'drop-shadow(0 0 8px currentColor)'
            }}
          >
            <path
              d={patterns[pattern] || patterns.hexagon}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`${colors[frequency] || "text-indigo-400"} transition-colors duration-500`}
            />
          </animated.svg>

          {secondaryFrequency && (
            <animated.svg
              viewBox="0 0 100 100"
              className="absolute inset-0"
              style={{
                width: '100%',
                height: '100%',
                transform: secondaryAnimation.rotate.to(
                  (r) => `rotate(${r}deg) scale(${secondaryAnimation.scale.get()})`
                ),
                opacity: secondaryAnimation.opacity,
                filter: 'drop-shadow(0 0 8px currentColor)'
              }}
            >
              <path
                d={patterns[pattern] || patterns.hexagon}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`${colors[secondaryFrequency] || "text-indigo-400"} transition-colors duration-500`}
              />
            </animated.svg>
          )}
        </div>
      </div>
    </div>
  );
}