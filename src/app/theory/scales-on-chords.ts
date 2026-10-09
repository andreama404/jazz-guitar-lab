import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SCALE_TYPES } from '../scales/scale-theory';
import { injectRoot } from './theory-root';

interface Row {
  suffix: string;
  name: string;
  scales: { id: string; hint: string }[];
}

const ROWS: Row[] = [
  { suffix: 'maj7', name: 'Maggiore 7', scales: [{ id: 'major', hint: 'su I grado' }, { id: 'lydian', hint: 'su IV grado, se c\'è la ♯11' }] },
  { suffix: 'm7', name: 'Minore 7', scales: [{ id: 'dorian', hint: 'la scelta classica' }, { id: 'aeolian', hint: 'su VI grado' }, { id: 'phrygian', hint: 'su III grado' }] },
  {
    suffix: '7',
    name: 'Dominante 7',
    scales: [
      { id: 'mixolydian', hint: 'dominante che non risolve' },
      { id: 'lydian-dominant', hint: 'con la ♯11' },
      { id: 'altered', hint: 'dominante che risolve' },
      { id: 'phrygian-dominant', hint: 'V grado in minore (♭9, ♭13)' },
    ],
  },
  { suffix: 'm7b5', name: 'Semidiminuito', scales: [{ id: 'locrian', hint: 'la scala classica' }] },
  { suffix: 'm(maj7)', name: 'Minore con settima maggiore', scales: [{ id: 'melodic-minor', hint: 'minore melodica' }, { id: 'harmonic-minor', hint: 'minore armonica' }] },
];

/** Which scale to play over each chord type, with links to the Scales page. */
@Component({
  selector: 'app-scales-on-chords',
  imports: [RouterLink],
  template: `
    <h2 class="text-xl font-bold text-slate-800">Scale sugli accordi</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      Quale scala usare su ogni tipo di accordo, a partire dalla fondamentale scelta. Clicca una scala per vederne note e diteggiature nella sezione Scale.
    </p>
    <div class="space-y-3">
      @for (r of rows(); track r.suffix) {
        <div class="rounded-lg bg-slate-50 p-4">
          <div class="flex flex-wrap items-baseline gap-x-3">
            <span class="text-lg font-bold text-slate-800">{{ r.chord }}</span>
            <span class="text-sm text-slate-500">{{ r.name }}</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            @for (s of r.scales; track s.id) {
              <a
                [routerLink]="['/scales']"
                [queryParams]="{ root: root(), type: s.id }"
                class="rounded-lg bg-white px-3 py-1.5 text-sm shadow transition hover:bg-slate-900 hover:text-white"
              >
                <span class="font-semibold">{{ s.name }}</span>
                <span class="ml-1 text-xs opacity-70">{{ s.hint }}</span>
              </a>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class ScalesOnChords {
  protected readonly root = injectRoot();

  protected readonly rows = computed(() =>
    ROWS.map((r) => ({
      suffix: r.suffix,
      name: r.name,
      chord: this.root() + r.suffix,
      scales: r.scales.map((s) => ({ ...s, name: SCALE_TYPES.find((t) => t.id === s.id)?.name ?? s.id })),
    })),
  );
}
