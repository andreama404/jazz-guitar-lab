import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Note } from 'tonal';
import { ChordItem, ChordLine, chordAt } from './chord-line';
import { injectRoot } from './theory-root';

const SCALES = [
  { id: 'minor-pentatonic', name: 'Pentatonica minore', text: 'Il suono base del blues, su tutta la struttura.' },
  { id: 'blues', name: 'Blues', text: 'La pentatonica minore con la blue note (♭5).' },
  { id: 'major-pentatonic', name: 'Pentatonica maggiore', text: 'Il lato più dolce: si alterna alla minore.' },
  { id: 'mixolydian', name: 'Misolidia', text: 'Segue i dominanti 7: adatta a blues più jazz.' },
];

/** The 12-bar blues, its common variants and the scales used over it. */
@Component({
  selector: 'app-blues',
  imports: [ChordLine, RouterLink],
  template: `
    <h2 class="text-xl font-bold text-slate-800">Blues</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      La forma di 12 battute che sta alla base di blues, rock, jazz e rhythm and blues. Si usano tre accordi, I, IV e V, di solito tutti di settima di
      dominante.
    </p>

    <div class="space-y-5">
      @for (g of forms(); track g.title) {
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ g.title }}</div>
          <p class="mb-1 text-xs text-slate-400">{{ g.text }}</p>
          <app-chord-line [bars]="g.bars"></app-chord-line>
        </div>
      }
    </div>

    <h3 class="mt-6 font-semibold text-slate-800">Scale</h3>
    <div class="mt-2 flex flex-wrap gap-2">
      @for (s of scales; track s.id) {
        <a
          [routerLink]="['/scales']"
          [queryParams]="{ root: root(), type: s.id }"
          class="rounded-lg bg-slate-50 px-3 py-1.5 text-sm shadow transition hover:bg-slate-900 hover:text-white"
        >
          <span class="font-semibold">{{ s.name }}</span>
          <span class="ml-1 text-xs opacity-70">{{ s.text }}</span>
        </a>
      }
    </div>

    <h3 class="mt-6 font-semibold text-slate-800">La blue note</h3>
    <p class="mt-1 text-sm text-slate-600">
      È la quinta diminuita ({{ blueNote() }} su {{ root() }}), aggiunta alla pentatonica minore. Dà la tipica tensione "sporca" del blues: si usa di passaggio,
      tra la quarta e la quinta, senza fermarsi.
    </p>
  `,
})
export class Blues {
  protected readonly root = injectRoot();
  protected readonly scales = SCALES;

  protected readonly blueNote = computed(() => Note.simplify(Note.transpose(this.root(), '5d')));

  protected readonly forms = computed(() => {
    const k = this.root();
    const c = (interval: string, suffix: string, roman: string): ChordItem => chordAt(k, interval, suffix, roman);
    const I = c('1P', '7', 'I7');
    const IV = c('4P', '7', 'IV7');
    const V = c('5P', '7', 'V7');
    const group = (title: string, text: string, bars: ChordItem[][]) => ({ title, text, bars });
    return [
      group('12 battute base', 'Quattro battute di I, due di IV, due di I, poi V - IV - I - V (l\'ultima battuta riporta al giro).', [
        [I], [I], [I], [I], [IV], [IV], [I], [I], [V], [IV], [I], [V],
      ]),
      group('Quick change', 'Alla seconda battuta si anticipa il IV.', [[I], [IV], [I], [I], [IV], [IV], [I], [I], [V], [IV], [I], [V]]),
      group('Blues minore', 'Accordi minori su I e IV, ♭VI7 e V7 in cadenza.', [
        [c('1P', 'm7', 'Im7')],
        [c('1P', 'm7', 'Im7')],
        [c('1P', 'm7', 'Im7')],
        [c('1P', 'm7', 'Im7')],
        [c('4P', 'm7', 'IVm7')],
        [c('4P', 'm7', 'IVm7')],
        [c('1P', 'm7', 'Im7')],
        [c('1P', 'm7', 'Im7')],
        [c('6m', '7', '♭VI7')],
        [V],
        [c('1P', 'm7', 'Im7')],
        [V],
      ]),
    ];
  });
}
