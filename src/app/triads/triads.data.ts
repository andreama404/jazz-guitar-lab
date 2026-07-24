import { ScaleEntry } from '../scales/scale.model';

export interface TriadGroup {
  title: string;
  triads: ScaleEntry[];
}

// All C triad shapes on the 4 adjacent string sets (6-5-4, 5-4-3, 4-3-2, 3-2-1),
// computed from the note/fret layout of standard tuning. Positions 1-4 are the
// lowest close-position inversion per string set; positions 5-7 are the next
// inversions climbing up the neck, all kept within the first 12 frets since the
// pattern repeats an octave higher after that.

const MAJOR: ScaleEntry[] = [
  {
    id: 'c-major-triad-1',
    name: 'C Major (posizione 1)',
    description: 'Rivolto con la quinta (G) al basso.',
    notes: ['C', 'E', 'G'],
    startFret: 2,
    fretCount: 2,
    dots: [
      { string: 6, fret: 3, label: 'G' },
      { string: 5, fret: 3, label: 'C' },
      { string: 4, fret: 2, label: 'E' },
    ],
  },
  {
    id: 'c-major-triad-2',
    name: 'C Major (posizione 2)',
    description: 'Posizione fondamentale, con la tonica (C) al basso.',
    notes: ['C', 'E', 'G'],
    startFret: 1,
    fretCount: 3,
    dots: [
      { string: 5, fret: 3, label: 'C' },
      { string: 4, fret: 2, label: 'E' },
      { string: 3, fret: 0, label: 'G' },
    ],
  },
  {
    id: 'c-major-triad-3',
    name: 'C Major (posizione 3)',
    description: 'Rivolto con la quinta (G) al basso, forma a barré.',
    notes: ['C', 'E', 'G'],
    startFret: 4,
    fretCount: 3,
    dots: [
      { string: 4, fret: 5, label: 'G' },
      { string: 3, fret: 5, label: 'C' },
      { string: 2, fret: 5, label: 'E' },
    ],
  },
  {
    id: 'c-major-triad-4',
    name: 'C Major (posizione 4)',
    description: 'Posizione fondamentale, con la tonica (C) al basso.',
    notes: ['C', 'E', 'G'],
    startFret: 3,
    fretCount: 3,
    dots: [
      { string: 3, fret: 5, label: 'C' },
      { string: 2, fret: 5, label: 'E' },
      { string: 1, fret: 3, label: 'G' },
    ],
  },
  {
    id: 'c-major-triad-5',
    name: 'C Major (posizione 5)',
    description: 'Posizione fondamentale, con la tonica (C) al basso, un\'inversione più in alto.',
    notes: ['C', 'E', 'G'],
    startFret: 5,
    fretCount: 4,
    dots: [
      { string: 6, fret: 8, label: 'C' },
      { string: 5, fret: 7, label: 'E' },
      { string: 4, fret: 5, label: 'G' },
    ],
  },
  {
    id: 'c-major-triad-6',
    name: 'C Major (posizione 6)',
    description: 'Rivolto con la terza (E) al basso, un\'inversione più in alto.',
    notes: ['C', 'E', 'G'],
    startFret: 5,
    fretCount: 3,
    dots: [
      { string: 5, fret: 7, label: 'E' },
      { string: 4, fret: 5, label: 'G' },
      { string: 3, fret: 5, label: 'C' },
    ],
  },
  {
    id: 'c-major-triad-7',
    name: 'C Major (posizione 7)',
    description: 'Posizione fondamentale, con la tonica (C) al basso, in alto sul manico.',
    notes: ['C', 'E', 'G'],
    startFret: 8,
    fretCount: 3,
    dots: [
      { string: 4, fret: 10, label: 'C' },
      { string: 3, fret: 9, label: 'E' },
      { string: 2, fret: 8, label: 'G' },
    ],
  },
];

