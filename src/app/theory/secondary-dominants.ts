import { Component, computed } from '@angular/core';
import { Chord, Note, Scale } from 'tonal';
import { injectRoot } from './theory-root';

const TARGETS = [
  { degree: 'II', interval: '2M', suffix: 'm7' },
  { degree: 'III', interval: '3M', suffix: 'm7' },
  { degree: 'IV', interval: '4P', suffix: 'maj7' },
  { degree: 'V', interval: '5P', suffix: '7' },
  { degree: 'VI', interval: '6M', suffix: 'm7' },
];

/** V7 of each degree of the major key: a dominant that resolves to a degree other than I. */
@Component({
  selector: 'app-secondary-dominants',
  template: `
    <h2 class="text-xl font-bold text-slate-800">Dominanti secondarie</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      Un accordo di settima di dominante costruito una quinta sopra un grado diverso dal primo, come se quel grado fosse una tonica temporanea (V7/II, V7/III...).
      Introduce una nota estranea alla tonalità: qui evidenziata. Prima della dominante si può aggiungere il suo II per ottenere un II-V secondario.
    </p>
    <div class="space-y-3">
      @for (r of rows(); track r.degree) {
        <div class="rounded-lg bg-slate-50 p-4">
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">V7/{{ r.degree }}</div>
          <div class="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span class="rounded-lg bg-slate-900 px-3 py-1.5 font-semibold text-white">{{ r.dominant }}</span>
            <span class="text-slate-400">→</span>
            <span class="rounded-lg bg-white px-3 py-1.5 font-semibold text-slate-700 shadow">{{ r.target }}</span>
            <span class="ml-2 text-slate-500">con II-V: {{ r.ii }} → {{ r.dominant }} → {{ r.target }}</span>
          </div>
          <div class="mt-1 text-sm text-slate-600">
            Note di {{ r.dominant }}:
            @for (n of r.notes; track n.name) {
              <span class="mr-1" [class.font-bold]="n.foreign" [class.text-slate-900]="n.foreign">{{ n.name }}</span>
            }
            <span class="text-xs text-slate-400">(in grassetto: fuori tonalità)</span>
          </div>
        </div>
      }
    </div>
  `,
})
export class SecondaryDominants {
  private readonly key = injectRoot();

  protected readonly rows = computed(() => {
    const key = this.key();
    const diatonic = new Set(Scale.get(`${key} major`).notes.map((n) => Note.chroma(n)));
    return TARGETS.map((t) => {
      const target = Note.simplify(Note.transpose(key, t.interval));
      const dominantRoot = Note.simplify(Note.transpose(target, '5P'));
      const iiRoot = Note.simplify(Note.transpose(target, '2M'));
      return {
        degree: t.degree,
        dominant: `${dominantRoot}7`,
        target: target + t.suffix,
        ii: `${iiRoot}m7`,
        notes: Chord.getChord('7', dominantRoot).notes.map((n) => ({ name: n, foreign: !diatonic.has(Note.chroma(n)) })),
      };
    });
  });
}
