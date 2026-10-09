import { Note } from 'tonal';
import { FretboardDot } from './fretboard-diagram';
import { FretPosition } from './fretboard-map';

/**
 * The five CAGED forms of the major scale, as fingered in C major.
 * Keys are strings (1 = high e ... 6 = low E), values the frets played on that string.
 * Forms are listed in the order they appear going up the neck in C.
 */
const C_MAJOR_FORMS: { form: string; frets: Record<number, number[]> }[] = [
  { form: 'A', frets: { 1: [3, 5], 2: [3, 5, 6], 3: [2, 4, 5], 4: [2, 3, 5], 5: [2, 3, 5], 6: [3, 5] } },
  { form: 'G', frets: { 1: [5, 7, 8], 2: [5, 6, 8], 3: [4, 5, 7], 4: [5, 7], 5: [5, 7, 8], 6: [5, 7, 8] } },
  { form: 'E', frets: { 1: [7, 8, 10], 2: [8, 10], 3: [7, 9, 10], 4: [7, 9, 10], 5: [7, 8, 10], 6: [7, 8, 10] } },
  { form: 'D', frets: { 1: [10, 12, 13], 2: [10, 12, 13], 3: [9, 10, 12], 4: [9, 10, 12], 5: [10, 12], 6: [10, 12, 13] } },
  { form: 'C', frets: { 1: [12, 13, 15], 2: [12, 13, 15], 3: [12, 14], 4: [12, 14, 15], 5: [12, 14, 15], 6: [12, 13, 15] } },
];

const OPEN_STRING_CHROMA: Record<number, number> = { 1: 4, 2: 11, 3: 7, 4: 2, 5: 9, 6: 4 };

/** Lowest fret a transposed form may start from (avoids open strings, mirrors the C major layout). */
const MIN_START_FRET = 2;

/**
 * The five CAGED forms of the major scale in any key.
 * Forms are transposed along the neck (same shape, shifted by the root's distance from C) and
 * placed in the lowest octave where they start at fret 2 or later, then listed from low to high.
 *
 * @param notes  the seven notes of the scale, root first
 * @param labels text for each dot, one per scale note (same order as `notes`)
 */
export function buildCagedMajorForms(notes: string[], labels: string[], idPrefix = 'caged'): FretPosition[] {
  const shift = Note.chroma(notes[0]) as number;
  const degreeByChroma = new Map(notes.map((note, degree) => [Note.chroma(note) as number, degree]));

  const forms = C_MAJOR_FORMS.map(({ form, frets }) => {
    const all = Object.entries(frets).flatMap(([string, list]) => list.map((fret) => ({ string: Number(string), fret: fret + shift })));
    let octave = 0;
    const lowest = Math.min(...all.map((d) => d.fret));
    while (lowest + octave < MIN_START_FRET) octave += 12;
    while (lowest + octave - 12 >= MIN_START_FRET) octave -= 12;

    const dots: FretboardDot[] = all.map(({ string, fret }) => {
      const real = fret + octave;
      const degree = degreeByChroma.get((OPEN_STRING_CHROMA[string] + real) % 12) ?? 0;
      return { string, fret: real, label: labels[degree], root: degree === 0 };
    });
    return { form, dots };
  });

  return forms
    .map((f) => ({ ...f, min: Math.min(...f.dots.map((d) => d.fret)), max: Math.max(...f.dots.map((d) => d.fret)) }))
    .sort((a, b) => a.min - b.min)
    .map((f, i) => ({
      id: `${idPrefix}-${i + 1}`,
      name: `Forma di ${f.form}`,
      description: `tasti ${f.min}–${f.max}`,
      startFret: Math.max(f.min, 1),
      fretCount: f.max - Math.max(f.min, 1) + 1,
      dots: f.dots,
      startIndex: 0,
    }));
}
