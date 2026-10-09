import { Note } from 'tonal';
import { FretboardDot } from './fretboard-diagram';

export interface FretPosition {
  id: string;
  name: string;
  description: string;
  startFret: number;
  fretCount: number;
  dots: FretboardDot[];
  /** Index (in the scale's notes) of the note this position starts from on the low E string. */
  startIndex: number;
}

/** MIDI number of each open string. Keys follow FretboardDot: 6 = low E ... 1 = high e. */
const OPEN_STRING_MIDI: Record<number, number> = { 6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64 };
const STRINGS_LOW_TO_HIGH = [6, 5, 4, 3, 2, 1];
const LOW_E_MIDI = 40;
const MIN_FRET_COUNT = 4;

/**
 * Builds every fingering position of a scale across the neck.
 *
 * Scales of seven notes use three notes per string, scales of up to six notes (pentatonics, blues)
 * use two notes per string. Position N starts from scale degree N on the low E string, so a scale
 * of n notes yields n positions, each covering the same notes in a different place on the neck.
 *
 * @param notes   scale notes in ascending order, root first
 * @param labels  text shown inside each dot (one per scale note, same order as `notes`)
 * @param core    indexes of the notes forming the box skeleton (default: all). Notes outside it,
 *                like the blue note, are added wherever they fall inside the position's frets.
 * @param formNames  CAGED form letter for each starting note index ("Forma di C"...), when defined.
 */
export function buildPositions(
  notes: string[],
  labels: string[],
  idPrefix = 'pos',
  core: number[] = notes.map((_, i) => i),
  formNames: Record<number, string> = {},
): FretPosition[] {
  const n = core.length;
  const perString = n <= 6 ? 2 : 3;
  const chromas = core.map((i) => Note.chroma(notes[i]) as number);
  const semis = chromas.map((c) => (c - chromas[0] + 12) % 12);
  // Pitch of the k-th core note counted upwards from the root (k may exceed n).
  const offset = (k: number) => semis[k % n] + 12 * Math.floor(k / n);
  const coreLabels = core.map((i) => labels[i]);
  const positions: FretPosition[] = [];

  for (let start = 0; start < n; start++) {
    // lowest fret on the low E string where the starting note occurs
    let base = LOW_E_MIDI + ((chromas[start] - 4 + 12) % 12); // 4 = chroma of E

    for (let attempt = 0; attempt < 2; attempt++) {
      const dots = placeNotes(start, base, perString, n, offset, coreLabels);
      const minFret = Math.min(...dots.map((d) => d.fret));
      if (minFret < 0) {
        base += 12; // a note fell below the nut: use the next octave
        continue;
      }
      if (core.length < notes.length) addExtraNotes(dots, notes, labels, core);
      positions.push(describe(dots, notes[core[start]], core[start]));
      break;
    }
  }

  // Position N starts from the N-th note of the scale on the low E string (position 1 = root).
  return positions.map((p, i) => ({
    ...p,
    id: `${idPrefix}-${i + 1}`,
    name: `Posizione ${i + 1}`,
    description: `${formNames[p.startIndex] ? `Forma di ${formNames[p.startIndex]} · ` : ''}${p.description}`,
  }));
}

/** Adds the non-core scale notes (e.g. blue note) that fall inside the position's fret window. */
function addExtraNotes(dots: FretboardDot[], notes: string[], labels: string[], core: number[]): void {
  const frets = dots.map((d) => d.fret);
  const min = Math.min(...frets);
  const max = Math.max(...frets);
  notes.forEach((note, idx) => {
    if (core.includes(idx)) return;
    const c = Note.chroma(note) as number;
    for (const string of STRINGS_LOW_TO_HIGH) {
      for (let fret = Math.max(min, 0); fret <= max; fret++) {
        if ((OPEN_STRING_MIDI[string] + fret) % 12 === c) {
          dots.push({ string, fret, label: labels[idx], root: false });
        }
      }
    }
  });
}

function placeNotes(
  start: number,
  base: number,
  perString: number,
  n: number,
  offset: (k: number) => number,
  labels: string[],
): FretboardDot[] {
  const dots: FretboardDot[] = [];
  const total = STRINGS_LOW_TO_HIGH.length * perString;
  for (let j = 0; j < total; j++) {
    const string = STRINGS_LOW_TO_HIGH[Math.floor(j / perString)];
    const k = start + j;
    const pitch = base + offset(k) - offset(start);
    const degree = k % n;
    dots.push({ string, fret: pitch - OPEN_STRING_MIDI[string], label: labels[degree], root: degree === 0 });
  }
  return dots;
}

function describe(dots: FretboardDot[], startNote: string, startIndex: number): FretPosition {
  const frets = dots.map((d) => d.fret);
  const min = Math.min(...frets);
  const max = Math.max(...frets);
  const startFret = Math.max(min, 1);
  return {
    id: '',
    name: '',
    description: `Parte da ${startNote} sulla 6ª corda · tasti ${min}–${max}`,
    startFret,
    fretCount: Math.max(max - startFret + 1, MIN_FRET_COUNT),
    dots,
    startIndex,
  };
}
