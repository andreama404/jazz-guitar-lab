import { Component, computed } from '@angular/core';
import { Scale } from 'tonal';
import { injectRoot } from './theory-root';

const DEGREES = [
  { roman: 'I', triad: '', seventh: 'maj7', function: 'Tonica' },
  { roman: 'II', triad: 'm', seventh: 'm7', function: 'Sottodominante' },
  { roman: 'III', triad: 'm', seventh: 'm7', function: 'Tonica (debole)' },
  { roman: 'IV', triad: '', seventh: 'maj7', function: 'Sottodominante' },
  { roman: 'V', triad: '', seventh: '7', function: 'Dominante' },
  { roman: 'VI', triad: 'm', seventh: 'm7', function: 'Tonica (debole)' },
  { roman: 'VII', triad: 'dim', seventh: 'm7♭5', function: 'Dominante (senza fondamentale)' },
];

/** The chords built on each degree of the major scale. */
@Component({
  selector: 'app-harmonic-field',
  template: `
    <h2 class="text-xl font-bold text-slate-800">Campo armonico maggiore</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      Gli accordi che si ottengono sovrapponendo terze alle note della scala maggiore, con la loro funzione: tonica (stabilità), sottodominante (movimento),
      dominante (tensione che vuole risolvere).
    </p>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th class="py-2 pr-4">Grado</th>
            <th class="py-2 pr-4">Triade</th>
            <th class="py-2 pr-4">Quadriade</th>
            <th class="py-2">Funzione</th>
          </tr>
        </thead>
        <tbody>
          @for (d of rows(); track d.roman) {
            <tr class="border-b border-slate-100">
              <td class="py-2 pr-4 font-mono text-slate-500">{{ d.roman }}</td>
              <td class="py-2 pr-4 font-semibold text-slate-800">{{ d.triad }}</td>
              <td class="py-2 pr-4 font-semibold text-slate-800">{{ d.seventh }}</td>
              <td class="py-2 text-slate-600">{{ d.function }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class HarmonicField {
  private readonly key = injectRoot();

  protected readonly rows = computed(() => {
    const notes = Scale.get(`${this.key()} major`).notes;
    return DEGREES.map((d, i) => ({
      ...d,
      triad: notes[i] + d.triad,
      seventh: notes[i] + d.seventh,
    }));
  });
}
