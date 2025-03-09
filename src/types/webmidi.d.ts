
declare namespace WebMidi {
  interface MIDIOptions {
    sysex?: boolean;
    software?: boolean;
  }

  interface MIDIAccessEventMap {
    statechange: MIDIConnectionEvent;
  }

  interface MIDIConnectionEvent extends Event {
    port: MIDIPort;
  }

  interface MIDIAccess extends EventTarget {
    inputs: MIDIInputMap;
    outputs: MIDIOutputMap;
    onstatechange: ((this: MIDIAccess, ev: MIDIConnectionEvent) => any) | null;
    addEventListener<K extends keyof MIDIAccessEventMap>(
      type: K,
      listener: (this: MIDIAccess, ev: MIDIAccessEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof MIDIAccessEventMap>(
      type: K,
      listener: (this: MIDIAccess, ev: MIDIAccessEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  }

  interface MIDIInputMap extends Map<string, MIDIInput> {}
  interface MIDIOutputMap extends Map<string, MIDIOutput> {}

  interface MIDIPortEventMap {
    statechange: MIDIConnectionEvent;
  }

  interface MIDIPort extends EventTarget {
    id: string;
    manufacturer?: string;
    name?: string;
    type: 'input' | 'output';
    version?: string;
    state: 'connected' | 'disconnected';
    connection: 'open' | 'closed' | 'pending';
    onstatechange: ((this: MIDIPort, ev: MIDIConnectionEvent) => any) | null;
    open(): Promise<MIDIPort>;
    close(): Promise<MIDIPort>;
    addEventListener<K extends keyof MIDIPortEventMap>(
      type: K,
      listener: (this: MIDIPort, ev: MIDIPortEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof MIDIPortEventMap>(
      type: K,
      listener: (this: MIDIPort, ev: MIDIPortEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  }

  interface MIDIInput extends MIDIPort {
    onmidimessage: ((this: MIDIInput, ev: MIDIMessageEvent) => any) | null;
  }

  interface MIDIMessageEvent extends Event {
    data: Uint8Array;
  }

  interface MIDIOutput extends MIDIPort {
    send(data: number[], timestamp?: DOMHighResTimeStamp): void;
    clear(): void;
  }
}

interface Navigator {
  requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>;
}
