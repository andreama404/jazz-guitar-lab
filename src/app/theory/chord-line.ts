import { Component, input } from '@angular/core';
import { Note } from 'tonal';

export interface ChordItem {
  name: string;
  /** Degree shown under the chord (e.g. "IIm7"). */
  roman: string;
  highlight?: boolean;
}

/** Chord of the given interval above the key, e.g. chordAt('C', '2M', 'm7', 'IIm7') = Dm7. */
export function chordAt(key: string, interval: string, suffix: string, roman: string, highlight = false): ChordItem {
  return { name: Note.simplify(Note.transpose(key, interval)) + suffix, roman, highlight };
}

/** Chords grouped in bars, each chord with its degree below. */
@Component({
  selector: 'app-chord-line',
  template: `
    <div class="flex flex-wrap gap-2">
      @for (bar of bars(); track $index) {
        <div class="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2">
          @for (c of bar; track $index) {
            <div class="text-center">
              <div
                class="rounded-lg px-3 py-1.5 text-sm font-semibold shadow"
                [class.bg-slate-900]="c.highlight"
                [class.text-white]="c.highlight"
                [class.bg-white]="!c.highlight"
                [class.text-slate-700]="!c.highlight"
              >
                {{ c.name }}
              </div>
              <div class="mt-0.5 text-xs text-slate-400">{{ c.roman }}</div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ChordLine {
  readonly bars = input.required<ChordItem[][]>();
}
