
import React from 'react';
import { useSequencer } from '@/context/SequencerContext';
import MidiDeviceSelector from './MidiDeviceSelector';
import SequencerTrack from './SequencerTrack';
import SequencerControls from './SequencerControls';

const MidiSequencer = () => {
  const { state } = useSequencer();

  return (
    <div className="w-full max-w-6xl mx-auto p-4 lg:p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <SequencerControls />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64 md:order-2 flex-shrink-0">
          <MidiDeviceSelector />
        </div>

        <div className="flex-1 md:order-1 overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Step numbers - rendered as non-clickable step markers for perfect alignment */}
            <div className="grid grid-cols-16 gap-1 mb-1 pl-[88px]">
              {Array.from({ length: 16 }, (_, i) => (
                <div 
                  key={`step-${i + 1}`} 
                  className={`
                    flex items-center justify-center text-xs font-medium h-6 rounded
                    ${[0, 4, 8, 12].includes(i) ? 'bg-sequencer-primary/10 text-sequencer-primary font-bold' : 'bg-transparent text-transparent'}
                  `}
                >
                  {[0, 4, 8, 12].includes(i) ? i + 1 : ''}
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
