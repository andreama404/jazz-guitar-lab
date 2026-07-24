export interface ChordEntry {
  id: string;
  name: string;
  /** Frets from low E (string 6) to high e (string 1). 'x' = muted, 0 = open. */
  frets: (number | 'x')[];
  startFret?: number;
}
