import { Component, inject, input, signal } from '@angular/core';
import {
  AudioPlayer,
  PlannedSound,
  ascendingMidis,
  chordNameMidis,
  chordPlan,
  dotMidis,
  orderedDotMidis,
  progressionPlan,
  scaleRun,
  sequencePlan,
} from './audio';

export type PlayMode =
  /** note names: the scale up and down */
  | 'scale'
  /** note names: the notes strummed together as a chord */
  | 'chord'
  /** note names: the notes one after the other, ascending */
  | 'arpeggio'
  /** fretboard dots: strummed together */
  | 'dots-chord'
  /** fretboard dots: one after the other, ascending */
  | 'dots-sequence'
  /** fretboard dots: one after the other, in the order given */
  | 'dots-ordered'
  /** chord names: a progression, one chord after the other */
  | 'progression';

/** Button that plays notes, dots or chord names; click again to stop. */
@Component({
  selector: 'app-play-button',
  template: `
    <button
      type="button"
      class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold shadow transition"
      [class.bg-slate-900]="playing()"
      [class.text-white]="playing()"
      [class.bg-white]="!playing()"
      [class.text-slate-700]="!playing()"
      (click)="toggle()"
    >
      <span aria-hidden="true">{{ playing() ? '■' : '▶' }}</span>
      {{ playing() ? 'Stop' : label() }}
    </button>
  `,
})
export class PlayButton {
  private readonly audio = inject(AudioPlayer);

  readonly mode = input.required<PlayMode>();
  readonly label = input('Ascolta');
  readonly notes = input<string[]>([]);
  readonly dots = input<{ string: number; fret: number }[]>([]);
  readonly names = input<string[]>([]);

  protected readonly playing = signal(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

  protected toggle(): void {
    if (this.playing()) {
      this.audio.stop();
      this.finish();
      return;
    }
    const length = this.audio.play(this.buildPlan());
    if (!length) return;
    this.playing.set(true);
    this.timer = setTimeout(() => this.finish(), length + 100);
  }

  private buildPlan(): PlannedSound[] {
    switch (this.mode()) {
      case 'scale':
        return sequencePlan(scaleRun(this.notes()), 0.3, 0.7);
      case 'chord':
        return chordPlan(ascendingMidis(this.notes()));
      case 'arpeggio':
        return sequencePlan(ascendingMidis(this.notes()), 0.4, 1);
      case 'dots-chord':
        return chordPlan(dotMidis(this.dots()));
      case 'dots-sequence':
        return sequencePlan(dotMidis(this.dots()), 0.35, 0.9);
      case 'dots-ordered':
        return sequencePlan(orderedDotMidis(this.dots()), 0.3, 0.7);
      case 'progression':
        return progressionPlan(this.names().map((n) => chordNameMidis(n)));
    }
  }

  private finish(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.playing.set(false);
  }
}
