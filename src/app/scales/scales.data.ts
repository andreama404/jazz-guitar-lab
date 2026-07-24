import { ScaleEntry } from './scale.model';

export interface KeyNotes {
  key: string;
  notes: string[];
}

export interface DegreeTriad {
  degree: string;
  quality: string;
  interval: string;
  intervalFromRoot: string;
  chord: string;
  chordNotes: string[];
  chordIntervals: string[];
  chord7: string;
  chord7Notes: string[];
  chord7Intervals: string[];
}

export interface ScaleGroup {
  title: string;
  allKeys?: KeyNotes[];
  degreeTriads?: DegreeTriad[];
  scales: ScaleEntry[];
}

const MAJOR_SCALE_DEGREE_TRIADS: DegreeTriad[] = [
  {
    degree: 'I',
    quality: 'Maggiore',
    interval: 'T',
    intervalFromRoot: 'Unisono',
    chord: 'C',
    chordNotes: ['C', 'E', 'G'],
    chordIntervals: ['1', '3', '5'],
    chord7: 'Cmaj7',
    chord7Notes: ['C', 'E', 'G', 'B'],
    chord7Intervals: ['1', '3', '5', '7'],
  },
  {
    degree: 'II',
    quality: 'Minore',
    interval: 'T',
    intervalFromRoot: '2 Maggiore',
    chord: 'Dm',
    chordNotes: ['D', 'F', 'A'],
    chordIntervals: ['1', 'b3', '5'],
    chord7: 'Dm7',
    chord7Notes: ['D', 'F', 'A', 'C'],
    chord7Intervals: ['1', 'b3', '5', 'b7'],
  },
  {
    degree: 'III',
    quality: 'Minore',
    interval: 'St',
    intervalFromRoot: '3 Maggiore',
    chord: 'Em',
    chordNotes: ['E', 'G', 'B'],
    chordIntervals: ['1', 'b3', '5'],
    chord7: 'Em7',
    chord7Notes: ['E', 'G', 'B', 'D'],
    chord7Intervals: ['1', 'b3', '5', 'b7'],
  },
  {
    degree: 'IV',
    quality: 'Maggiore',
    interval: 'T',
    intervalFromRoot: '4 Giusta',
    chord: 'F',
    chordNotes: ['F', 'A', 'C'],
    chordIntervals: ['1', '3', '5'],
    chord7: 'Fmaj7',
    chord7Notes: ['F', 'A', 'C', 'E'],
    chord7Intervals: ['1', '3', '5', '7'],
  },
  {
    degree: 'V',
    quality: 'Maggiore',
    interval: 'T',
    intervalFromRoot: '5 Giusta',
    chord: 'G',
    chordNotes: ['G', 'B', 'D'],
    chordIntervals: ['1', '3', '5'],
    chord7: 'G7',
    chord7Notes: ['G', 'B', 'D', 'F'],
    chord7Intervals: ['1', '3', '5', 'b7'],
  },
  {
    degree: 'VI',
    quality: 'Minore',
    interval: 'T',
    intervalFromRoot: '6 Maggiore',
    chord: 'Am',
    chordNotes: ['A', 'C', 'E'],
    chordIntervals: ['1', 'b3', '5'],
    chord7: 'Am7',
    chord7Notes: ['A', 'C', 'E', 'G'],
    chord7Intervals: ['1', 'b3', '5', 'b7'],
  },
  {
    degree: 'VII',
    quality: 'Diminuita',
    interval: 'St',
    intervalFromRoot: '7 Maggiore',
    chord: 'Bdim',
    chordNotes: ['B', 'D', 'F'],
    chordIntervals: ['1', 'b3', 'b5'],
    chord7: 'Bm7b5',
    chord7Notes: ['B', 'D', 'F', 'A'],
    chord7Intervals: ['1', 'b3', 'b5', 'b7'],
  },
];

