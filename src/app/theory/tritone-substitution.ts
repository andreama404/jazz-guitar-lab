import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Chord, Note } from 'tonal';
import { ROOTS } from '../scales/scale-theory';

interface ChordInfo {
  name: string;
  notes: string[];
}

function dominant7(root: string): ChordInfo {
  return { name: `${root}7`, notes: Chord.getChord('7', root).notes };
}

function minor7(root: string): ChordInfo {
  return { name: `${root}m7`, notes: Chord.getChord('m7', root).notes };
}

function major7(root: string): ChordInfo {
  return { name: `${root}maj7`, notes: Chord.getChord('maj7', root).notes };
}

/** Tritone substitution: the dominant 7th a tritone away shares the same third and seventh. */
@Component({
  selector: 'app-tritone-substitution',
  template: `
    <h2 class="text-xl font-bold text-slate-800">Sostituzione di tritono</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      Un accordo di settima di dominante si può sostituire con quello situato a un tritono di distanza (quinta diminuita). I due accordi condividono la terza e
      la settima, ma a ruoli invertiti: la terza dell'uno è la settima dell'altro. Il basso scende di semitono verso la tonica.
    </p>

    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      @for (c of compared(); track c.title) {
        <div class="rounded-lg bg-slate-50 p-4">
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ c.title }}</div>
          <div class="text-2xl font-bold text-slate-800">{{ c.chord.name }}</div>
          <div class="mt-1 text-sm text-slate-600">{{ c.chord.notes.join(' - ') }}</div>
          <div class="mt-1 font-mono text-xs text-slate-400">{{ c.guide }}</div>
        </div>
      }
    </div>

    <div class="space-y-3">
      @for (p of progressions(); track p.title) {
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ p.title }}</div>
          <div class="mt-1 flex flex-wrap items-center gap-2">
            @for (c of p.chords; track $index) {
              <span class="rounded-lg px-3 py-1.5 text-sm font-semibold shadow"
                [class.bg-slate-900]="c.highlight"
                [class.text-white]="c.highlight"
                [class.bg-white]="!c.highlight"
                [class.text-slate-700]="!c.highlight">
                {{ c.name }}
              </span>
              @if (!$last) {
                <span class="text-slate-400">→</span>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class TritoneSubstitution {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly key = computed(() => {
    const root = this.params().get('root');
    return root !== null && ROOTS.includes(root) ? root : ROOTS[0];
  });

  private readonly chords = computed(() => {
    const key = this.key();
    const v = Note.simplify(Note.transpose(key, '5P'));
    const subV = Note.simplify(Note.transpose(v, '5d'));
    const ii = Note.simplify(Note.transpose(key, '2M'));
    return { tonic: major7(key), ii: minor7(ii), v: dominant7(v), subV: dominant7(subV) };
  });

  protected readonly compared = computed(() => {
    const { v, subV } = this.chords();
    const guide = (c: ChordInfo) => `terza ${c.notes[1]} · settima ${c.notes[3]}`;
    return [
      { title: 'Dominante (V7)', chord: v, guide: guide(v) },
      { title: 'Sostituto di tritono (subV7)', chord: subV, guide: guide(subV) },
    ];
  });

  protected readonly progressions = computed(() => {
    const { tonic, ii, v, subV } = this.chords();
    const mark = (c: ChordInfo, highlight = false) => ({ name: c.name, highlight });
    return [
      { title: 'II - V - I', chords: [mark(ii), mark(v), mark(tonic)] },
      { title: 'II - subV - I', chords: [mark(ii), mark(subV, true), mark(tonic)] },
    ];
  });
}
