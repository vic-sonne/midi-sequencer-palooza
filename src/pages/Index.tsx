
import React from 'react';
import { SequencerProvider } from '@/context/SequencerContext';
import MidiSequencer from '@/components/MidiSequencer';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const Index = () => {
  return (
    <SequencerProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <button className="p-2 md:hidden">
              <span className="sr-only">Open menu</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h1 className="text-center text-xl md:text-2xl font-medium text-sequencer-primary">
              MIDI Stepper
            </h1>
            
            <Button variant="outline" className="flex items-center gap-2 rounded-full">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Login</span>
            </Button>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="container mx-auto py-6 px-4">
          <MidiSequencer />
        </main>
      </div>
    </SequencerProvider>
  );
};

export default Index;
