import { Chord, Interval } from 'tonal';
import { intervalLabel } from '../scales/scale-theory';

export interface ChordType {
  id: string;
  name: string;
  /** Symbol understood by Tonal's Chord.getChord, e.g. "maj7". */
  symbol: string;
  /** Appended to the root in the chord name: "C" + "maj7". */
  suffix: string;
  description: string;
}

export const CHORD_TYPES: readonly ChordType[] = [
  { id: 'major', name: 'Maggiore', symbol: 'M', suffix: '', description: 'Triade maggiore: tonica, terza maggiore, quinta giusta.' },
  { id: 'minor', name: 'Minore', symbol: 'm', suffix: 'm', description: 'Triade minore: tonica, terza minore, quinta giusta.' },
  { id: 'dominant7', name: 'Dominante 7', symbol: '7', suffix: '7', description: 'Triade maggiore con settima minore: il V grado per eccellenza.' },
  { id: 'major7', name: 'Maggiore 7', symbol: 'maj7', suffix: 'maj7', description: 'Triade maggiore con settima maggiore: suono morbido e jazz.' },
  { id: 'minor7', name: 'Minore 7', symbol: 'm7', suffix: 'm7', description: 'Triade minore con settima minore: il II e il VI grado del maggiore.' },
  { id: 'sus2', name: 'Sospesa di seconda', symbol: 'sus2', suffix: 'sus2', description: 'Tonica, seconda, quinta giusta: senza terza, suono aperto e ambiguo.' },
  { id: 'sus4', name: 'Sospesa di quarta', symbol: 'sus4', suffix: 'sus4', description: 'Tonica, quarta, quinta giusta: la quarta sostituisce la terza e chiede di risolvere.' },
  { id: 'major6', name: 'Sesta', symbol: '6', suffix: '6', description: 'Triade maggiore con sesta maggiore: alternativa stabile al maj7.' },
  { id: 'minor6', name: 'Minore 6', symbol: 'm6', suffix: 'm6', description: 'Triade minore con sesta maggiore: suono dorico, usato anche come tonica minore.' },
  { id: 'minor-major7', name: 'Minore con settima maggiore', symbol: 'mMaj7', suffix: 'm(maj7)', description: 'Triade minore con settima maggiore: colore teso e cinematografico.' },
  { id: 'dominant9', name: 'Dominante 9', symbol: '9', suffix: '9', description: 'Dominante 7 con la nona: più ricco e jazz del semplice 7.' },
  { id: 'dominant13', name: 'Dominante 13', symbol: '13', suffix: '13', description: 'Dominante 7 con la tredicesima: suono pieno tipico del blues jazz.' },
  { id: 'dominant7-flat9', name: 'Dominante 7♭9', symbol: '7b9', suffix: '7b9', description: 'Dominante con nona minore: tensione forte che risolve sul I.' },
  { id: 'dominant7-sharp11', name: 'Dominante 7♯11', symbol: '7#11', suffix: '7#11', description: 'Dominante con undicesima aumentata: suono lidio dominante.' },
  { id: 'add9', name: 'Add9', symbol: 'add9', suffix: 'add9', description: 'Triade maggiore con la nona, senza settima: suono aperto e luminoso.' },
];

export const TRIAD_TYPES: readonly ChordType[] = [
  { id: 'major', name: 'Maggiore', symbol: 'M', suffix: '', description: 'Tonica, terza maggiore, quinta giusta.' },
  { id: 'minor', name: 'Minore', symbol: 'm', suffix: 'm', description: 'Tonica, terza minore, quinta giusta.' },
  { id: 'diminished', name: 'Diminuita', symbol: 'dim', suffix: 'dim', description: 'Tonica, terza minore, quinta diminuita.' },
  { id: 'augmented', name: 'Aumentata', symbol: 'aug', suffix: 'aug', description: 'Tonica, terza maggiore, quinta aumentata.' },
  { id: 'sus2', name: 'Sospesa di seconda', symbol: 'sus2', suffix: 'sus2', description: 'Tonica, seconda, quinta giusta: senza terza, suono aperto e ambiguo.' },
  { id: 'sus4', name: 'Sospesa di quarta', symbol: 'sus4', suffix: 'sus4', description: 'Tonica, quarta, quinta giusta: la quarta sostituisce la terza e chiede di risolvere.' },
];