const MINOR: ScaleEntry[] = [
  {
    id: 'c-minor-triad-1',
    name: 'C Minor (posizione 1)',
    description: 'Rivolto con la quinta (G) al basso.',
    notes: ['C', 'Eb', 'G'],
    startFret: 1,
    fretCount: 3,
    dots: [
      { string: 6, fret: 3, label: 'G' },
      { string: 5, fret: 3, label: 'C' },
      { string: 4, fret: 1, label: 'Eb' },
    ],
  },
  {
    id: 'c-minor-triad-2',
    name: 'C Minor (posizione 2)',
    description: 'Posizione fondamentale, con la tonica (C) al basso.',
    notes: ['C', 'Eb', 'G'],
    startFret: 1,
    fretCount: 3,
    dots: [
      { string: 5, fret: 3, label: 'C' },
      { string: 4, fret: 1, label: 'Eb' },
      { string: 3, fret: 0, label: 'G' },
    ],
  },
  {
    id: 'c-minor-triad-3',
    name: 'C Minor (posizione 3)',
    description: 'Rivolto con la quinta (G) al basso.',
    notes: ['C', 'Eb', 'G'],
    startFret: 4,
    fretCount: 3,
    dots: [
      { string: 4, fret: 5, label: 'G' },
      { string: 3, fret: 5, label: 'C' },
      { string: 2, fret: 4, label: 'Eb' },
    ],
  },
  {
    id: 'c-minor-triad-4',
    name: 'C Minor (posizione 4)',
    description: 'Posizione fondamentale, con la tonica (C) al basso.',
    notes: ['C', 'Eb', 'G'],
    startFret: 3,
    fretCount: 3,
    dots: [
      { string: 3, fret: 5, label: 'C' },
      { string: 2, fret: 4, label: 'Eb' },
      { string: 1, fret: 3, label: 'G' },
    ],
  },
  {
    id: 'c-minor-triad-5',
    name: 'C Minor (posizione 5)',
    description: 'Posizione fondamentale, con la tonica (C) al basso, un\'inversione più in alto.',
    notes: ['C', 'Eb', 'G'],
    startFret: 5,
    fretCount: 4,
    dots: [
      { string: 6, fret: 8, label: 'C' },
      { string: 5, fret: 6, label: 'Eb' },
      { string: 4, fret: 5, label: 'G' },
    ],
  },
  {
    id: 'c-minor-triad-6',
    name: 'C Minor (posizione 6)',
    description: 'Rivolto con la terza minore (Eb) al basso, un\'inversione più in alto.',
    notes: ['C', 'Eb', 'G'],
    startFret: 5,
    fretCount: 2,
    dots: [
      { string: 5, fret: 6, label: 'Eb' },
      { string: 4, fret: 5, label: 'G' },
      { string: 3, fret: 5, label: 'C' },
    ],
  },
  {
    id: 'c-minor-triad-7',
    name: 'C Minor (posizione 7)',
    description: 'Posizione fondamentale, con la tonica (C) al basso, in alto sul manico.',
    notes: ['C', 'Eb', 'G'],
    startFret: 8,
    fretCount: 3,
    dots: [
      { string: 4, fret: 10, label: 'C' },
      { string: 3, fret: 8, label: 'Eb' },
      { string: 2, fret: 8, label: 'G' },
    ],
  },
];

const AUGMENTED: ScaleEntry[] = [
  {
    id: 'c-augmented-triad-1',
    name: 'C Augmented (posizione 1)',
    description: 'Rivolto con la quinta eccedente (G#) al basso.',
    notes: ['C', 'E', 'G#'],
    startFret: 2,
    fretCount: 3,
    dots: [
      { string: 6, fret: 4, label: 'G#' },
      { string: 5, fret: 3, label: 'C' },
      { string: 4, fret: 2, label: 'E' },
    ],
  },
  {
    id: 'c-augmented-triad-2',
    name: 'C Augmented (posizione 2)',
    description: 'Posizione fondamentale, con la tonica (C) al basso.',
    notes: ['C', 'E', 'G#'],
    startFret: 1,
    fretCount: 3,
    dots: [
      { string: 5, fret: 3, label: 'C' },
      { string: 4, fret: 2, label: 'E' },
      { string: 3, fret: 1, label: 'G#' },
    ],
  },
  {
    id: 'c-augmented-triad-3',
    name: 'C Augmented (posizione 3)',
    description: 'Rivolto con la terza (E) al basso.',
    notes: ['C', 'E', 'G#'],
    startFret: 5,
    fretCount: 2,
    dots: [
      { string: 4, fret: 6, label: 'G#' },
      { string: 3, fret: 5, label: 'C' },
      { string: 2, fret: 5, label: 'E' },
    ],
  },
  {
    id: 'c-augmented-triad-4',
    name: 'C Augmented (posizione 4)',
    description: 'Rivolto con la tonica (C) al basso.',
    notes: ['C', 'E', 'G#'],
    startFret: 8,
    fretCount: 2,
    dots: [
      { string: 3, fret: 9, label: 'E' },
      { string: 2, fret: 9, label: 'G#' },
      { string: 1, fret: 8, label: 'C' },
    ],
  },
  {
    id: 'c-augmented-triad-5',
    name: 'C Augmented (posizione 5)',
    description: 'Rivolto con la tonica (C) al basso, un\'inversione più in alto.',
    notes: ['C', 'E', 'G#'],
    startFret: 6,
    fretCount: 3,
    dots: [
      { string: 6, fret: 8, label: 'C' },
      { string: 5, fret: 7, label: 'E' },
      { string: 4, fret: 6, label: 'G#' },
    ],
  },
  {
    id: 'c-augmented-triad-6',
    name: 'C Augmented (posizione 6)',
    description: 'Rivolto con la terza (E) al basso, un\'inversione più in alto.',
    notes: ['C', 'E', 'G#'],
    startFret: 5,
    fretCount: 3,
    dots: [
      { string: 5, fret: 7, label: 'E' },
      { string: 4, fret: 6, label: 'G#' },
      { string: 3, fret: 5, label: 'C' },
    ],
  },
  {
    id: 'c-augmented-triad-7',
    name: 'C Augmented (posizione 7)',
    description: 'Rivolto con la terza (E) al basso, in posizione bassa.',
    notes: ['C', 'E', 'G#'],
    startFret: 1,
    fretCount: 2,
    dots: [
      { string: 4, fret: 2, label: 'E' },
      { string: 3, fret: 1, label: 'G#' },
      { string: 2, fret: 1, label: 'C' },
    ],
  },
];

