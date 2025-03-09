
import React, { useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { useSequencer } from '@/context/SequencerContext';
import { useMidi } from '@/hooks/useMidi';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const SequencerControls = () => {
  const { state, dispatch } = useSequencer();
  const { sendMidiNote } = useMidi();
  const intervalRef = useRef<number | null>(null);

  // Calculate timing in milliseconds from BPM
  const getStepTimeMs = () => {
    return (60 * 1000) / state.bpm / 4; // 16th notes (4 steps per beat)
  };

  // Toggle play/pause
  const togglePlay = () => {
    dispatch({ type: 'TOGGLE_PLAY' });
  };

  // Handle BPM change
  const handleBpmChange = (value: number[]) => {
    dispatch({ type: 'SET_BPM', payload: value[0] });
  };

  // Sequencer logic
  useEffect(() => {
    const playSequence = () => {
      if (!state.isPlaying) {
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        dispatch({ type: 'SET_CURRENT_STEP', payload: -1 });
        return;
      }

      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }

      let step = 0;
      const stepTime = getStepTimeMs();

      const advanceSequencer = () => {
        dispatch({ type: 'SET_CURRENT_STEP', payload: step });

        // Play notes for this step
        state.tracks.forEach(track => {
          if (track.steps[step]) {
            sendMidiNote(track.note, track.channel);
          }
        });

        // Advance to next step
        step = (step + 1) % 16;
      };

      // Start immediately
      advanceSequencer();

      // Set up interval for subsequent steps
      intervalRef.current = window.setInterval(advanceSequencer, stepTime);
    };

    playSequence();

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [state.isPlaying, state.bpm, state.tracks, dispatch, sendMidiNote]);

  // Update interval timing if BPM changes during playback
  useEffect(() => {
    if (state.isPlaying && intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      
      const stepTime = getStepTimeMs();
      let currentStep = state.currentStep;
      
      intervalRef.current = window.setInterval(() => {
        currentStep = (currentStep + 1) % 16;
        dispatch({ type: 'SET_CURRENT_STEP', payload: currentStep });

        // Play notes for this step
        state.tracks.forEach(track => {
          if (track.steps[currentStep]) {
            sendMidiNote(track.note, track.channel);
          }
        });
      }, stepTime);
    }
  }, [state.bpm]);

  return (
    <div className="flex items-center justify-between gap-4 my-3">
      <Button
        size="icon"
        variant="default"
        className={`rounded-full h-12 w-12 ${state.isPlaying ? 'bg-sequencer-primary' : 'bg-zinc-800'}`}
        onClick={togglePlay}
        disabled={!state.midiAccessGranted || !state.selectedMidiOutput}
      >
        {state.isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-1" />
        )}
      </Button>

      <div className="flex-1 flex items-center gap-4 max-w-[300px]">
        <span className="text-sm font-semibold text-zinc-500 w-6">60</span>
        <Slider
          value={[state.bpm]}
          min={60}
          max={180}
          step={1}
          className="midi-slider"
          onValueChange={handleBpmChange}
        />
        <span className="text-sm font-semibold">{state.bpm} BPM</span>
      </div>
    </div>
  );
};

export default SequencerControls;
