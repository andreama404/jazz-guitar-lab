import { Note } from 'tonal';
import { FretboardDot } from './fretboard-diagram';
import { FretPosition } from './fretboard-map';

/**
 * A scale fingered with five fixed CAGED forms. The frets are those of one reference key; the
 * forms are transposed along the neck to play the scale in any other key.
 * Frets per string: 1 = high e ... 6 = low E.
 */
interface FormSet {
  /** Root note the frets below refer to. */
  referenceRoot: string;
  /** Lowest fret a transposed form may start from (default 2: no open strings, as in the diagrams). */
  minStartFret?: number;
  /** Forms in the order they appear going up the neck in the reference key. */
  forms: { form: string; /** Title shown instead of "Forma di <form>". */ title?: string; frets: Record<number, number[]> }[];
}

export const FORM_SETS: Record<string, FormSet> = {
  major: {
    referenceRoot: 'C',
    forms: [
      { form: 'A', frets: { 1: [3, 5], 2: [3, 5, 6], 3: [2, 4, 5], 4: [2, 3, 5], 5: [2, 3, 5], 6: [3, 5] } },
      { form: 'G', frets: { 1: [5, 7, 8], 2: [5, 6, 8], 3: [4, 5, 7], 4: [5, 7], 5: [5, 7, 8], 6: [5, 7, 8] } },
      { form: 'E', frets: { 1: [7, 8, 10], 2: [8, 10], 3: [7, 9, 10], 4: [7, 9, 10], 5: [7, 8, 10], 6: [7, 8, 10] } },
      { form: 'D', frets: { 1: [10, 12, 13], 2: [10, 12, 13], 3: [9, 10, 12], 4: [9, 10, 12], 5: [10, 12], 6: [10, 12, 13] } },
      { form: 'C', frets: { 1: [12, 13, 15], 2: [12, 13, 15], 3: [12, 14], 4: [12, 14, 15], 5: [12, 14, 15], 6: [12, 13, 15] } },
    ],
  },
  'melodic-minor': {
    referenceRoot: 'G',
    forms: [
      { form: 'E', frets: { 1: [2, 3, 5, 6], 2: [3, 5], 3: [2, 3, 5], 4: [2, 4, 5], 5: [3, 5], 6: [2, 3, 5, 6] } },
      { form: 'D', frets: { 1: [5, 6, 8], 2: [5, 7, 8], 3: [5, 7], 4: [4, 5, 7, 8], 5: [5, 7], 6: [5, 6, 8] } },
      { form: 'C', frets: { 1: [8, 10], 2: [7, 8, 10, 11], 3: [7, 9], 4: [7, 8, 10], 5: [7, 9, 10], 6: [8, 10] } },
      { form: 'A', frets: { 1: [10, 12], 2: [10, 11, 13], 3: [9, 11, 12], 4: [10, 12], 5: [9, 10, 12, 13], 6: [10, 12] } },
      { form: 'G', frets: { 1: [12, 14, 15], 2: [13, 15], 3: [12, 14, 15], 4: [12, 14, 16], 5: [12, 13, 15], 6: [12, 14, 15] } },
    ],
  },
  // Reference diagram: F harmonic minor, five shapes named after the scale degree they start from
  // on the low E string (root, 2, 4, 5, 7).
  'harmonic-minor': {
    referenceRoot: 'F',
    minStartFret: 1,
    forms: [
      { form: '1', title: 'Posizione 1 · dalla tonica', frets: { 1: [1, 3, 4], 2: [1, 2, 5], 3: [1, 3], 4: [2, 3, 5], 5: [1, 3, 4], 6: [1, 3, 4] } },
      { form: '2', title: 'Posizione 2 · dal 2° grado', frets: { 1: [3, 4, 6], 2: [5, 6], 3: [3, 5, 6], 4: [3, 5, 6], 5: [3, 4, 7], 6: [3, 4, 6] } },
      { form: '3', title: 'Posizione 3 · dal 4° grado', frets: { 1: [6, 8, 9], 2: [5, 6, 8, 9], 3: [5, 6], 4: [5, 6, 8], 5: [7, 8], 6: [6, 8, 9] } },
      { form: '4', title: 'Posizione 4 · dal 5° grado', frets: { 1: [8, 9, 12], 2: [8, 9, 11], 3: [9, 10], 4: [8, 10, 11], 5: [8, 10, 11], 6: [8, 9, 12] } },
      { form: '5', title: 'Posizione 5 · dal 7° grado', frets: { 1: [12, 13], 2: [11, 13, 14], 3: [10, 12, 13], 4: [10, 11, 14], 5: [10, 11, 13], 6: [12, 13] } },
    ],
  },
};

const OPEN_STRING_CHROMA: Record<number, number> = { 1: 4, 2: 11, 3: 7, 4: 2, 5: 9, 6: 4 };

const DEFAULT_MIN_START_FRET = 2;

/**
 * The fixed forms of a scale in any key: same shapes, shifted by the distance between the root
 * and the reference root, placed in the lowest octave where they start at the set's minimum fret, then
 * listed from the nut upwards.
 *
 * @param setId  key of FORM_SETS
 * @param notes  the seven notes of the scale, root first
 * @param labels text for each dot, one per scale note (same order as `notes`)
 */
export function buildFixedForms(setId: string, notes: string[], labels: string[], idPrefix = 'forms'): FretPosition[] {
  const set = FORM_SETS[setId];
  const minStart = set.minStartFret ?? DEFAULT_MIN_START_FRET;
  const shift = (Note.chroma(notes[0]) as number) - (Note.chroma(set.referenceRoot) as number);
  const degreeByChroma = new Map(notes.map((note, degree) => [Note.chroma(note) as number, degree]));

  const forms = set.forms.map(({ form, title, frets }) => {
    const all = Object.entries(frets).flatMap(([string, list]) => list.map((fret) => ({ string: Number(string), fret: fret + shift })));
    let octave = 0;
    const lowest = Math.min(...all.map((d) => d.fret));
    while (lowest + octave < minStart) octave += 12;
    while (lowest + octave - 12 >= minStart) octave -= 12;

    const dots: FretboardDot[] = all.map(({ string, fret }) => {
      const real = fret + octave;
      const degree = degreeByChroma.get((OPEN_STRING_CHROMA[string] + real) % 12) ?? 0;
      return { string, fret: real, label: labels[degree], root: degree === 0 };
    });
    return { form, title, dots };
  });

  return forms
    .map((f) => ({ ...f, min: Math.min(...f.dots.map((d) => d.fret)), max: Math.max(...f.dots.map((d) => d.fret)) }))
    .sort((a, b) => a.min - b.min)
    .map((f, i) => ({
      id: `${idPrefix}-${i + 1}`,
      name: f.title ?? `Forma di ${f.form}`,
      description: '',
      startFret: Math.max(f.min, 1),
      fretCount: f.max - Math.max(f.min, 1) + 1,
      dots: f.dots,
      startIndex: 0,
    }));
}
