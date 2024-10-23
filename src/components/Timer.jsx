import React, { useState, useEffect } from 'react';

export default function Timer({ isPlaying }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="text-center">
      <h2 className="text-lg font-medium text-gray-400 mb-2">Session Duration</h2>
      <div className="text-4xl font-mono tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
}