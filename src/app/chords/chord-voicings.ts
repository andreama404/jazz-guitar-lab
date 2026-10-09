import { Note } from 'tonal';
import { FretboardDot } from '../fretboard/fretboard-diagram';

/** Frets relative to the barre, from the low E string (6) to the high e string (1). 'x' = muted. */
type Template = { shape: 'E' | 'A'; frets: (number | 'x')[] };

/**
 * Movable barre voicings per chord type. The "E shape" has the root on the 6th string, the
 * "A shape" on the 5th. More shapes (C, G, D) can be added per type as they are defined.
 */
const TEMPLATES: Record<string, Template[]> = {
  major: [
    { shape: 'E', frets: [0, 2, 2, 1, 0, 0] },
    { shape: 'A', frets: ['x', 0, 2, 2, 2, 0] },
  ],
  minor: [
    { shape: 'E', frets: [0, 2, 2, 0, 0, 0] },
    { shape: 'A', frets: ['x', 0, 2, 2, 1, 0] },
  ],
  dominant7: [
    { shape: 'E', frets: [0, 2, 0, 1, 0, 0] },
    { shape: 'A', frets: ['x', 0, 2, 0, 2, 0] },
  ],
  major7: [
    { shape: 'E', frets: [0, 2, 1, 1, 0, 0] },
    { shape: 'A', frets: ['x', 0, 2, 1, 2, 0] },
  ],
  minor7: [
    { shape: 'E', frets: [0, 2, 0, 0, 0, 0] },
    { shape: 'A', frets: ['x', 0, 2, 0, 1, 0] },
  ],
  sus2: [
    { shape: 'E', frets: [0, 2, 4, 4, 0, 0] },
    { shape: 'A', frets: ['x', 0, 2, 2, 0, 0] },
  ],
  sus4: [
    { shape: 'E', frets: [0, 2, 2, 2, 0, 0] },
    { shape: 'A', frets: ['x', 0, 2, 2, 3, 0] },
  ],
  major6: [
    { shape: 'E', frets: [0, 2, 2, 1, 2, 0] },
    { shape: 'A', frets: ['x', 0, 2, 2, 2, 2] },
  ],
  minor6: [
    { shape: 'E', frets: [0, 2, 2, 0, 2, 0] },
    { shape: 'A', frets: ['x', 0, 2, 2, 1, 2] },
  ],
  'minor-major7': [
    { shape: 'E', frets: [0, 2, 1, 0, 0, 0] },
    { shape: 'A', frets: ['x', 0, 2, 1, 1, 0] },
  ],
  dominant9: [
    { shape: 'E', frets: [0, 2, 0, 1, 0, 2] },
    { shape: 'A', frets: ['x', 0, 2, 4, 2, 3] },
  ],
  dominant13: [
    { shape: 'E', frets: [0, 2, 0, 1, 2, 0] },
    { shape: 'A', frets: ['x', 0, 2, 0, 2, 2] },
  ],
  'dominant7-flat9': [{ shape: 'A', frets: ['x', 0, -1, 0, -1, 0] }],
  'dominant7-sharp11': [{ shape: 'E', frets: [0, 'x', 0, 1, -1, 'x'] }],
  add9: [
    { shape: 'E', frets: [0, 2, 2, 1, 0, 2] },
    { shape: 'A', frets: ['x', 0, 2, 4, 2, 0] },
  ],
};

/** Chroma of the open string the root sits on, per shape: E string = 4, A string = 9. */
const ROOT_STRING_CHROMA = { E: 4, A: 9 };
const OPEN_STRING_CHROMA: Record<number, number> = { 1: 4, 2: 11, 3: 7, 4: 2, 5: 9, 6: 4 };

export interface ChordVoicing {
  id: string;
  name: string;
  description: string;
  dots: FretboardDot[];
  muted: number[];
}

/**
 * Voicings of a chord in the key of its root, listed from the nut upwards.
 *
 * @param notes  chord notes, root first
 * @param labels text for each dot, one per chord note (same order as `notes`)
 */
export function buildChordVoicings(typeId: string, notes: string[], labels: string[], idPrefix = 'voicing'): ChordVoicing[] {
  const rootChroma = Note.chroma(notes[0]) as number;
  const degreeByChroma = new Map(notes.map((note, degree) => [Note.chroma(note) as number, degree]));

  return (TEMPLATES[typeId] ?? [])
    .map((template) => {
      let barre = (rootChroma - ROOT_STRING_CHROMA[template.shape] + 12) % 12;
      const lowestRelative = Math.min(...template.frets.filter((f): f is number => f !== 'x'));
      if (barre + lowestRelative < 0) barre += 12; // keep every fret on the neck
      const dots: FretboardDot[] = [];
      const muted: number[] = [];
      template.frets.forEach((relative, index) => {
        const string = 6 - index;
        if (relative === 'x') {
          muted.push(string);
          return;
        }
        const fret = barre + relative;
        const degree = degreeByChroma.get((OPEN_STRING_CHROMA[string] + fret) % 12) ?? 0;
        dots.push({ string, fret, label: labels[degree], root: degree === 0 });
      });
      return {
        template,
        dots,
        muted,
        lowest: Math.min(...dots.map((d) => d.fret)),
      };
    })
    .sort((a, b) => a.lowest - b.lowest)
    .map(({ template, dots, muted }, i) => ({
      id: `${idPrefix}-${i + 1}`,
      name: `Forma di ${template.shape}`,
      description: `Tonica sulla ${template.shape === 'E' ? '6ª' : '5ª'} corda`,
      dots,
      muted,
    }));
}
