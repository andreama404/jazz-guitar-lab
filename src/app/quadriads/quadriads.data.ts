import { ScaleEntry } from '../scales/scale.model';

export interface QuadriadGroup {
  title: string;
  quadriads: ScaleEntry[];
}

// Movable "drop 2" voicings on strings 5-4-3-2 (root-5th-7th-3rd order),
// root on the A string. Shown here rooted on C, 3rd fret.
const MAJOR7: ScaleEntry[] = [
  {
    id: 'cmaj7-drop2',
    name: 'Cmaj7',
    description: 'Quadriade maggiore settima, voicing drop 2 su corde 5-4-3-2.',
    notes: ['C', 'E', 'G', 'B'],
    startFret: 3,
    fretCount: 3,
    dots: [
      { string: 5, fret: 3, label: 'R' },
      { string: 4, fret: 5, label: '5' },
      { string: 3, fret: 4, label: '7' },
      { string: 2, fret: 5, label: '3' },
    ],
  },
];

const MINOR7: ScaleEntry[] = [
  {
    id: 'cm7-drop2',
    name: 'Cm7',
    description: 'Quadriade minore settima, voicing drop 2 su corde 5-4-3-2.',
    notes: ['C', 'Eb', 'G', 'Bb'],
    startFret: 3,
    fretCount: 3,
    dots: [
      { string: 5, fret: 3, label: 'R' },
      { string: 4, fret: 5, label: '5' },
      { string: 3, fret: 3, label: 'b7' },
      { string: 2, fret: 4, label: 'b3' },
    ],
  },
];

const DIMINISHED7: ScaleEntry[] = [
  {
    id: 'cdim7-drop2',
    name: 'Cdim7',
    description: 'Quadriade diminuita settima, voicing drop 2 su corde 5-4-3-2.',
    notes: ['C', 'Eb', 'F#', 'A'],
    startFret: 2,
    fretCount: 3,
    dots: [
      { string: 5, fret: 3, label: 'R' },
      { string: 4, fret: 4, label: 'b5' },
      { string: 3, fret: 2, label: 'bb7' },
      { string: 2, fret: 4, label: 'b3' },
    ],
  },
];

const HALF_DIMINISHED7: ScaleEntry[] = [
  {
    id: 'cm7b5-drop2',
    name: 'Cm7(b5)',
    description: 'Quadriade semidiminuita, voicing drop 2 su corde 5-4-3-2.',
    notes: ['C', 'Eb', 'F#', 'Bb'],
    startFret: 3,
    fretCount: 2,
    dots: [
      { string: 5, fret: 3, label: 'R' },
      { string: 4, fret: 4, label: 'b5' },
      { string: 3, fret: 3, label: 'b7' },
      { string: 2, fret: 4, label: 'b3' },
    ],
  },
];

const AUGMENTED7: ScaleEntry[] = [
  {
    id: 'c7sharp5-drop2',
    name: 'C7(#5)',
    description: 'Quadriade di dominante con quinta eccedente, voicing drop 2 su corde 5-4-3-2.',
    notes: ['C', 'E', 'G#', 'Bb'],
    startFret: 3,
    fretCount: 4,
    dots: [
      { string: 5, fret: 3, label: 'R' },
      { string: 4, fret: 6, label: '#5' },
      { string: 3, fret: 3, label: 'b7' },
      { string: 2, fret: 5, label: '3' },
    ],
  },
];

const DOMINANT7: ScaleEntry[] = [
  {
    id: 'c7-drop2',
    name: 'C7',
    description: 'Quadriade di dominante, voicing drop 2 su corde 5-4-3-2.',
    notes: ['C', 'E', 'G', 'Bb'],
    startFret: 3,
    fretCount: 3,
    dots: [
      { string: 5, fret: 3, label: 'R' },
      { string: 4, fret: 5, label: '5' },
      { string: 3, fret: 3, label: 'b7' },
      { string: 2, fret: 5, label: '3' },
    ],
  },
];

export const QUADRIAD_GROUPS: readonly QuadriadGroup[] = [
  { title: 'Quadriadi Maggiori', quadriads: MAJOR7 },
  { title: 'Quadriadi Minori', quadriads: MINOR7 },
  { title: 'Quadriadi Diminuite', quadriads: DIMINISHED7 },
  { title: 'Quadriadi Semidiminuite', quadriads: HALF_DIMINISHED7 },
  { title: 'Quadriadi Aumentate', quadriads: AUGMENTED7 },
  { title: 'Quadriadi Dominanti', quadriads: DOMINANT7 },
];

export const QUADRIADS: readonly ScaleEntry[] = QUADRIAD_GROUPS.flatMap((g) => g.quadriads);
