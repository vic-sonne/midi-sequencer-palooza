
import React from 'react';
import { SequencerProvider } from '@/context/SequencerContext';
import MidiSequencer from '@/components/MidiSequencer';

const Index = () => {
  return (
    <SequencerProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
            
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-center text-2xl md:text-3xl font-bold bg-gradient-to-r from-sequencer-primary to-purple-400 bg-clip-text text-transparent">
                MIDI STEPPER
              </h1>
            </div>
            
            {/* Login button removed */}
          </div>
        </header>
        
        {/* Main Content */}
        <main className="container mx-auto py-6 px-4">
          <div className="flex flex-col items-center">
            <MidiSequencer />
          </div>
        </main>
      </div>
    </SequencerProvider>
  );
};

export default Index;
