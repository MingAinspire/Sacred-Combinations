import React, { useState } from 'react';
import Timer from './components/Timer';
import Controls from './components/Controls';
import FrequencyPlayer from './components/FrequencyPlayer';
import Waveform from './components/Waveform';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaired, setIsPaired] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const [primaryFrequency, setPrimaryFrequency] = useState(432);
  const [primaryVolume, setPrimaryVolume] = useState(0.5);
  const [secondaryVolume, setSecondaryVolume] = useState(0.5);

  const handleMergeToggle = () => {
    setIsMerged(!isMerged);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Meditation & Sound Healing</h1>
        
        <Timer isPlaying={isPlaying} />
        
        <Waveform 
          primaryFrequency={primaryFrequency}
          secondaryFrequency={isPaired ? getPairedFrequency(primaryFrequency) : null}
          isPlaying={isPlaying}
          isMerged={isMerged}
        />
        
        <Controls 
          primaryFrequency={primaryFrequency}
          onPrimaryFrequencyChange={setPrimaryFrequency}
          primaryVolume={primaryVolume}
          onPrimaryVolumeChange={setPrimaryVolume}
          secondaryVolume={secondaryVolume}
          onSecondaryVolumeChange={setSecondaryVolume}
          isPaired={isPaired}
          onPairToggle={() => {
            setIsPaired(!isPaired);
            if (!isPaired) setIsMerged(false);
          }}
          isMerged={isMerged}
          onMergeToggle={handleMergeToggle}
          isPlaying={isPlaying}
          onPlayToggle={() => setIsPlaying(!isPlaying)}
        />

        <FrequencyPlayer 
          primaryFrequency={primaryFrequency}
          secondaryFrequency={isPaired ? getPairedFrequency(primaryFrequency) : null}
          primaryVolume={primaryVolume}
          secondaryVolume={secondaryVolume}
          isPlaying={isPlaying}
          isMerged={isMerged}
        />
      </div>
    </div>
  );
}

function getPairedFrequency(freq) {
  const pairings = {
    60: 528,
    174: 741,
    222: 444,
    285: 174,
    396: 417,
    417: 396,
    432: 444,
    444: 432,
    528: 60,
    639: 852,
    660: 528,
    741: 174,
    852: 639,
    888: 60,
    963: 432
  };
  return pairings[freq] || null;
}

export default App;