
import React from 'react';
import { Music, ChevronDown } from 'lucide-react';
import { useSequencer } from '@/context/SequencerContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Note options
const NOTES = [
  'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
  'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5'
];

// MIDI Channels
const CHANNELS = Array.from({ length: 16 }, (_, i) => i + 1);

interface SequencerTrackProps {
  trackId: string;
  note: string;
  channel: number;
  steps: boolean[];
  currentStep: number;
}

const SequencerTrack: React.FC<SequencerTrackProps> = ({ 
  trackId, 
  note, 
  channel, 
  steps, 
  currentStep 
}) => {
  const { dispatch } = useSequencer();

  const handleNoteChange = (value: string) => {
    dispatch({
      type: 'UPDATE_TRACK',
      payload: {
        id: trackId,
        note: value,
        channel,
        steps,
      },
    });
  };

  const handleChannelChange = (value: string) => {
    dispatch({
      type: 'UPDATE_TRACK',
      payload: {
        id: trackId,
        note,
        channel: parseInt(value),
        steps,
      },
    });
  };

  const toggleStep = (stepIndex: number) => {
    dispatch({
      type: 'TOGGLE_STEP',
      payload: { trackId, stepIndex },
    });
  };

  return (
    <div className="flex items-center gap-2 mb-2 w-full">
      <div className="sequencer-track-selector min-w-24">
        <Music className="h-4 w-4 mr-1" />
        <Select value={note} onValueChange={handleNoteChange}>
          <SelectTrigger className="border-0 p-0 bg-transparent text-white shadow-none focus:ring-0">
            <SelectValue placeholder="Note" />
          </SelectTrigger>
          <SelectContent>
            {NOTES.map((noteOption) => (
              <SelectItem key={noteOption} value={noteOption}>
                {noteOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="sequencer-track-selector min-w-16">
        <Select value={channel.toString()} onValueChange={handleChannelChange}>
          <SelectTrigger className="border-0 p-0 bg-transparent text-white shadow-none focus:ring-0">
            <SelectValue placeholder="Ch" />
          </SelectTrigger>
          <SelectContent>
            {CHANNELS.map((ch) => (
              <SelectItem key={ch} value={ch.toString()}>
                {ch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ChevronDown className="h-3 w-3" />
      </div>

      <div className="flex-1 grid grid-cols-16 gap-1">
        {steps.map((active, index) => (
          <div
            key={`${trackId}-step-${index}`}
            className={`
              sequencer-step aspect-square rounded bg-sequencer-step cursor-pointer
              ${active ? 'active' : ''}
              ${currentStep === index ? 'ring-2 ring-sequencer-primary/50' : ''}
            `}
            onClick={() => toggleStep(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default SequencerTrack;
