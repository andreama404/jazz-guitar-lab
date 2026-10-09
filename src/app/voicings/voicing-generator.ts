import { Note } from 'tonal';
import { ChordResult } from '../chords/chord-theory';
import { ChordVoicing } from '../chords/chord-voicings';
import { FretboardDot } from '../fretboard/fretboard-diagram';

export interface VoicingGroup {
  title: string;
  voicings: ChordVoicing[];
}

/** MIDI number of each open string (1 = high e ... 6 = low E). */
const OPEN_MIDI: Record<number, number> = { 6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64 };
/** Voicings wider than this many frets are not playable and are skipped. */
const MAX_SPAN = 5;

const TRIAD_STRING_SETS = [
  [6, 5, 4],
  [5, 4, 3],
  [4, 3, 2],
  [3, 2, 1],
];
const DROP2_STRING_SETS = [
  [6, 5, 4, 3],
  [5, 4, 3, 2],
  [4, 3, 2, 1],
];

const BASS_NAMES = ['Fondamentale', '1° rivolto', '2° rivolto', '3° rivolto'];

function chroma(note: string): number {
  return Note.chroma(note) as number;
}

/** Semitones of each chord tone above the root, in chord order. */
function chordSemitones(chord: ChordResult): number[] {
  return chord.notes.map((n) => (chroma(n) - chroma(chord.notes[0]) + 12) % 12);
}

/**
 * Puts a stack of notes on adjacent strings: the bass on the first string at its lowest fret,
 * the others at the given semitones above it. Returns null when the shape is not playable.
 */
function place(strings: number[], above: number[], bassChroma: number): number[] | null {
  const low = strings[0];
  let bassFret = (bassChroma - (OPEN_MIDI[low] % 12) + 12) % 12;
  for (let attempt = 0; attempt < 2; attempt++) {
    const frets = strings.map((s, i) => OPEN_MIDI[low] + bassFret + above[i] - OPEN_MIDI[s]);
    if (Math.min(...frets) < 0) {
      bassFret += 12; // a note fell below the nut: use the next octave
      continue;
    }
    return Math.max(...frets) - Math.min(...frets) <= MAX_SPAN ? frets : null;
  }
  return null;
}

/** Notes (as chord-tone indexes, lowest first) of a voicing and their distance above the bass. */
interface Stack {
  tones: number[];
  above: number[];
}

function toVoicing(chord: ChordResult, labels: string[], strings: number[], stack: Stack, id: string): (ChordVoicing & { lowest: number; bass: number }) | null {
  const bass = stack.tones[0];
  const frets = place(strings, stack.above, chroma(chord.notes[bass]));
  if (!frets) return null;
  const dots: FretboardDot[] = strings.map((string, i) => ({
    string,
    fret: frets[i],
    label: labels[stack.tones[i]],
    root: stack.tones[i] === 0,
  }));
  return {
    id,
    name: BASS_NAMES[bass],
    description: `Basso: ${chord.notes[bass]}`,
    dots,
    muted: [],
    lowest: Math.min(...frets),
    bass,
  };
}

function groups(
  chord: ChordResult,
  labels: string[],
  sets: number[][],
  stacks: Stack[],
  idPrefix: string,
): VoicingGroup[] {
  return sets.map((strings) => {
    const voicings = stacks
      .map((stack, i) => toVoicing(chord, labels, strings, stack, `${idPrefix}-${strings.join('')}-${i + 1}`))
      .filter((v): v is NonNullable<typeof v> => v !== null)
      .sort((a, b) => a.lowest - b.lowest)
      .map(({ lowest, bass, ...voicing }) => voicing);
    return { title: `Corde ${strings.join('-')}`, voicings };
  });
}

/** All close-position inversions of a triad on each set of three adjacent strings. */
export function buildTriadVoicings(chord: ChordResult, labels: string[], idPrefix = 'triad'): VoicingGroup[] {
  const semis = chordSemitones(chord);
  const n = semis.length;
  const stacks: Stack[] = Array.from({ length: n }, (_, k) => {
    const pitches = Array.from({ length: n }, (_, i) => semis[(k + i) % n] + 12 * Math.floor((k + i) / n));
    return { tones: Array.from({ length: n }, (_, i) => (k + i) % n), above: pitches.map((p) => p - pitches[0]) };
  });
  return groups(chord, labels, TRIAD_STRING_SETS, stacks, idPrefix);
}

/**
 * Drop 2 voicings of a four-note chord on each set of four adjacent strings, in all four
 * inversions: take the close voicing and drop its second-highest note an octave.
 */
export function buildDrop2Voicings(chord: ChordResult, labels: string[], idPrefix = 'drop2'): VoicingGroup[] {
  const semis = chordSemitones(chord);
  const n = 4;
  const stacks: Stack[] = Array.from({ length: n }, (_, k) => {
    const p = Array.from({ length: n }, (_, i) => semis[(k + i) % n] + 12 * Math.floor((k + i) / n));
    const tones = [(k + 2) % n, k % n, (k + 1) % n, (k + 3) % n];
    const pitches = [p[2] - 12, p[0], p[1], p[3]];
    return { tones, above: pitches.map((x) => x - pitches[0]) };
  });
  // keep the inversions in order of the bass note: root, 3rd, 5th, 7th
  stacks.sort((a, b) => a.tones[0] - b.tones[0]);
  return groups(chord, labels, DROP2_STRING_SETS, stacks, idPrefix);
}

/** Width in frets of one arpeggio position. */
const ARPEGGIO_SPAN = 5;

/**
 * Arpeggio fingerings across the neck: one position for each chord tone, starting from that tone
 * on the low E string and taking every chord tone found in the next few frets on all strings.
 */
export function buildArpeggioPositions(chord: ChordResult, labels: string[], idPrefix = 'arp'): VoicingGroup[] {
  const chromas = chord.notes.map(chroma);
  const stringOrder = [6, 5, 4, 3, 2, 1];
  const positions = chord.notes.map((note, index) => {
    let base = (chroma(note) - (OPEN_MIDI[6] % 12) + 12) % 12;
    if (base === 0) base = 12; // avoid the open string: keep the shape on the neck
    const dots: FretboardDot[] = [];
    for (const string of stringOrder) {
      for (let fret = base; fret < base + ARPEGGIO_SPAN; fret++) {
        const tone = chromas.indexOf((OPEN_MIDI[string] + fret) % 12);
        if (tone >= 0) dots.push({ string, fret, label: labels[tone], root: tone === 0 });
      }
    }
    return { base, note, index, dots };
  });
  positions.sort((a, b) => a.base - b.base);
  const voicings: ChordVoicing[] = positions.map((p, i) => ({
    id: `${idPrefix}-${i + 1}`,
    name: `Posizione ${i + 1}`,
    description: `Parte da ${p.note} sulla 6ª corda`,
    dots: p.dots,
    muted: [],
  }));
  return [{ title: 'Posizioni sul manico', voicings }];
}
