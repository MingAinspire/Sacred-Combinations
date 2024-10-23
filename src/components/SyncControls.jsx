import React from 'react';

export default function SyncControls({ 
  onSyncToggle, 
  isSynced, 
  hasSecondaryFrequency 
}) {
  return (
    <div className="flex items-center justify-end space-x-4">
      <button
        onClick={onSyncToggle}
        disabled={!hasSecondaryFrequency}
        className={`
          px-4 py-2 rounded-lg font-medium text-sm
          transition-all duration-300 ease-out transform
          focus:outline-none focus:ring-2 focus:ring-indigo-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isSynced 
            ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/70'
          }
        `}
      >
        {isSynced ? 'Unsync Waveforms' : 'Sync Merge'}
      </button>
    </div>
  );
}