export const QUADRIAD_TYPES: readonly ChordType[] = [
  { id: 'major7', name: 'Maggiore 7', symbol: 'maj7', suffix: 'maj7', description: 'Triade maggiore con settima maggiore.' },
  { id: 'minor7', name: 'Minore 7', symbol: 'm7', suffix: 'm7', description: 'Triade minore con settima minore.' },
  { id: 'dominant7', name: 'Dominante 7', symbol: '7', suffix: '7', description: 'Triade maggiore con settima minore.' },
  { id: 'half-diminished', name: 'Semidiminuita', symbol: 'm7b5', suffix: 'm7b5', description: 'Triade diminuita con settima minore.' },
  { id: 'diminished7', name: 'Diminuita 7', symbol: 'dim7', suffix: 'dim7', description: 'Triade diminuita con settima diminuita.' },
  { id: 'dominant7-sharp5', name: 'Dominante 7 quinta aumentata', symbol: '7#5', suffix: '7#5', description: 'Dominante con quinta eccedente.' },
  { id: 'major6', name: 'Sesta', symbol: '6', suffix: '6', description: 'Triade maggiore con sesta maggiore: alternativa stabile al maj7.' },
  { id: 'minor6', name: 'Minore 6', symbol: 'm6', suffix: 'm6', description: 'Triade minore con sesta maggiore: suono dorico, usato anche come tonica minore.' },
  { id: 'minor-major7', name: 'Minore con settima maggiore', symbol: 'mMaj7', suffix: 'm(maj7)', description: 'Triade minore con settima maggiore: colore teso e cinematografico.' },
];

/** Extended chords (five notes or more), used for arpeggios. */
export const EXTENDED_TYPES: readonly ChordType[] = [
  { id: 'dominant9', name: 'Dominante 9', symbol: '9', suffix: '9', description: 'Dominante 7 con la nona: più ricco e jazz del semplice 7.' },
  { id: 'dominant13', name: 'Dominante 13', symbol: '13', suffix: '13', description: 'Dominante 7 con la tredicesima: suono pieno tipico del blues jazz.' },
  { id: 'dominant7-flat9', name: 'Dominante 7♭9', symbol: '7b9', suffix: '7b9', description: 'Dominante con nona minore: tensione forte che risolve sul I.' },
  { id: 'dominant7-sharp11', name: 'Dominante 7♯11', symbol: '7#11', suffix: '7#11', description: 'Dominante con undicesima aumentata: suono lidio dominante.' },
  { id: 'add9', name: 'Add9', symbol: 'add9', suffix: 'add9', description: 'Triade maggiore con la nona, senza settima: suono aperto e luminoso.' },
];

export function findChordType(id: string | null, types: readonly ChordType[] = CHORD_TYPES): ChordType | null {
  return types.find((t) => t.id === id) ?? null;
}

export interface ChordResult {
  type: ChordType;
  root: string;
  /** Full chord name, e.g. "Cmaj7". */
  name: string;
  notes: string[];
  /** Interval of each note from the root: 1, b3, 5, b7... */
  intervals: string[];
}

export function buildChord(type: ChordType, root: string): ChordResult {
  const chord = Chord.getChord(type.symbol, root);
  const intervals = chord.intervals.map((i) => {
    const interval = Interval.get(i);
    return intervalLabel(interval.num, interval.semitones);
  });
  return { type, root, name: root + type.suffix, notes: chord.notes, intervals };
}
