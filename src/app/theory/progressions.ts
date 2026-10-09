import { Component, computed } from '@angular/core';
import { ChordItem, ChordLine, chordAt } from './chord-line';
import { injectRoot } from './theory-root';

/** Typical jazz progressions: turnarounds, the jazz blues and the rhythm-changes A section. */
@Component({
  selector: 'app-progressions',
  imports: [ChordLine],
  template: `
    <h2 class="text-xl font-bold text-slate-800">Progressioni tipiche</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">Giri di accordi che ricorrono in moltissimi standard, trasposti nella tonalità scelta.</p>
    <div class="space-y-5">
      @for (g of groups(); track g.title) {
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ g.title }}</div>
          <p class="mb-1 text-xs text-slate-400">{{ g.text }}</p>
          <app-chord-line [bars]="g.bars"></app-chord-line>
        </div>
      }
    </div>
  `,
})
export class Progressions {
  private readonly key = injectRoot();

  protected readonly groups = computed(() => {
    const k = this.key();
    const c = (interval: string, suffix: string, roman: string) => chordAt(k, interval, suffix, roman);
    const group = (title: string, text: string, bars: ChordItem[][]) => ({ title, text, bars });
    return [
      group('Turnaround I - VI - II - V', 'Chiude una frase riportando alla tonica.', [
        [c('1P', 'maj7', 'Imaj7'), c('6M', 'm7', 'VIm7'), c('2M', 'm7', 'IIm7'), c('5P', '7', 'V7')],
      ]),
      group('Turnaround III - VI - II - V', 'Come il precedente, con le dominanti secondarie VI7.', [
        [c('3M', 'm7', 'IIIm7'), c('6M', '7', 'VI7'), c('2M', 'm7', 'IIm7'), c('5P', '7', 'V7')],
      ]),
      group('Blues jazz (12 battute)', 'Il blues con II-V nelle ultime battute e il diminuito di passaggio.', [
        [c('1P', '7', 'I7')],
        [c('4P', '7', 'IV7')],
        [c('1P', '7', 'I7')],
        [c('5P', 'm7', 'Vm7'), c('1P', '7', 'I7')],
        [c('4P', '7', 'IV7')],
        [c('4A', 'dim7', '♯IVdim7')],
        [c('1P', '7', 'I7')],
        [c('3M', 'm7', 'IIIm7'), c('6M', '7', 'VI7')],
        [c('2M', 'm7', 'IIm7')],
        [c('5P', '7', 'V7')],
        [c('1P', '7', 'I7'), c('6M', '7', 'VI7')],
        [c('2M', 'm7', 'IIm7'), c('5P', '7', 'V7')],
      ]),
      group('Anatole (sezione A dei Rhythm Changes)', 'Giro di I - VI - II - V ripetuto con le dominanti secondarie.', [
        [c('1P', 'maj7', 'Imaj7'), c('6M', '7', 'VI7')],
        [c('2M', 'm7', 'IIm7'), c('5P', '7', 'V7')],
        [c('3M', 'm7', 'IIIm7'), c('6M', '7', 'VI7')],
        [c('2M', 'm7', 'IIm7'), c('5P', '7', 'V7')],
      ]),
    ];
  });
}