// Full circle of fifths: sharp keys (0-7#) then flat keys (1-7b), C shared once.
const ALL_MAJOR_KEYS: KeyNotes[] = [
  { key: 'C', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { key: 'G', notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
  { key: 'D', notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
  { key: 'A', notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] },
  { key: 'E', notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'] },
  { key: 'B', notes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'] },
  { key: 'F#', notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'] },
  { key: 'C#', notes: ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'] },
  { key: 'F', notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'] },
  { key: 'Bb', notes: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'] },
  { key: 'Eb', notes: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'] },
  { key: 'Ab', notes: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'] },
  { key: 'Db', notes: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'] },
  { key: 'Gb', notes: ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'] },
  { key: 'Cb', notes: ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb'] },
];

// C major scale (C-D-E-F-G-A-B), 5 positions covering the neck up to the 12th
// fret (the pattern repeats an octave higher after that), computed from the
// note/fret layout of standard tuning.
const MAJOR_SCALE: ScaleEntry[] = [
  {
    id: 'c-major-scale-1',
    name: 'C Major (posizione 1)',
    description: 'Posizione aperta, capotasto - 3° tasto.',
    startFret: 1,
    fretCount: 3,
    dots: [
      { string: 6, fret: 0, label: 'E' },
      { string: 6, fret: 1, label: 'F' },
      { string: 6, fret: 3, label: 'G' },
      { string: 5, fret: 0, label: 'A' },
      { string: 5, fret: 2, label: 'B' },
      { string: 5, fret: 3, label: 'C', root: true },
      { string: 4, fret: 0, label: 'D' },
      { string: 4, fret: 2, label: 'E' },
      { string: 4, fret: 3, label: 'F' },
      { string: 3, fret: 0, label: 'G' },
      { string: 3, fret: 2, label: 'A' },
      { string: 2, fret: 0, label: 'B' },
      { string: 2, fret: 1, label: 'C', root: true },
      { string: 2, fret: 3, label: 'D' },
      { string: 1, fret: 0, label: 'E' },
      { string: 1, fret: 1, label: 'F' },
      { string: 1, fret: 3, label: 'G' },
    ],
  },
  {
    id: 'c-major-scale-2',
    name: 'C Major (posizione 2)',
    description: 'Dal 2° al 6° tasto.',
    startFret: 2,
    fretCount: 5,
    dots: [
      { string: 6, fret: 3, label: 'G' },
      { string: 6, fret: 5, label: 'A' },
      { string: 5, fret: 2, label: 'B' },
      { string: 5, fret: 3, label: 'C', root: true },
      { string: 5, fret: 5, label: 'D' },
      { string: 4, fret: 2, label: 'E' },
      { string: 4, fret: 3, label: 'F' },
      { string: 4, fret: 5, label: 'G' },
      { string: 3, fret: 2, label: 'A' },
      { string: 3, fret: 4, label: 'B' },
      { string: 3, fret: 5, label: 'C', root: true },
      { string: 2, fret: 3, label: 'D' },
      { string: 2, fret: 5, label: 'E' },
      { string: 2, fret: 6, label: 'F' },
      { string: 1, fret: 3, label: 'G' },
      { string: 1, fret: 5, label: 'A' },
    ],
  },
  {
    id: 'c-major-scale-3',
    name: 'C Major (posizione 3)',
    description: 'Dal 5° al 7° tasto.',
    startFret: 5,
    fretCount: 3,
    dots: [
      { string: 6, fret: 5, label: 'A' },
      { string: 6, fret: 7, label: 'B' },
      { string: 5, fret: 5, label: 'D' },
      { string: 5, fret: 7, label: 'E' },
      { string: 4, fret: 5, label: 'G' },
      { string: 4, fret: 7, label: 'A' },
      { string: 3, fret: 5, label: 'C', root: true },
      { string: 3, fret: 7, label: 'D' },
      { string: 2, fret: 5, label: 'E' },
      { string: 2, fret: 6, label: 'F' },
      { string: 1, fret: 5, label: 'A' },
      { string: 1, fret: 7, label: 'B' },
    ],
  },
  {
    id: 'c-major-scale-4',
    name: 'C Major (posizione 4)',
    description: 'Dal 7° al 10° tasto.',
    startFret: 7,
    fretCount: 4,
    dots: [
      { string: 6, fret: 7, label: 'B' },
      { string: 6, fret: 8, label: 'C', root: true },
      { string: 6, fret: 10, label: 'D' },
      { string: 5, fret: 7, label: 'E' },
      { string: 5, fret: 8, label: 'F' },
      { string: 5, fret: 10, label: 'G' },
      { string: 4, fret: 7, label: 'A' },
      { string: 4, fret: 9, label: 'B' },
      { string: 4, fret: 10, label: 'C', root: true },
      { string: 3, fret: 7, label: 'D' },
      { string: 3, fret: 9, label: 'E' },
      { string: 3, fret: 10, label: 'F' },
      { string: 2, fret: 8, label: 'G' },
      { string: 2, fret: 10, label: 'A' },
      { string: 1, fret: 7, label: 'B' },
      { string: 1, fret: 8, label: 'C', root: true },
      { string: 1, fret: 10, label: 'D' },
    ],
  },
  {
    id: 'c-major-scale-5',
    name: 'C Major (posizione 5)',
    description: 'Dal 9° al 12° tasto (da qui si ripete un\'ottava sopra).',
    startFret: 9,
    fretCount: 4,
    dots: [
      { string: 6, fret: 10, label: 'D' },
      { string: 6, fret: 12, label: 'E' },
      { string: 5, fret: 10, label: 'G' },
      { string: 5, fret: 12, label: 'A' },
      { string: 4, fret: 9, label: 'B' },
      { string: 4, fret: 10, label: 'C', root: true },
      { string: 4, fret: 12, label: 'D' },
      { string: 3, fret: 9, label: 'E' },
      { string: 3, fret: 10, label: 'F' },
      { string: 3, fret: 12, label: 'G' },
      { string: 2, fret: 10, label: 'A' },
      { string: 2, fret: 12, label: 'B' },
      { string: 1, fret: 10, label: 'D' },
      { string: 1, fret: 12, label: 'E' },
    ],
  },
];

// Same 5 positions, filtered to the major pentatonic (C-D-E-G-A, no F/B).
const MAJOR_PENTATONIC: ScaleEntry[] = [
  {
    id: 'c-major-pentatonic-1',
    name: 'C Major Pentatonic (posizione 1)',
    description: 'Posizione aperta, capotasto - 3° tasto.',
    startFret: 1,
    fretCount: 3,
    dots: [
      { string: 6, fret: 0, label: 'E' },
      { string: 6, fret: 3, label: 'G' },
      { string: 5, fret: 0, label: 'A' },
      { string: 5, fret: 3, label: 'C', root: true },
      { string: 4, fret: 0, label: 'D' },
      { string: 4, fret: 2, label: 'E' },
      { string: 3, fret: 0, label: 'G' },
      { string: 3, fret: 2, label: 'A' },
      { string: 2, fret: 1, label: 'C', root: true },
      { string: 2, fret: 3, label: 'D' },
      { string: 1, fret: 0, label: 'E' },
      { string: 1, fret: 3, label: 'G' },
    ],
  },
  {
    id: 'c-major-pentatonic-2',
    name: 'C Major Pentatonic (posizione 2)',
    description: 'Dal 2° al 5° tasto.',
    startFret: 2,
    fretCount: 4,
    dots: [
      { string: 6, fret: 3, label: 'G' },
      { string: 6, fret: 5, label: 'A' },
      { string: 5, fret: 3, label: 'C', root: true },
      { string: 5, fret: 5, label: 'D' },
      { string: 4, fret: 2, label: 'E' },
      { string: 4, fret: 5, label: 'G' },
      { string: 3, fret: 2, label: 'A' },
      { string: 3, fret: 5, label: 'C', root: true },
      { string: 2, fret: 3, label: 'D' },
      { string: 2, fret: 5, label: 'E' },
      { string: 1, fret: 3, label: 'G' },
      { string: 1, fret: 5, label: 'A' },
    ],
  },
  {
    id: 'c-major-pentatonic-3',
    name: 'C Major Pentatonic (posizione 3)',
    description: 'Dal 5° al 7° tasto.',
    startFret: 5,
    fretCount: 3,
    dots: [
      { string: 6, fret: 5, label: 'A' },
      { string: 5, fret: 5, label: 'D' },
      { string: 5, fret: 7, label: 'E' },
      { string: 4, fret: 5, label: 'G' },
      { string: 4, fret: 7, label: 'A' },
      { string: 3, fret: 5, label: 'C', root: true },
      { string: 3, fret: 7, label: 'D' },
      { string: 2, fret: 5, label: 'E' },
      { string: 1, fret: 5, label: 'A' },
    ],
  },
  {
    id: 'c-major-pentatonic-4',
    name: 'C Major Pentatonic (posizione 4)',
    description: 'Dal 7° al 10° tasto.',
    startFret: 7,
    fretCount: 4,
    dots: [
      { string: 6, fret: 8, label: 'C', root: true },
      { string: 6, fret: 10, label: 'D' },
      { string: 5, fret: 7, label: 'E' },
      { string: 5, fret: 10, label: 'G' },
      { string: 4, fret: 7, label: 'A' },
      { string: 4, fret: 10, label: 'C', root: true },
      { string: 3, fret: 7, label: 'D' },
      { string: 3, fret: 9, label: 'E' },
      { string: 2, fret: 8, label: 'G' },
      { string: 2, fret: 10, label: 'A' },
      { string: 1, fret: 8, label: 'C', root: true },
      { string: 1, fret: 10, label: 'D' },
    ],
  },
  {
    id: 'c-major-pentatonic-5',
    name: 'C Major Pentatonic (posizione 5)',
    description: 'Dal 9° al 12° tasto (da qui si ripete un\'ottava sopra).',
    startFret: 9,
    fretCount: 4,
    dots: [
      { string: 6, fret: 10, label: 'D' },
      { string: 6, fret: 12, label: 'E' },
      { string: 5, fret: 10, label: 'G' },
      { string: 5, fret: 12, label: 'A' },
      { string: 4, fret: 10, label: 'C', root: true },
      { string: 4, fret: 12, label: 'D' },
      { string: 3, fret: 9, label: 'E' },
      { string: 3, fret: 12, label: 'G' },
      { string: 2, fret: 10, label: 'A' },
      { string: 1, fret: 10, label: 'D' },
      { string: 1, fret: 12, label: 'E' },
    ],
  },
];

export const SCALE_GROUPS: readonly ScaleGroup[] = [
  {
    title: 'Scala Maggiore',
    allKeys: ALL_MAJOR_KEYS,
    degreeTriads: MAJOR_SCALE_DEGREE_TRIADS,
    scales: MAJOR_SCALE,
  },
  { title: 'Pentatonica Maggiore', scales: MAJOR_PENTATONIC },
];

export const SCALES: readonly ScaleEntry[] = SCALE_GROUPS.flatMap((g) => g.scales);
