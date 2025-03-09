
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Types
export type Note = string;
export type Channel = number;
export type Step = boolean;

export interface Track {
  id: string;
  note: Note;
  channel: Channel;
  steps: Step[];
}

interface SequencerState {
  tracks: Track[];
  currentStep: number;
  isPlaying: boolean;
  bpm: number;
  selectedMidiOutput: WebMidi.MIDIOutput | null;
  availableMidiOutputs: WebMidi.MIDIOutput[];
  midiAccessGranted: boolean;
  midiError: string | null;
}

type SequencerAction =
  | { type: 'SET_TRACKS'; payload: Track[] }
  | { type: 'ADD_TRACK' }
  | { type: 'REMOVE_TRACK'; payload: string }
  | { type: 'UPDATE_TRACK'; payload: Track }
  | { type: 'TOGGLE_STEP'; payload: { trackId: string; stepIndex: number } }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_BPM'; payload: number }
  | { type: 'SET_MIDI_OUTPUTS'; payload: WebMidi.MIDIOutput[] }
  | { type: 'SELECT_MIDI_OUTPUT'; payload: WebMidi.MIDIOutput | null }
  | { type: 'SET_MIDI_ACCESS'; payload: boolean }
  | { type: 'SET_MIDI_ERROR'; payload: string | null };

interface SequencerContextType {
  state: SequencerState;
  dispatch: React.Dispatch<SequencerAction>;
}

const initialState: SequencerState = {
  tracks: Array(8).fill(null).map((_, i) => ({
    id: `track-${i}`,
    note: getNoteForIndex(i),
    channel: 1,
    steps: Array(16).fill(false),
  })),
  currentStep: -1,
  isPlaying: false,
  bpm: 120,
  selectedMidiOutput: null,
  availableMidiOutputs: [],
  midiAccessGranted: false,
  midiError: null,
};

// Helper function to get a note name based on index
function getNoteForIndex(index: number): Note {
  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
  return notes[index % notes.length];
}

function sequencerReducer(state: SequencerState, action: SequencerAction): SequencerState {
  switch (action.type) {
    case 'SET_TRACKS':
      return { ...state, tracks: action.payload };
    
    case 'ADD_TRACK':
      return {
        ...state,
        tracks: [
          ...state.tracks,
          {
            id: `track-${state.tracks.length}`,
            note: 'C4',
            channel: 1,
            steps: Array(16).fill(false),
          },
        ],
      };
    
    case 'REMOVE_TRACK':
      return {
        ...state,
        tracks: state.tracks.filter(track => track.id !== action.payload),
      };
    
    case 'UPDATE_TRACK':
      return {
        ...state,
        tracks: state.tracks.map(track =>
          track.id === action.payload.id ? action.payload : track
        ),
      };
    
    case 'TOGGLE_STEP':
      return {
        ...state,
        tracks: state.tracks.map(track =>
          track.id === action.payload.trackId
            ? {
                ...track,
                steps: track.steps.map((step, i) =>
                  i === action.payload.stepIndex ? !step : step
                ),
              }
            : track
        ),
      };
    
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    
    case 'SET_BPM':
      return { ...state, bpm: action.payload };
    
    case 'SET_MIDI_OUTPUTS':
      return { ...state, availableMidiOutputs: action.payload };
    
    case 'SELECT_MIDI_OUTPUT':
      return { ...state, selectedMidiOutput: action.payload };
    
    case 'SET_MIDI_ACCESS':
      return { ...state, midiAccessGranted: action.payload };
    
    case 'SET_MIDI_ERROR':
      return { ...state, midiError: action.payload };
    
    default:
      return state;
  }
}

const SequencerContext = createContext<SequencerContextType | undefined>(undefined);

export function SequencerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sequencerReducer, initialState);

  return (
    <SequencerContext.Provider value={{ state, dispatch }}>
      {children}
    </SequencerContext.Provider>
  );
}

export function useSequencer() {
  const context = useContext(SequencerContext);
  if (context === undefined) {
    throw new Error('useSequencer must be used within a SequencerProvider');
  }
  return context;
}
