import { FretboardDot } from '../fretboard/fretboard-diagram';
import { ChordEntry } from './chord.model';

export function chordToDots(chord: ChordEntry): FretboardDot[] {
  return chord.frets
    .map((fret, index) => ({ fret, string: 6 - index }))
    .filter((entry): entry is { fret: number; string: number } => entry.fret !== 'x')
    .map((entry) => ({ string: entry.string, fret: entry.fret }));
}

export function chordMutedStrings(chord: ChordEntry): number[] {
  return chord.frets
    .map((fret, index) => ({ fret, string: 6 - index }))
    .filter((entry) => entry.fret === 'x')
    .map((entry) => entry.string);
}
