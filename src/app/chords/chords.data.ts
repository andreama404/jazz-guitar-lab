import { ChordEntry } from './chord.model';

// Frets listed low E (string 6) -> high e (string 1).
// All voicings are for the root note C.
export const CHORDS: readonly ChordEntry[] = [
  { id: 'c-major', name: 'C', frets: ['x', 3, 2, 0, 1, 0] },
  { id: 'c7', name: 'C7', frets: ['x', 3, 2, 3, 1, 0] },
  { id: 'cmaj7', name: 'Cmaj7', frets: ['x', 3, 2, 0, 0, 0] },
  { id: 'cm7', name: 'Cm7', frets: ['x', 3, 5, 3, 4, 3], startFret: 3 },
  { id: 'cm', name: 'Cm', frets: ['x', 3, 5, 5, 4, 3], startFret: 3 },
  { id: 'c6', name: 'C6', frets: ['x', 3, 2, 2, 1, 0] },
  { id: 'csus4', name: 'Csus4', frets: ['x', 3, 3, 0, 1, 1] },
  { id: 'cadd9', name: 'Cadd9', frets: ['x', 3, 2, 0, 3, 0] },
  { id: 'c5', name: 'C5', frets: ['x', 3, 5, 'x', 'x', 'x'], startFret: 3 },
  { id: 'csus2', name: 'Csus2', frets: ['x', 3, 5, 5, 3, 3], startFret: 3 },
];
