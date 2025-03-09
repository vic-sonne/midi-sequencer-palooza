
import { useEffect, useState, useCallback } from 'react';
import { useSequencer } from '@/context/SequencerContext';
import { toast } from '@/components/ui/use-toast';

// Note to MIDI note number mapping
const NOTE_MAP: Record<string, number> = {
  'C-1': 0, 'C#-1': 1, 'D-1': 2, 'D#-1': 3, 'E-1': 4, 'F-1': 5, 'F#-1': 6, 'G-1': 7, 'G#-1': 8, 'A-1': 9, 'A#-1': 10, 'B-1': 11,
  'C0': 12, 'C#0': 13, 'D0': 14, 'D#0': 15, 'E0': 16, 'F0': 17, 'F#0': 18, 'G0': 19, 'G#0': 20, 'A0': 21, 'A#0': 22, 'B0': 23,
  'C1': 24, 'C#1': 25, 'D1': 26, 'D#1': 27, 'E1': 28, 'F1': 29, 'F#1': 30, 'G1': 31, 'G#1': 32, 'A1': 33, 'A#1': 34, 'B1': 35,
  'C2': 36, 'C#2': 37, 'D2': 38, 'D#2': 39, 'E2': 40, 'F2': 41, 'F#2': 42, 'G2': 43, 'G#2': 44, 'A2': 45, 'A#2': 46, 'B2': 47,
  'C3': 48, 'C#3': 49, 'D3': 50, 'D#3': 51, 'E3': 52, 'F3': 53, 'F#3': 54, 'G3': 55, 'G#3': 56, 'A3': 57, 'A#3': 58, 'B3': 59,
  'C4': 60, 'C#4': 61, 'D4': 62, 'D#4': 63, 'E4': 64, 'F4': 65, 'F#4': 66, 'G4': 67, 'G#4': 68, 'A4': 69, 'A#4': 70, 'B4': 71,
  'C5': 72, 'C#5': 73, 'D5': 74, 'D#5': 75, 'E5': 76, 'F5': 77, 'F#5': 78, 'G5': 79, 'G#5': 80, 'A5': 81, 'A#5': 82, 'B5': 83,
  'C6': 84, 'C#6': 85, 'D6': 86, 'D#6': 87, 'E6': 88, 'F6': 89, 'F#6': 90, 'G6': 91, 'G#6': 92, 'A6': 93, 'A#6': 94, 'B6': 95,
  'C7': 96, 'C#7': 97, 'D7': 98, 'D#7': 99, 'E7': 100, 'F7': 101, 'F#7': 102, 'G7': 103, 'G#7': 104, 'A7': 105, 'A#7': 106, 'B7': 107,
  'C8': 108, 'C#8': 109, 'D8': 110, 'D#8': 111, 'E8': 112, 'F8': 113, 'F#8': 114, 'G8': 115, 'G#8': 116, 'A8': 117, 'A#8': 118, 'B8': 119,
  'C9': 120, 'C#9': 121, 'D9': 122, 'D#9': 123, 'E9': 124, 'F9': 125, 'F#9': 126, 'G9': 127,
};

interface UseMidiReturn {
  requestMidiAccess: () => Promise<void>;
  sendMidiNote: (note: string, channel: number, velocity?: number, duration?: number) => void;
  sendTestNote: () => void;
  refreshMidiDevices: () => Promise<void>;
}

export function useMidi(): UseMidiReturn {
  const { state, dispatch } = useSequencer();
  
  // Request MIDI Access
  const requestMidiAccess = useCallback(async () => {
    if (!navigator.requestMIDIAccess) {
      dispatch({ 
        type: 'SET_MIDI_ERROR', 
        payload: 'WebMIDI is not supported in this browser. Please try Chrome, Edge, or Opera.' 
      });
      toast({
        title: 'MIDI Not Supported',
        description: 'WebMIDI is not supported in this browser. Please try Chrome, Edge, or Opera.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      
      // Get outputs
      const outputs = Array.from(midiAccess.outputs.values());
      dispatch({ type: 'SET_MIDI_OUTPUTS', payload: outputs });
      
      if (outputs.length > 0) {
        dispatch({ type: 'SELECT_MIDI_OUTPUT', payload: outputs[0] });
      }
      
      dispatch({ type: 'SET_MIDI_ACCESS', payload: true });
      
      // Listen for state changes
      midiAccess.onstatechange = (event) => {
        console.log('MIDI state change:', event);
        refreshMidiDevices();
      };
      
      toast({
        title: 'MIDI Connected',
        description: 'Successfully connected to MIDI devices',
      });
    } catch (error) {
      console.error('Failed to get MIDI access:', error);
      dispatch({ 
        type: 'SET_MIDI_ERROR', 
        payload: 'Failed to get MIDI access. Please check your MIDI devices and try again.' 
      });
      toast({
        title: 'MIDI Connection Failed',
        description: 'Failed to connect to MIDI devices',
        variant: 'destructive',
      });
    }
  }, [dispatch]);

  // Refresh MIDI devices
  const refreshMidiDevices = useCallback(async () => {
    if (!navigator.requestMIDIAccess) return;
    
    try {
      const midiAccess = await navigator.requestMIDIAccess({ sysex: false });
      const outputs = Array.from(midiAccess.outputs.values());
      dispatch({ type: 'SET_MIDI_OUTPUTS', payload: outputs });
      
      // If current output is no longer available, select the first one
      if (state.selectedMidiOutput) {
        const outputExists = outputs.some(
          output => output.id === state.selectedMidiOutput?.id
        );
        
        if (!outputExists && outputs.length > 0) {
          dispatch({ type: 'SELECT_MIDI_OUTPUT', payload: outputs[0] });
        } else if (!outputExists) {
          dispatch({ type: 'SELECT_MIDI_OUTPUT', payload: null });
        }
      }
    } catch (error) {
      console.error('Failed to refresh MIDI devices:', error);
    }
  }, [dispatch, state.selectedMidiOutput]);

  // Send a MIDI note
  const sendMidiNote = useCallback((
    note: string, 
    channel: number, 
    velocity = 100, 
    duration = 100
  ) => {
    if (!state.selectedMidiOutput || !state.midiAccessGranted) return;
    
    const noteNumber = NOTE_MAP[note];
    if (noteNumber === undefined) {
      console.error(`Invalid note: ${note}`);
      return;
    }
    
    const noteOnMessage = [0x90 + (channel - 1), noteNumber, velocity];
    const noteOffMessage = [0x80 + (channel - 1), noteNumber, 0];
    
    state.selectedMidiOutput.send(noteOnMessage);
    
    setTimeout(() => {
      if (state.selectedMidiOutput) {
        state.selectedMidiOutput.send(noteOffMessage);
      }
    }, duration);
  }, [state.selectedMidiOutput, state.midiAccessGranted]);

  // Send a test note
  const sendTestNote = useCallback(() => {
    if (!state.selectedMidiOutput) {
      toast({
        title: 'No MIDI Output Selected',
        description: 'Please select a MIDI output device',
        variant: 'destructive',
      });
      return;
    }
    
    sendMidiNote('C4', 1, 100, 300);
    
    toast({
      title: 'Test Note Sent',
      description: 'MIDI C4 note sent to the selected output device',
    });
  }, [state.selectedMidiOutput, sendMidiNote]);

  // Initialize MIDI when component mounts
  useEffect(() => {
    requestMidiAccess();
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  return {
    requestMidiAccess,
    sendMidiNote,
    sendTestNote,
    refreshMidiDevices,
  };
}
