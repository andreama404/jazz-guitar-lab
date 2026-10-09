import { Component, computed } from '@angular/core';
import { ChordItem, ChordLine, chordAt } from './chord-line';
import { injectRoot } from './theory-root';

/** Chords borrowed from the parallel minor (and Phrygian) to colour a major key. */
@Component({
  selector: 'app-modal-interchange',
  imports: [ChordLine],
  template: `
    <h2 class="text-xl font-bold text-slate-800">Intercambio modale</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      Si prendono in prestito accordi dal modo parallelo, cioè dalla scala che parte dalla stessa nota ma con un altro carattere. Il più usato è il minore naturale
      (eolio): da {{ root() }} maggiore si prendono gli accordi di {{ root() }} minore.
    </p>
    <div class="mb-6 overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th class="py-2 pr-4">Grado</th>
            <th class="py-2 pr-4">Accordo</th>
            <th class="py-2 pr-4">Modo di provenienza</th>
            <th class="py-2">Effetto</th>
          </tr>
        </thead>
        <tbody>
          @for (c of borrowed(); track c.roman) {
            <tr class="border-b border-slate-100">
              <td class="py-2 pr-4 font-mono text-slate-500">{{ c.roman }}</td>
              <td class="py-2 pr-4 font-semibold text-slate-800">{{ c.name }}</td>
              <td class="py-2 pr-4 text-slate-600">{{ c.mode }}</td>
              <td class="py-2 text-slate-600">{{ c.text }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    <div class="space-y-4">
      @for (e of examples(); track e.title) {
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ e.title }}</div>
          <app-chord-line [bars]="e.bars"></app-chord-line>
        </div>
      }
    </div>
  `,
})
export class ModalInterchange {
  protected readonly root = injectRoot();

  protected readonly borrowed = computed(() => {
    const k = this.root();
    const row = (interval: string, suffix: string, roman: string, mode: string, text: string) => ({
      roman,
      name: chordAt(k, interval, suffix, roman).name,
      mode,
      text,
    });
    return [
      row('1P', 'm7', 'Im7', 'Eolio', 'Tonica minore: colore malinconico.'),
      row('2M', 'm7♭5', 'IIm7♭5', 'Eolio', 'Prepara il V in modo minore.'),
      row('3m', 'maj7', '♭IIImaj7', 'Eolio', 'Mediante bemolle: luminoso ma lontano.'),
      row('4P', 'm7', 'IVm7', 'Eolio', 'Sottodominante minore: il più usato, sapore agrodolce.'),
      row('6m', 'maj7', '♭VImaj7', 'Eolio', 'Largo e drammatico; spesso verso ♭VII o V.'),
      row('7m', '7', '♭VII7', 'Eolio / Misolidio', 'Dominante subtonale: risolve sulla tonica senza sensibile.'),
      row('2m', 'maj7', '♭IImaj7', 'Frigio', 'Napoletana: risolve verso il I.'),
    ];
  });

  protected readonly examples = computed(() => {
    const k = this.root();
    const c = (interval: string, suffix: string, roman: string, h = false): ChordItem => chordAt(k, interval, suffix, roman, h);
    return [
      { title: 'Sottodominante minore', bars: [[c('1P', 'maj7', 'Imaj7'), c('4P', 'maj7', 'IVmaj7'), c('4P', 'm7', 'IVm7', true), c('1P', 'maj7', 'Imaj7')]] },
      { title: '♭VI - ♭VII - I', bars: [[c('6m', 'maj7', '♭VImaj7', true), c('7m', '7', '♭VII7', true), c('1P', 'maj7', 'Imaj7')]] },
      { title: 'II-V con II semidiminuito in tonalità maggiore', bars: [[c('2M', 'm7♭5', 'IIm7♭5', true), c('5P', '7', 'V7'), c('1P', 'maj7', 'Imaj7')]] },
    ];
  });
}
