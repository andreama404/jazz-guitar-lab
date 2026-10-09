import { Component, computed } from '@angular/core';
import { Note } from 'tonal';
import { PlayButton } from '../shared/play-button';
import { injectRoot } from './theory-root';

const INTERVALS = [
  { semitones: 0, short: '1P', name: 'Unisono' },
  { semitones: 1, short: '2m', name: 'Seconda minore' },
  { semitones: 2, short: '2M', name: 'Seconda maggiore' },
  { semitones: 3, short: '3m', name: 'Terza minore' },
  { semitones: 4, short: '3M', name: 'Terza maggiore' },
  { semitones: 5, short: '4P', name: 'Quarta giusta' },
  { semitones: 6, short: '4A', name: 'Quarta aumentata / quinta diminuita (tritono)' },
  { semitones: 7, short: '5P', name: 'Quinta giusta' },
  { semitones: 8, short: '6m', name: 'Sesta minore' },
  { semitones: 9, short: '6M', name: 'Sesta maggiore' },
  { semitones: 10, short: '7m', name: 'Settima minore' },
  { semitones: 11, short: '7M', name: 'Settima maggiore' },
  { semitones: 12, short: '8P', name: 'Ottava' },
];

/** Interval names, size in semitones and where to find them on the guitar neck. */
@Component({
  selector: 'app-intervals',
  imports: [PlayButton],
  template: `
    <h2 class="text-xl font-bold text-slate-800">Intervalli</h2>
    <p class="mt-1 mb-3 text-sm text-slate-500">Nomi, semitoni e come riconoscerli sulla tastiera, a partire dalla nota scelta.</p>
    <ul class="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
      <li>Sulla <strong>stessa corda</strong> ogni tasto è un semitono: i tasti di distanza sono i semitoni dell'intervallo.</li>
      <li>
        Sulla <strong>corda più acuta adiacente</strong> parti dallo stesso tasto (quarta giusta) e sposti di quanto manca: i tasti di distanza sono i
        semitoni meno 5. Tra la 3ª e la 2ª corda (Sol–Si) l'accordatura è diversa e va tolto 4 invece di 5.
      </li>
    </ul>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th class="py-2 pr-4">Sigla</th>
            <th class="py-2 pr-4">Intervallo</th>
            <th class="py-2 pr-4">Semitoni</th>
            <th class="py-2 pr-4">Nota da {{ root() }}</th>
            <th class="py-2 pr-4">Corda acuta adiacente</th>
            <th class="py-2">Suono</th>
          </tr>
        </thead>
        <tbody>
          @for (i of rows(); track i.short) {
            <tr class="border-b border-slate-100">
              <td class="py-2 pr-4 font-mono text-slate-500">{{ i.short }}</td>
              <td class="py-2 pr-4 font-semibold text-slate-800">{{ i.name }}</td>
              <td class="py-2 pr-4">{{ i.semitones }}</td>
              <td class="py-2 pr-4 font-semibold">{{ i.note }}</td>
              <td class="py-2 pr-4 text-slate-600">{{ i.adjacent }}</td>
              <td class="py-2"><app-play-button mode="arpeggio" [notes]="i.pair" label=""></app-play-button></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class Intervals {
  protected readonly root = injectRoot();

  protected readonly rows = computed(() =>
    INTERVALS.map((i) => {
      const d = i.semitones - 5;
      return {
        ...i,
        note: Note.transpose(this.root(), i.short),
        pair: i.semitones === 0 ? [this.root()] : [this.root(), Note.transpose(this.root(), i.short)],
        adjacent: d === 0 ? 'stesso tasto' : d > 0 ? `${d} ${d === 1 ? 'tasto' : 'tasti'} più avanti` : `${-d} ${d === -1 ? 'tasto' : 'tasti'} più indietro`,
      };
    }),
  );
}
