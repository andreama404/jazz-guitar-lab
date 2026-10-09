import { Component, computed } from '@angular/core';
import { Scale } from 'tonal';
import { injectRoot } from './theory-root';

interface Version {
  title: string;
  tonal: string;
  text: string;
  /** Per degree: Roman numeral, triad suffix, seventh suffix. */
  degrees: [string, string, string][];
}

const VERSIONS: Version[] = [
  {
    title: 'Minore naturale',
    tonal: 'minor',
    text: 'La scala eolia. Il V è minore: manca la sensibile, quindi la risoluzione sul I è meno decisa.',
    degrees: [['I', 'm', 'm7'], ['II', 'dim', 'm7♭5'], ['♭III', '', 'maj7'], ['IV', 'm', 'm7'], ['V', 'm', 'm7'], ['♭VI', '', 'maj7'], ['♭VII', '', '7']],
  },
  {
    title: 'Minore armonico',
    tonal: 'harmonic minor',
    text: 'La settima è alzata: nasce il V7 maggiore con la sensibile, e un VII diminuito. Il ♭III diventa aumentato.',
    degrees: [['I', 'm', 'm(maj7)'], ['II', 'dim', 'm7♭5'], ['♭III', 'aug', 'maj7♯5'], ['IV', 'm', 'm7'], ['V', '', '7'], ['♭VI', '', 'maj7'], ['VII', 'dim', 'dim7']],
  },
  {
    title: 'Minore melodico (ascendente)',
    tonal: 'melodic minor',
    text: 'Sesta e settima alzate. Il I diventa m(maj7), il IV un dominante (7) e il VI e il VII diventano semidiminuiti.',
    degrees: [['I', 'm', 'm(maj7)'], ['II', 'm', 'm7'], ['♭III', 'aug', 'maj7♯5'], ['IV', '', '7'], ['V', '', '7'], ['VI', 'dim', 'm7♭5'], ['VII', 'dim', 'm7♭5']],
  },
];

/** The chords built on each degree of the three minor scales. */
@Component({
  selector: 'app-minor-field',
  template: `
    <h2 class="text-xl font-bold text-slate-800">Campo armonico minore</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      La tonalità minore ha tre versioni della scala, e quindi tre campi armonici. Nella pratica si mescolano: il V7 viene dal minore armonico, il II semidiminuito
      dal naturale.
    </p>
    <div class="space-y-6">
      @for (v of versions(); track v.title) {
        <div>
          <h3 class="font-semibold text-slate-800">{{ v.title }} <span class="ml-2 text-sm font-normal text-slate-400">{{ v.notes }}</span></h3>
          <p class="mb-2 text-sm text-slate-500">{{ v.text }}</p>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th class="py-2 pr-4">Grado</th>
                  <th class="py-2 pr-4">Triade</th>
                  <th class="py-2">Quadriade</th>
                </tr>
              </thead>
              <tbody>
                @for (d of v.rows; track d.roman) {
                  <tr class="border-b border-slate-100">
                    <td class="py-2 pr-4 font-mono text-slate-500">{{ d.roman }}</td>
                    <td class="py-2 pr-4 font-semibold text-slate-800">{{ d.triad }}</td>
                    <td class="py-2 font-semibold text-slate-800">{{ d.seventh }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class MinorField {
  private readonly key = injectRoot();

  protected readonly versions = computed(() =>
    VERSIONS.map((v) => {
      const notes = Scale.get(`${this.key()} ${v.tonal}`).notes;
      return {
        title: v.title,
        text: v.text,
        notes: notes.join(' - '),
        rows: v.degrees.map(([roman, triad, seventh], i) => ({ roman, triad: notes[i] + triad, seventh: notes[i] + seventh })),
      };
    }),
  );
}
