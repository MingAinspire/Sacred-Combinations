import React from 'react';

const frequencies = [
  { value: 60, label: "60 Hz - Shielding" },
  { value: 174, label: "174 Hz - Grounding" },
  { value: 222, label: "222 Hz - Alignment" },
  { value: 285, label: "285 Hz - Restoration" },
  { value: 396, label: "396 Hz - Liberation" },
  { value: 417, label: "417 Hz - Change" },
  { value: 432, label: "432 Hz - Nature" },
  { value: 444, label: "444 Hz - Balance" },
  { value: 528, label: "528 Hz - Healing" },
  { value: 639, label: "639 Hz - Connection" },
  { value: 660, label: "660 Hz - Harmony" },
  { value: 741, label: "741 Hz - Intuition" },
  { value: 852, label: "852 Hz - Clarity" },
  { value: 888, label: "888 Hz - Expansion" },
  { value: 963, label: "963 Hz - Awakening" }
];

const mergedDescriptions = {
  60: "Healing Protection – Creates a protective, restorative field",
  174: "Grounded Intuition – Enhances intuition with stability",
  222: "Balanced Alignment – Promotes calm equilibrium and internal harmony",
  285: "Restorative Grounding – Supports regeneration and stability",
  396: "Transformative Freedom – Helps break free from limitations",
  417: "Transformative Freedom – Helps break free from limitations",
  432: "Natural Balance – Connects to nature with emotional stability",
  444: "Natural Balance – Connects to nature with emotional stability",
  528: "Healing Shield – Combines healing with a protective layer",
  639: "Clear Connection – Promotes clarity in communication and understanding",
  660: "Harmonic Healing – Brings peace and restoration",
  741: "Stable Intuition – Grounds heightened intuitive abilities",
  852: "Expanded Clarity – Promotes awareness and new insights",
  888: "Protected Expansion – Provides growth while maintaining protection",
  963: "Awakened Nature – Connects awareness with nature"
};

const getPairedFrequencyLabel = (freq) => {
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
  const pairedFreq = pairings[freq];
  return frequencies.find(f => f.value === pairedFreq)?.label || '';
};

export default function Controls({ 
  primaryFrequency, 
  onPrimaryFrequencyChange, 
  primaryVolume, 
  onPrimaryVolumeChange,
  secondaryVolume,
  onSecondaryVolumeChange,
  isPaired,
  onPairToggle,
  isMerged,
  onMergeToggle,
  isPlaying, 
  onPlayToggle 
}) {
  return (
    <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl p-6 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Primary Frequency
        </label>
        <select
          value={primaryFrequency}
          onChange={(e) => onPrimaryFrequencyChange(Number(e.target.value))}
          className="w-full bg-gray-900/50 rounded-lg px-4 py-3 border border-gray-700/50 
                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                   text-white shadow-sm"
        >
          {frequencies.map((freq) => (
            <option key={freq.value} value={freq.value}>
              {freq.label}
            </option>
          ))}
        </select>
        {isPaired && (
          <div className="mt-2 text-sm text-indigo-400 font-medium">
            Paired with: {getPairedFrequencyLabel(primaryFrequency)}
          </div>
        )}
      </div>

      {!isMerged && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Primary Volume ({Math.round(primaryVolume * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={primaryVolume}
              onChange={(e) => onPrimaryVolumeChange(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer
                       bg-gray-700/50 accent-indigo-500"
            />
          </div>

          {isPaired && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Secondary Volume ({Math.round(secondaryVolume * 100)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={secondaryVolume}
                onChange={(e) => onSecondaryVolumeChange(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer
                         bg-gray-700/50 accent-indigo-500"
              />
            </div>
          )}
        </>
      )}

      <div className="flex gap-4">
        <button
          onClick={onPairToggle}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-300 ease-out transform
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50
            ${isPaired 
              ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
            }`}
        >
          {isPaired ? 'Disable Pairing' : 'Enable Pairing'}
        </button>

        {isPaired && (
          <button
            onClick={onMergeToggle}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm
              transition-all duration-300 ease-out transform
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50
              ${isMerged 
                ? 'bg-purple-600 text-white hover:bg-purple-500' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
              }`}
          >
            {isMerged ? 'Unmerge' : 'Merge'}
          </button>
        )}
      </div>

      {isMerged && (
        <div className="text-sm text-purple-400 text-center space-y-2">
          <div className="font-medium">Frequencies merged for optimal harmony</div>
          <div className="text-purple-300">{mergedDescriptions[primaryFrequency]}</div>
        </div>
      )}

      <button
        onClick={onPlayToggle}
        className="w-full bg-indigo-600 hover:bg-indigo-500 
                 text-white px-8 py-4 rounded-xl font-bold shadow-lg 
                 transition-all duration-300"
      >
        {isPlaying ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}