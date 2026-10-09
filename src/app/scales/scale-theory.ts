import { Chord, Interval, Note, Scale } from 'tonal';

export interface ScaleType {
  id: string;
  name: string;
  /** Name understood by Tonal's Scale.get, e.g. "dorian" -> Scale.get("D dorian"). */
  tonalName: string;
  family: string;
  description: string;
  /** Explicit intervals, used when Tonal's spelling of the scale is not the one players expect. */
  intervals?: string[];
  /**
   * Indexes of the notes that form the "box" fingering skeleton; the other notes (e.g. the blue
   * note) are added where they fall inside each position. Defaults to all the notes.
   */
  coreDegrees?: number[];
  /**
   * CAGED form of each position, keyed by the index of the note the position starts from on the
   * low E string. Only defined for the pentatonics, where the five boxes match the five forms.
   */
  formNames?: Record<number, string>;
  /** Fingerings come from the fixed CAGED forms of the major scale instead of the generator. */
  cagedMajor?: boolean;
}

/** Roots offered in the picker (common jazz spellings). */
export const ROOTS: readonly string[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

const MODES = 'Modi della scala maggiore';
const MINORS = 'Minore armonica, melodica e derivate';
const PENTA = 'Pentatoniche e blues';

export const SCALE_TYPES: readonly ScaleType[] = [
  { id: 'major', name: 'Maggiore (Ionica)', tonalName: 'major', cagedMajor: true, family: MODES, description: 'La scala di riferimento: tonica stabile, suono aperto e risolto.' },
  { id: 'dorian', name: 'Dorica', tonalName: 'dorian', family: MODES, description: 'Minore con 6ª maggiore. Suono del minore jazz/blues su accordi m7.' },
  { id: 'phrygian', name: 'Frigia', tonalName: 'phrygian', family: MODES, description: 'Minore con 2ª minore: colore scuro, spagnoleggiante.' },
  { id: 'lydian', name: 'Lidia', tonalName: 'lydian', family: MODES, description: 'Maggiore con 4ª aumentata: suono sospeso e luminoso, su accordi maj7#11.' },
  { id: 'mixolydian', name: 'Misolidia', tonalName: 'mixolydian', family: MODES, description: 'Maggiore con 7ª minore: la scala dell\'accordo di dominante (7).' },
  { id: 'aeolian', name: 'Eolia (minore naturale)', tonalName: 'aeolian', family: MODES, description: 'Il minore naturale: base di molta musica modale e rock.' },
  { id: 'locrian', name: 'Locria', tonalName: 'locrian', family: MODES, description: 'Minore con 2ª e 5ª diminuita: scala dell\'accordo m7b5.' },
  { id: 'harmonic-minor', name: 'Minore armonica', tonalName: 'harmonic minor', family: MINORS, description: 'Minore naturale con 7ª maggiore: la sensibile crea il V7 in minore.' },
  { id: 'melodic-minor', name: 'Minore melodica', tonalName: 'melodic minor', family: MINORS, description: 'Minore con 6ª e 7ª maggiori (versione jazz): su accordi m(maj7).' },
  { id: 'phrygian-dominant', name: 'Frigia dominante', tonalName: 'phrygian dominant', family: MINORS, description: 'V modo della minore armonica: dominante con b9 e b13, suono flamenco/tango.' },
  { id: 'lydian-dominant', name: 'Lidia dominante', tonalName: 'lydian dominant', family: MINORS, description: 'IV modo della minore melodica: dominante con #11 (7#11).' },
  { id: 'altered', name: 'Alterata', tonalName: 'altered', intervals: ['1P', '2m', '3m', '4d', '5d', '6m', '7m'], family: MINORS, description: 'VII modo della minore melodica: dominante con tensioni alterate (7alt).' },
  { id: 'major-pentatonic', name: 'Pentatonica maggiore', tonalName: 'major pentatonic', formNames: { 0: 'E', 1: 'D', 2: 'C', 3: 'A', 4: 'G' }, family: PENTA, description: 'Cinque note, senza 4ª e 7ª: country, blues maggiore, melodie semplici.' },
  { id: 'minor-pentatonic', name: 'Pentatonica minore', tonalName: 'minor pentatonic', formNames: { 0: 'G', 1: 'E', 2: 'D', 3: 'C', 4: 'A' }, family: PENTA, description: 'Cinque note: il cuore del blues e del rock.' },
  { id: 'blues', name: 'Blues', tonalName: 'blues', coreDegrees: [0, 1, 2, 4, 5], formNames: { 0: 'G', 1: 'E', 2: 'D', 4: 'C', 5: 'A' }, family: PENTA, description: 'Pentatonica minore con la blue note (b5).' },
];

export function findScaleType(id: string | null): ScaleType | null {
  return SCALE_TYPES.find((t) => t.id === id) ?? null;
}

export interface ScaleDegree {
  note: string;
  /** Interval from the root as shown to the player: 1, 2, b3, #4... */
  interval: string;
  /** Distance to the next note: S = semitone, T = tone, T½ = tone and a half. */
  step: string;
}

export interface HarmonizedChord {
  /** Roman numeral with quality marker, e.g. "ii", "V", "vii°". */
  degree: string;
  name: string;
  notes: string[];
  intervals: string[];
}

export interface ScaleResult {
  type: ScaleType;
  root: string;
  notes: string[];
  degrees: ScaleDegree[];
  /** Triads and four-note chords by stacking thirds; null for scales with fewer than 7 notes. */
  triads: HarmonizedChord[] | null;
  sevenths: HarmonizedChord[] | null;
}

const MAJOR_SEMITONES = [0, 2, 4, 5, 7, 9, 11];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

function accidentals(diff: number): string {
  return diff < 0 ? 'b'.repeat(-diff) : '#'.repeat(diff);
}

/** Label of an interval by its number (1..7) and size in semitones: 3 + 3 -> "b3". */
export function intervalLabel(num: number, semitones: number): string {
  return accidentals(semitones - MAJOR_SEMITONES[num - 1]) + num;
}

function stepLabel(semitones: number): string {
  return ({ 1: 'S', 2: 'T', 3: 'T½', 4: '2T' } as Record<number, string>)[semitones] ?? String(semitones);
}

const TRIAD_SYMBOLS: Record<string, string> = {
  '0,4,7': '',
  '0,3,7': 'm',
  '0,3,6': 'dim',
  '0,4,8': 'aug',
};

const SEVENTH_SYMBOLS: Record<string, string> = {
  '0,4,7,11': 'maj7',
  '0,3,7,10': 'm7',
  '0,4,7,10': '7',
  '0,3,6,10': 'm7b5',
  '0,3,6,9': 'dim7',
  '0,3,7,11': 'm(maj7)',
  '0,4,8,11': 'maj7#5',
  '0,4,8,10': '7#5',
  '0,4,6,10': '7b5',
};

function chroma(note: string): number {
  return Note.chroma(note) as number;
}

function harmonize(notes: string[], size: 3 | 4): HarmonizedChord[] {
  const n = notes.length;
  return notes.map((root, i) => {
    const chordNotes = Array.from({ length: size }, (_, k) => notes[(i + 2 * k) % n]);
    const semis = chordNotes.map((c) => (chroma(c) - chroma(root) + 12) % 12);
    const key = semis.join(',');
    const symbol = (size === 3 ? TRIAD_SYMBOLS : SEVENTH_SYMBOLS)[key];
    const name = symbol !== undefined ? root + symbol : (Chord.detect(chordNotes)[0] ?? root + '?');

    // chord tones are the 1st, 3rd, 5th (and 7th) above the chord root
    const intervals = semis.map((s, k) => intervalLabel(1 + 2 * k, s));

    const minorThird = semis[1] === 3;
    let marker = '';
    if (key === '0,3,6' || key === '0,3,6,9') marker = '°';
    else if (key === '0,3,6,10') marker = 'ø';
    else if (key === '0,4,8' || key === '0,4,8,11' || key === '0,4,8,10') marker = '+';
    const roman = minorThird ? ROMAN[i].toLowerCase() : ROMAN[i];

    return { degree: roman + marker, name, notes: chordNotes, intervals };
  });
}

export function buildScale(type: ScaleType, root: string): ScaleResult {
  const intervals = type.intervals ?? Scale.get(`${root} ${type.tonalName}`).intervals;
  const notes = type.intervals
    ? type.intervals.map((i) => Note.transpose(root, i))
    : Scale.get(`${root} ${type.tonalName}`).notes;
  const semis = notes.map((n) => (chroma(n) - chroma(root) + 12) % 12);

  const degrees: ScaleDegree[] = notes.map((note, i) => {
    const interval = Interval.get(intervals[i]);
    const next = i + 1 < notes.length ? semis[i + 1] : 12;
    return {
      note,
      interval: intervalLabel(interval.num ?? i + 1, interval.semitones ?? semis[i]),
      step: stepLabel(next - semis[i]),
    };
  });

  const seven = notes.length === 7;
  return {
    type,
    root,
    notes,
    degrees,
    triads: seven ? harmonize(notes, 3) : null,
    sevenths: seven ? harmonize(notes, 4) : null,
  };
}

/** Interval formula of a scale type, independent of the root: "1 2 b3 4 5 b6 b7". */
export function scaleFormula(type: ScaleType): string {
  return buildScale(type, 'C')
    .degrees.map((d) => d.interval)
    .join(' ');
}
