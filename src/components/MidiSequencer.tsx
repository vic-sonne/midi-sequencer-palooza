
import React from 'react';
import { Music } from 'lucide-react';
import { useSequencer } from '@/context/SequencerContext';
import MidiDeviceSelector from './MidiDeviceSelector';
import SequencerTrack from './SequencerTrack';
import SequencerControls from './SequencerControls';

const MidiSequencer = () => {
  const { state } = useSequencer();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <MidiDeviceSelector />
        </div>

        <div className="flex-1">
          <SequencerControls />
          
          <div className="mt-6">
            <div className="grid grid-cols-16 gap-1 mb-4">
              {Array.from({ length: 16 }, (_, i) => (
                <div 
                  key={`step-${i + 1}`} 
                  className="flex items-center justify-center text-xs font-medium text-gray-500"
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {state.tracks.map((track) => (
                <SequencerTrack
                  key={track.id}
                  trackId={track.id}
                  note={track.note}
                  channel={track.channel}
                  steps={track.steps}
                  currentStep={state.currentStep}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MidiSequencer;
