import { ScaleEntry } from '../scales/scale.model';

export interface ArpeggioGroup {
  title: string;
  arpeggios: ScaleEntry[];
}

// Cmaj7 arpeggio (C-E-G-B), one neck position per root string.
const MAJOR7: ScaleEntry[] = [
  {
    id: 'cmaj7-arpeggio-string6',
    name: 'Cmaj7 (radice 6ª corda)',
    description: 'Arpeggio di Do maggiore settima con la tonica sulla 6ª corda (Mi grave), 8° tasto.',
    notes: ['C', 'E', 'G', 'B'],
    startFret: 7,
    fretCount: 5,
    dots: [
      { string: 6, fret: 7, label: 'B' },
      { string: 6, fret: 8, label: 'C' },
      { string: 5, fret: 7, label: 'E' },
      { string: 5, fret: 10, label: 'G' },
      { string: 4, fret: 9, label: 'B' },
      { string: 4, fret: 10, label: 'C' },
      { string: 3, fret: 9, label: 'E' },
      { string: 2, fret: 8, label: 'G' },
      { string: 1, fret: 7, label: 'B' },
      { string: 1, fret: 8, label: 'C' },
    ],
  },
  {
    id: 'cmaj7-arpeggio-string5',
    name: 'Cmaj7 (radice 5ª corda)',
    description: 'Arpeggio di Do maggiore settima con la tonica sulla 5ª corda (La), 3° tasto.',
    notes: ['C', 'E', 'G', 'B'],
    startFret: 3,
    fretCount: 5,
    dots: [
      { string: 6, fret: 3, label: 'G' },
      { string: 6, fret: 7, label: 'B' },
      { string: 5, fret: 3, label: 'C' },
      { string: 5, fret: 7, label: 'E' },
      { string: 4, fret: 5, label: 'G' },
      { string: 3, fret: 4, label: 'B' },
      { string: 3, fret: 5, label: 'C' },
      { string: 2, fret: 5, label: 'E' },
      { string: 1, fret: 3, label: 'G' },
      { string: 1, fret: 7, label: 'B' },
    ],
  },
];

export const ARPEGGIO_GROUPS: readonly ArpeggioGroup[] = [{ title: 'Arpeggi Maggiori (7)', arpeggios: MAJOR7 }];

export const ARPEGGIOS: readonly ScaleEntry[] = ARPEGGIO_GROUPS.flatMap((g) => g.arpeggios);
