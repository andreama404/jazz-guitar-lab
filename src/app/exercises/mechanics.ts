import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayButton } from '../shared/play-button';
import { FretboardNeck } from '../fretboard/fretboard-neck';
import { FretboardDot } from '../fretboard/fretboard-diagram';

interface Exercise {
  id: string;
  name: string;
  /** Finger order on each string, as 1-based fingers (1 = index ... 4 = pinky), one finger per fret. */
  order: number[];
  /** Order in which the strings are played (default: 6 to 1). */
  strings?: number[];
  text: string;
}

const EXERCISES: Exercise[] = [
  { id: 'spider-1234', name: 'Spider 1-2-3-4', order: [1, 2, 3, 4], text: 'Quattro dita su quattro tasti consecutivi, una per tasto, poi si cambia corda.' },
  { id: 'spider-4321', name: 'Spider 4-3-2-1', order: [4, 3, 2, 1], text: 'Lo stesso schema al contrario: parte dal mignolo.' },
  { id: 'spider-1324', name: 'Spider 1-3-2-4', order: [1, 3, 2, 4], text: 'Alterna dita lontane e vicine: allena l\'indipendenza di medio e anulare.' },
  { id: 'spider-1243', name: 'Spider 1-2-4-3', order: [1, 2, 4, 3], text: 'Il mignolo anticipa l\'anulare: uno dei punti più difficili.' },
  { id: 'spider-1423', name: 'Spider 1-4-2-3', order: [1, 4, 2, 3], text: 'Salto ampio tra indice e mignolo, poi le dita centrali.' },
  { id: 'spider-2143', name: 'Spider 2-1-4-3', order: [2, 1, 4, 3], text: 'Coppie di dita vicine che si scambiano: indice-medio e anulare-mignolo.' },
  {
    id: 'skip-one',
    name: 'Salto di una corda',
    order: [1, 2, 3, 4],
    strings: [6, 4, 5, 3, 4, 2, 3, 1],
    text: 'Si salta una corda e si torna indietro di una: 6ª-4ª, 5ª-3ª, 4ª-2ª, 3ª-1ª. Allena la precisione del plettro sulle corde non adiacenti.',
  },
  {
    id: 'skip-two',
    name: 'Salto di due corde',
    order: [1, 2, 3, 4],
    strings: [6, 3, 5, 2, 4, 1],
    text: 'Salto più ampio: 6ª-3ª, 5ª-2ª, 4ª-1ª. Il plettro attraversa due corde senza suonarle.',
  },
  {
    id: 'alternate',
    name: 'Corde alterne',
    order: [1, 2, 3, 4],
    strings: [6, 4, 2, 5, 3, 1],
    text: 'Prima le corde a salti di una (6ª-4ª-2ª), poi le altre (5ª-3ª-1ª).',
  },
];

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E']; // strings 1..6
const STRINGS_UP = [6, 5, 4, 3, 2, 1];
const FRETS = Array.from({ length: 12 }, (_, i) => i + 1);

/** Finger-independence exercises ("spiders"): choose the pattern and the fret, see the neck and the tab. */
@Component({
  selector: 'app-mechanics',
  imports: [RouterLink, FretboardNeck, PlayButton],
  template: `
    <p class="mb-4 text-sm text-slate-500">
      Ogni dito sta su un tasto: l'indice sul tasto scelto, poi un tasto per dito. Si esegue lo schema su ogni corda, nell'ordine indicato (di solito dalla 6ª alla 1ª), e si torna indietro suonando
      tutto al contrario. Parti lento, a tempo, con le dita vicine alla tastiera.
    </p>

    <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Esercizio</h2>
    <div class="mb-6 flex flex-wrap gap-2">
      @for (e of exercises; track e.id) {
        <a
          [routerLink]="[]"
          [queryParams]="{ ex: e.id }"
          queryParamsHandling="merge"
          class="rounded-lg px-3 py-2 text-sm font-semibold shadow transition"
          [class.bg-slate-900]="exercise().id === e.id"
          [class.text-white]="exercise().id === e.id"
          [class.bg-white]="exercise().id !== e.id"
          [class.text-slate-700]="exercise().id !== e.id"
        >
          {{ e.name }}
        </a>
      }
    </div>

    <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Tasto di partenza (indice)</h2>
    <div class="mb-6 flex flex-wrap gap-2">
      @for (f of frets; track f) {
        <a
          [routerLink]="[]"
          [queryParams]="{ fret: f }"
          queryParamsHandling="merge"
          class="min-w-10 rounded-lg px-3 py-2 text-center text-sm font-semibold shadow transition"
          [class.bg-slate-900]="fret() === f"
          [class.text-white]="fret() === f"
          [class.bg-white]="fret() !== f"
          [class.text-slate-700]="fret() !== f"
        >
          {{ f }}
        </a>
      }
    </div>

    <div class="rounded-xl bg-white p-4 shadow">
      <h3 class="text-lg font-bold text-slate-800">{{ exercise().name }}</h3>
      <p class="mb-3 text-sm text-slate-500">{{ exercise().text }} Dita: {{ exercise().order.join(' - ') }} sui tasti {{ fret() }}-{{ fret() + 3 }}.</p>
      <div class="mb-3"><app-play-button mode="dots-ordered" [dots]="ordered()" label="Ascolta l'esercizio"></app-play-button></div>
      <app-fretboard-neck [dots]="dots()" [minColumns]="6"></app-fretboard-neck>
      <h4 class="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Tablatura (salita)</h4>
      <pre class="overflow-x-auto rounded-lg bg-slate-50 p-3 font-mono text-sm text-slate-800">{{ tab() }}</pre>
      <p class="mt-2 text-xs text-slate-400">Poi si ripete tutto al contrario. Il numero nel disegno è il dito.</p>
    </div>
  `,
})
export class Mechanics {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly exercises = EXERCISES;
  protected readonly frets = FRETS;

  protected readonly exercise = computed(() => EXERCISES.find((e) => e.id === this.params().get('ex')) ?? EXERCISES[0]);

  protected readonly fret = computed(() => {
    const f = Number(this.params().get('fret'));
    return FRETS.includes(f) ? f : 1;
  });

  /** Notes in playing order: [string, fret, finger]. */
  private readonly notes = computed(() => {
    const start = this.fret();
    return (this.exercise().strings ?? STRINGS_UP).flatMap((string) => this.exercise().order.map((finger) => ({ string, fret: start + finger - 1, finger })));
  });

  protected readonly ordered = computed(() => this.notes().map((n) => ({ string: n.string, fret: n.fret })));

  protected readonly dots = computed<FretboardDot[]>(() => {
    const seen = new Set<string>();
    const dots: FretboardDot[] = [];
    for (const n of this.notes()) {
      const key = `${n.string}-${n.fret}`;
      if (seen.has(key)) continue;
      seen.add(key);
      dots.push({ string: n.string, fret: n.fret, label: String(n.finger), root: false });
    }
    return dots;
  });

  protected readonly tab = computed(() => {
    const notes = this.notes();
    return STRING_NAMES.map((name, i) => {
      const string = i + 1;
      const cells = notes.map((n) => (n.string === string ? String(n.fret) : '').padEnd(3, '-')).join('');
      return `${name}|--${cells}|`;
    }).join('\n');
  });
}