const DIMINISHED: ScaleEntry[] = [
  {
    id: 'c-diminished-triad-1',
    name: 'C Diminished (posizione 1)',
    description: 'Rivolto con la quinta diminuita (F#) al basso.',
    notes: ['C', 'Eb', 'F#'],
    startFret: 1,
    fretCount: 3,
    dots: [
      { string: 6, fret: 2, label: 'F#' },
      { string: 5, fret: 3, label: 'C' },
      { string: 4, fret: 1, label: 'Eb' },
    ],
  },
  {
    id: 'c-diminished-triad-2',
    name: 'C Diminished (posizione 2)',
    description: 'Rivolto con la terza minore (Eb) al basso.',
    notes: ['C', 'Eb', 'F#'],
    startFret: 4,
    fretCount: 3,
    dots: [
      { string: 5, fret: 6, label: 'Eb' },
      { string: 4, fret: 4, label: 'F#' },
      { string: 3, fret: 5, label: 'C' },
    ],
  },
  {
    id: 'c-diminished-triad-3',
    name: 'C Diminished (posizione 3)',
    description: 'Rivolto con la quinta diminuita (F#) al basso.',
    notes: ['C', 'Eb', 'F#'],
    startFret: 4,
    fretCount: 2,
    dots: [
      { string: 4, fret: 4, label: 'F#' },
      { string: 3, fret: 5, label: 'C' },
      { string: 2, fret: 4, label: 'Eb' },
    ],
  },
  {
    id: 'c-diminished-triad-4',
    name: 'C Diminished (posizione 4)',
    description: 'Posizione fondamentale, con la tonica (C) al basso.',
    notes: ['C', 'Eb', 'F#'],
    startFret: 2,
    fretCount: 4,
    dots: [
      { string: 3, fret: 5, label: 'C' },
      { string: 2, fret: 4, label: 'Eb' },
      { string: 1, fret: 2, label: 'F#' },
    ],
  },
  {
    id: 'c-diminished-triad-5',
    name: 'C Diminished (posizione 5)',
    description: 'Posizione fondamentale, con la tonica (C) al basso, un\'inversione più in alto.',
    notes: ['C', 'Eb', 'F#'],
    startFret: 4,
    fretCount: 5,
    dots: [
      { string: 6, fret: 8, label: 'C' },
      { string: 5, fret: 6, label: 'Eb' },
      { string: 4, fret: 4, label: 'F#' },
    ],
  },
  {
    id: 'c-diminished-triad-6',
    name: 'C Diminished (posizione 6)',
    description: 'Rivolto con la quinta diminuita (F#) al basso, in alto sul manico.',
    notes: ['C', 'Eb', 'F#'],
    startFret: 8,
    fretCount: 3,
    dots: [
      { string: 5, fret: 9, label: 'F#' },
      { string: 4, fret: 10, label: 'C' },
      { string: 3, fret: 8, label: 'Eb' },
    ],
  },
  {
    id: 'c-diminished-triad-7',
    name: 'C Diminished (posizione 7)',
    description: 'Posizione fondamentale, con la tonica (C) al basso, in alto sul manico.',
    notes: ['C', 'Eb', 'F#'],
    startFret: 7,
    fretCount: 4,
    dots: [
      { string: 4, fret: 10, label: 'C' },
      { string: 3, fret: 8, label: 'Eb' },
      { string: 2, fret: 7, label: 'F#' },
    ],
  },
];

export const TRIAD_GROUPS: readonly TriadGroup[] = [
  { title: 'Triadi Maggiori', triads: MAJOR },
  { title: 'Triadi Minori', triads: MINOR },
  { title: 'Triadi Aumentate', triads: AUGMENTED },
  { title: 'Triadi Diminuite', triads: DIMINISHED },
];

export const TRIADS: readonly ScaleEntry[] = TRIAD_GROUPS.flatMap((g) => g.triads);
