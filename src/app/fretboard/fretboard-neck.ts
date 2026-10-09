import { Component, computed, input } from '@angular/core';
import { FretboardDot } from './fretboard-diagram';

/**
 * Compact horizontal fretboard window, as the player sees the neck: frets grow to the right,
 * 1st string (high e) on top and 6th string (low E) at the bottom. Shows a few frets around the
 * given dots; the nut is drawn when the window reaches the first fret.
 */
@Component({
  selector: 'app-fretboard-neck',
  imports: [],
  templateUrl: './fretboard-neck.html',
})
export class FretboardNeck {
  readonly dots = input.required<FretboardDot[]>();
  /** The window is at least this many frets wide. */
  readonly minColumns = input(8);

  protected readonly stringGap = 28;
  protected readonly fretWidth = 56;
  protected readonly left = 28;
  protected readonly top = 14;
  protected readonly stringNumbers = [1, 2, 3, 4, 5, 6];
  protected readonly boardHeight = 5 * this.stringGap;
  protected readonly height = this.top + this.boardHeight + 48;

  /** First fret shown. */
  protected readonly startFret = computed(() => {
    const lowest = Math.min(...this.dots().map((d) => d.fret));
    return lowest <= 2 ? 1 : lowest - 2;
  });

  protected readonly columns = computed(() => {
    const highest = Math.max(...this.dots().map((d) => d.fret));
    return Math.max(this.minColumns(), highest - this.startFret() + 3);
  });

  protected readonly showNut = computed(() => this.startFret() === 1);
  protected readonly width = computed(() => this.left + this.columns() * this.fretWidth + 8);

  protected readonly fretLines = computed(() => Array.from({ length: this.columns() + 1 }, (_, i) => this.left + i * this.fretWidth));
  protected readonly fretNumbers = computed(() => Array.from({ length: this.columns() }, (_, i) => this.startFret() + i));

  protected stringY(stringNumber: number): number {
    return this.top + (stringNumber - 1) * this.stringGap;
  }

  protected fretCenter(fret: number): number {
    return this.left + (fret - this.startFret() + 0.5) * this.fretWidth;
  }

  /** Open strings are drawn just left of the nut. */
  protected dotX(fret: number): number {
    return fret === 0 ? this.left - 16 : this.fretCenter(fret);
  }
}
