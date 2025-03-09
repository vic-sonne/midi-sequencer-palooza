
import React from 'react';
import { RefreshCw, Zap } from 'lucide-react';
import { useSequencer } from '@/context/SequencerContext';
import { useMidi } from '@/hooks/useMidi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MidiDeviceSelector = () => {
  const { state, dispatch } = useSequencer();
  const { requestMidiAccess, refreshMidiDevices, sendTestNote } = useMidi();

  const handleMidiOutputChange = (outputId: string) => {
    const selectedOutput = state.availableMidiOutputs.find(output => output.id === outputId);
    dispatch({ type: 'SELECT_MIDI_OUTPUT', payload: selectedOutput || null });
  };

  return (
    <Card className="w-full bg-sequencer-surface shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">MIDI Output</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Select
            value={state.selectedMidiOutput?.id || ''}
            onValueChange={handleMidiOutputChange}
            disabled={state.availableMidiOutputs.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select MIDI Output" />
            </SelectTrigger>
            <SelectContent>
              {state.availableMidiOutputs.map((output) => (
                <SelectItem key={output.id} value={output.id}>
                  {output.name || 'Unknown Device'}
                </SelectItem>
              ))}
              {state.availableMidiOutputs.length === 0 && (
                <SelectItem value="none" disabled>
                  No MIDI outputs available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => refreshMidiDevices()}
            className="flex-shrink-0"
            title="Refresh MIDI Devices"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {state.midiAccessGranted ? (
          <div className="midi-connected">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            MIDI connection ready
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => requestMidiAccess()}
          >
            Connect to MIDI
          </Button>
        )}

        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2"
          onClick={sendTestNote}
          disabled={!state.selectedMidiOutput || !state.midiAccessGranted}
        >
          <Zap className="h-4 w-4" />
          Test MIDI Output
        </Button>
      </CardContent>
    </Card>
  );
};

export default MidiDeviceSelector;
