import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Note } from 'tonal';
import { QUADRIAD_TYPES, buildChord, findChordType } from '../chords/chord-theory';
import { FretboardNeck } from '../fretboard/fretboard-neck';
import { ROOTS } from '../scales/scale-theory';
import { RootPicker } from '../shared/root-picker';
import { buildArpeggioPositions } from '../voicings/voicing-generator';

interface Step {
  interval: string;
  type: string;
  roman: string;
}

interface Progression {
  id: string;
  name: string;
  steps: Step[];
}

const PROGRESSIONS: Progression[] = [
  {
    id: 'ii-v-i',
    name: 'II - V - I maggiore',
    steps: [
      { interval: '2M', type: 'minor7', roman: 'IIm7' },
      { interval: '5P', type: 'dominant7', roman: 'V7' },
      { interval: '1P', type: 'major7', roman: 'Imaj7' },
    ],
  },
  {
    id: 'ii-v-i-minor',
    name: 'II - V - I minore',
    steps: [
      { interval: '2M', type: 'half-diminished', roman: 'IIm7♭5' },
      { interval: '5P', type: 'dominant7', roman: 'V7' },
      { interval: '1P', type: 'minor7', roman: 'Im7' },
    ],
  },
  {
    id: 'turnaround',
    name: 'I - VI - II - V',
    steps: [
      { interval: '1P', type: 'major7', roman: 'Imaj7' },
      { interval: '6M', type: 'minor7', roman: 'VIm7' },
      { interval: '2M', type: 'minor7', roman: 'IIm7' },
      { interval: '5P', type: 'dominant7', roman: 'V7' },
    ],
  },
];

/** Start the first arpeggio around this fret; each next one is the closest position on the neck. */
const START_FRET = 5;

/** Play a progression with the arpeggio of every chord, choosing positions that stay close on the neck. */
@Component({
  selector: 'app-arpeggio-progression',
  imports: [RouterLink, RootPicker, FretboardNeck],
  template: `
    <p class="mb-4 text-sm text-slate-500">
      Suona l'arpeggio di ogni accordo nella progressione, restando il più possibile nella stessa zona della tastiera: le posizioni sono scelte in modo da
      spostarsi poco da un accordo al successivo. Il cerchio nero è la tonica.
    </p>

    <app-root-picker class="mb-6 block" label="Tonalità" [root]="root()"></app-root-picker>

    <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Progressione</h2>
    <div class="mb-6 flex flex-wrap gap-2">
      @for (p of progressions; track p.id) {
        <a
          [routerLink]="[]"
          [queryParams]="{ prog: p.id }"
          queryParamsHandling="merge"
          class="rounded-lg px-3 py-2 text-sm font-semibold shadow transition"
          [class.bg-slate-900]="progression().id === p.id"
          [class.text-white]="progression().id === p.id"
          [class.bg-white]="progression().id !== p.id"
          [class.text-slate-700]="progression().id !== p.id"
        >
          {{ p.name }}
        </a>
      }
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      @for (c of chords(); track $index) {
        <div class="rounded-xl bg-white p-3 shadow">
          <div class="mb-1 flex items-baseline gap-3">
            <span class="text-lg font-bold text-slate-800">{{ c.name }}</span>
            <span class="text-xs text-slate-400">{{ c.roman }}</span>
          </div>
          <div class="text-sm text-slate-600">{{ c.notes }}</div>
          <div class="mb-2 text-xs text-slate-500">
            {{ c.position }} · {{ c.description }}
            @if (c.move !== null) {
              · spostamento dal precedente: {{ c.move }} {{ c.move === 1 ? 'tasto' : 'tasti' }}
            }
          </div>
          <app-fretboard-neck [dots]="c.dots" [minColumns]="6" [maxWidth]="340" [rootDark]="true"></app-fretboard-neck>
        </div>
      }
    </div>
  `,
})
export class ArpeggioProgression {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly progressions = PROGRESSIONS;

  protected readonly root = computed(() => {
    const root = this.params().get('root');
    return root !== null && ROOTS.includes(root) ? root : ROOTS[0];
  });

  protected readonly progression = computed(() => PROGRESSIONS.find((p) => p.id === this.params().get('prog')) ?? PROGRESSIONS[0]);

  protected readonly chords = computed(() => {
    const root = this.root();
    let previous = START_FRET;
    let first = true;
    return this.progression().steps.map((step) => {
      const type = findChordType(step.type, QUADRIAD_TYPES);
      if (!type) throw new Error(`Unknown chord type ${step.type}`);
      const chordRoot = Note.simplify(Note.transpose(root, step.interval));
      const chord = buildChord(type, chordRoot);
      const positions = buildArpeggioPositions(chord, chord.notes)[0].voicings;
      const center = (dots: { fret: number }[]) => dots.reduce((sum, d) => sum + d.fret, 0) / dots.length;
      // closest position to where the previous arpeggio ended
      const best = positions.reduce((a, b) => (Math.abs(center(b.dots) - previous) < Math.abs(center(a.dots) - previous) ? b : a));
      const move = first ? null : Math.round(Math.abs(center(best.dots) - previous));
      previous = center(best.dots);
      first = false;
      return {
        name: chord.name,
        roman: step.roman,
        notes: chord.notes.join(' - '),
        position: best.name,
        description: best.description,
        dots: best.dots,
        move,
      };
    });
  });
}
