import { Component, computed, input } from '@angular/core';

export interface FretboardDot {
  /** 1 = high e (thinnest string) ... 6 = low E (thickest string). */
  string: number;
  /** 0 = open string. */
  fret: number;
  label?: string;
  /** Marks the root/starting note, shown in a different color. */
  root?: boolean;
}

@Component({
  selector: 'app-fretboard-diagram',
  imports: [],
  templateUrl: './fretboard-diagram.html',
})
export class FretboardDiagram {
  readonly dots = input.required<FretboardDot[]>();
  readonly mutedStrings = input<number[]>([]);
  readonly startFret = input(1);
  readonly fretCount = input(4);

  private readonly stringCount = 6;
  private readonly stringGap = 30;
  private readonly fretGap = 40;
  private readonly leftMargin = 30;
  private readonly topMargin = 30;

  protected readonly width = computed(() => this.leftMargin + (this.stringCount - 1) * this.stringGap + 30);
  protected readonly height = computed(() => this.topMargin + this.fretCount() * this.fretGap + 20);

  protected readonly strings = computed(() =>
    Array.from({ length: this.stringCount }, (_, i) => this.leftMargin + i * this.stringGap),
  );

  protected readonly frets = computed(() =>
    Array.from({ length: this.fretCount() + 1 }, (_, i) => this.topMargin + i * this.fretGap),
  );

  protected readonly showNut = computed(() => this.startFret() === 1);

  protected readonly fretLabel = computed(() => (this.startFret() > 1 ? `${this.startFret()}fr` : ''));

  protected stringX(stringNumber: number): number {
    // stringNumber 1 (high e) is drawn on the right, 6 (low E) on the left.
    return this.leftMargin + (this.stringCount - stringNumber) * this.stringGap;
  }

  protected dotY(fret: number): number {
    const relativeFret = fret - this.startFret() + 1;
    return this.topMargin + (relativeFret - 0.5) * this.fretGap;
  }

  protected openY(): number {
    return this.topMargin - 12;
  }

  protected isMuted(stringNumber: number): boolean {
    return this.mutedStrings().includes(stringNumber);
  }

  protected isOpenDot(dot: FretboardDot): boolean {
    return dot.fret === 0;
  }
}
