import { Chord, Interval } from 'tonal';
import { intervalLabel } from '../scales/scale-theory';

export interface ChordType {
  id: string;
  name: string;
  /** Symbol understood by Tonal's Chord.getChord, e.g. "maj7". */
  symbol: string;
  /** Appended to the root in the chord name: "C" + "maj7". */
  suffix: string;
  description: string;
}

export const CHORD_TYPES: readonly ChordType[] = [
  { id: 'major', name: 'Maggiore', symbol: 'M', suffix: '', description: 'Triade maggiore: tonica, terza maggiore, quinta giusta.' },
  { id: 'minor', name: 'Minore', symbol: 'm', suffix: 'm', description: 'Triade minore: tonica, terza minore, quinta giusta.' },
  { id: 'dominant7', name: 'Dominante 7', symbol: '7', suffix: '7', description: 'Triade maggiore con settima minore: il V grado per eccellenza.' },
  { id: 'major7', name: 'Maggiore 7', symbol: 'maj7', suffix: 'maj7', description: 'Triade maggiore con settima maggiore: suono morbido e jazz.' },
  { id: 'minor7', name: 'Minore 7', symbol: 'm7', suffix: 'm7', description: 'Triade minore con settima minore: il II e il VI grado del maggiore.' },
];

export const TRIAD_TYPES: readonly ChordType[] = [
  { id: 'major', name: 'Maggiore', symbol: 'M', suffix: '', description: 'Tonica, terza maggiore, quinta giusta.' },
  { id: 'minor', name: 'Minore', symbol: 'm', suffix: 'm', description: 'Tonica, terza minore, quinta giusta.' },
  { id: 'diminished', name: 'Diminuita', symbol: 'dim', suffix: 'dim', description: 'Tonica, terza minore, quinta diminuita.' },
  { id: 'augmented', name: 'Aumentata', symbol: 'aug', suffix: 'aug', description: 'Tonica, terza maggiore, quinta aumentata.' },
];

export const QUADRIAD_TYPES: readonly ChordType[] = [
  { id: 'major7', name: 'Maggiore 7', symbol: 'maj7', suffix: 'maj7', description: 'Triade maggiore con settima maggiore.' },
  { id: 'minor7', name: 'Minore 7', symbol: 'm7', suffix: 'm7', description: 'Triade minore con settima minore.' },
  { id: 'dominant7', name: 'Dominante 7', symbol: '7', suffix: '7', description: 'Triade maggiore con settima minore.' },
  { id: 'half-diminished', name: 'Semidiminuita', symbol: 'm7b5', suffix: 'm7b5', description: 'Triade diminuita con settima minore.' },
  { id: 'diminished7', name: 'Diminuita 7', symbol: 'dim7', suffix: 'dim7', description: 'Triade diminuita con settima diminuita.' },
  { id: 'dominant7-sharp5', name: 'Dominante 7 quinta aumentata', symbol: '7#5', suffix: '7#5', description: 'Dominante con quinta eccedente.' },
];

export function findChordType(id: string | null, types: readonly ChordType[] = CHORD_TYPES): ChordType | null {
  return types.find((t) => t.id === id) ?? null;
}

export interface ChordResult {
  type: ChordType;
  root: string;
  /** Full chord name, e.g. "Cmaj7". */
  name: string;
  notes: string[];
  /** Interval of each note from the root: 1, b3, 5, b7... */
  intervals: string[];
}

export function buildChord(type: ChordType, root: string): ChordResult {
  const chord = Chord.getChord(type.symbol, root);
  const intervals = chord.intervals.map((i) => {
    const interval = Interval.get(i);
    return intervalLabel(interval.num, interval.semitones);
  });
  return { type, root, name: root + type.suffix, notes: chord.notes, intervals };
}
