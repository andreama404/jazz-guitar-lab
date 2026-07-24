import { FretboardDot } from '../fretboard/fretboard-diagram';

export interface ScaleEntry {
  id: string;
  name: string;
  description: string;
  notes?: string[];
  dots: FretboardDot[];
  startFret: number;
  fretCount: number;
}
