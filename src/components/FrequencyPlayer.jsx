import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';

export default function FrequencyPlayer({ 
  primaryFrequency, 
  secondaryFrequency, 
  primaryVolume, 
  secondaryVolume, 
  isPlaying,
  isMerged
}) {
  const primaryOscRef = useRef(null);
  const secondaryOscRef = useRef(null);
  const primaryGainRef = useRef(null);
  const secondaryGainRef = useRef(null);
  const mergeFilterRef = useRef(null);
  const reverbRef = useRef(null);
  const delayRef = useRef(null);

  useEffect(() => {
    // Initialize audio effects
    reverbRef.current = new Tone.Reverb({
      decay: 2,
      wet: 0.3
    }).toDestination();

    delayRef.current = new Tone.FeedbackDelay({
      delayTime: "8n",
      feedback: 0.2,
      wet: 0.2
    }).connect(reverbRef.current);

    // Initialize merge filter with more complex processing
    mergeFilterRef.current = new Tone.Filter({
      frequency: 2000,
      type: "lowpass",
      rolloff: -24,
      Q: 2
    }).connect(delayRef.current);

    // Initialize primary audio components
    primaryGainRef.current = new Tone.Gain(0);
    primaryOscRef.current = new Tone.Oscillator({
      frequency: primaryFrequency,
      type: 'sine'
    }).connect(primaryGainRef.current);

    // Initialize secondary audio components
    secondaryGainRef.current = new Tone.Gain(0);
    secondaryOscRef.current = new Tone.Oscillator({
      frequency: secondaryFrequency,
      type: 'sine'
    }).connect(secondaryGainRef.current);

    // Connect to appropriate destination based on merge state
    if (isMerged) {
      primaryGainRef.current.connect(mergeFilterRef.current);
      secondaryGainRef.current.connect(mergeFilterRef.current);
    } else {
      primaryGainRef.current.toDestination();
      secondaryGainRef.current.toDestination();
    }

    return () => {
      primaryOscRef.current?.dispose();
      secondaryOscRef.current?.dispose();
      primaryGainRef.current?.dispose();
      secondaryGainRef.current?.dispose();
      mergeFilterRef.current?.dispose();
      reverbRef.current?.dispose();
      delayRef.current?.dispose();
    };
  }, [isMerged]);

  useEffect(() => {
    if (primaryOscRef.current) {
      primaryOscRef.current.frequency.value = primaryFrequency;
    }
    if (secondaryOscRef.current && secondaryFrequency) {
      secondaryOscRef.current.frequency.value = secondaryFrequency;
    }
  }, [primaryFrequency, secondaryFrequency]);

  useEffect(() => {
    const targetPrimaryVolume = isPlaying ? primaryVolume : 0;
    const targetSecondaryVolume = isPlaying && secondaryFrequency ? secondaryVolume : 0;

    if (primaryGainRef.current) {
      // Adjust volumes for merged state
      const mergedVolume = isMerged ? 0.6 : 1;
      primaryGainRef.current.gain.rampTo(targetPrimaryVolume * mergedVolume, 0.1);
    }
    if (secondaryGainRef.current) {
      const mergedVolume = isMerged ? 0.6 : 1;
      secondaryGainRef.current.gain.rampTo(targetSecondaryVolume * mergedVolume, 0.1);
    }

    // Adjust effects based on merge state
    if (isMerged) {
      reverbRef.current.wet.value = 0.4;
      delayRef.current.wet.value = 0.3;
      mergeFilterRef.current.frequency.rampTo(2000, 0.1);
      mergeFilterRef.current.Q.value = 2;
    } else {
      reverbRef.current.wet.value = 0.2;
      delayRef.current.wet.value = 0.1;
      mergeFilterRef.current.frequency.rampTo(1000, 0.1);
      mergeFilterRef.current.Q.value = 1;
    }
  }, [primaryVolume, secondaryVolume, isPlaying, secondaryFrequency, isMerged]);

  useEffect(() => {
    const startAudio = async () => {
      if (isPlaying) {
        await Tone.start();
        primaryOscRef.current?.start();
        secondaryOscRef.current?.start();
      }
    };
    
    startAudio();
    
    return () => {
      primaryOscRef.current?.stop();
      secondaryOscRef.current?.stop();
    };
  }, [isPlaying]);

  return null;
}