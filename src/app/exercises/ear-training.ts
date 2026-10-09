import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Note } from 'tonal';
import { QUADRIAD_TYPES, TRIAD_TYPES, buildChord, findChordType } from '../chords/chord-theory';
import { ROOTS, SCALE_TYPES, buildScale } from '../scales/scale-theory';
import { PlayButton, PlayMode } from '../shared/play-button';

type Kind = 'intervals' | 'chords' | 'scales';

interface Option {
  id: string;
  label: string;
}

interface Question {
  mode: PlayMode;
  notes: string[];
  answerId: string;
  /** What to show after answering. */
  reveal: string;
}

interface KindConfig {
  title: string;
  hint: string;
  mode: PlayMode;
  options: Option[];
  make: (option: Option, root: string) => Omit<Question, 'answerId' | 'mode'>;
}

const INTERVAL_OPTIONS: Option[] = [
  { id: '2m', label: 'Seconda minore' },
  { id: '2M', label: 'Seconda maggiore' },
  { id: '3m', label: 'Terza minore' },
  { id: '3M', label: 'Terza maggiore' },
  { id: '4P', label: 'Quarta giusta' },
  { id: '4A', label: 'Tritono' },
  { id: '5P', label: 'Quinta giusta' },
  { id: '6m', label: 'Sesta minore' },
  { id: '6M', label: 'Sesta maggiore' },
  { id: '7m', label: 'Settima minore' },
  { id: '7M', label: 'Settima maggiore' },
  { id: '8P', label: 'Ottava' },
];

const CHORD_IDS = ['major', 'minor', 'diminished', 'augmented', 'dominant7', 'major7', 'minor7', 'half-diminished'];
const SCALE_IDS = ['major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian', 'harmonic-minor', 'melodic-minor', 'major-pentatonic', 'minor-pentatonic', 'blues'];

const chordOptions = CHORD_IDS.map((id) => {
  const type = findChordType(id, [...TRIAD_TYPES, ...QUADRIAD_TYPES]);
  return { id, label: type ? `${type.name} (${type.symbol})` : id };
});

const scaleOptions = SCALE_IDS.map((id) => ({ id, label: SCALE_TYPES.find((t) => t.id === id)?.name ?? id }));

const KINDS: Record<Kind, KindConfig> = {
  intervals: {
    title: 'Intervalli',
    hint: 'Ascolta le due note (la seconda è più acuta) e riconosci l\'intervallo.',
    mode: 'arpeggio',
    options: INTERVAL_OPTIONS,
    make: (option, root) => {
      const target = Note.transpose(root, option.id);
      return { notes: [root, target], reveal: `${root} → ${target}` };
    },
  },
  chords: {
    title: 'Accordi',
    hint: 'Ascolta l\'accordo e riconosci il tipo.',
    mode: 'chord',
    options: chordOptions,
    make: (option, root) => {
      const type = findChordType(option.id, [...TRIAD_TYPES, ...QUADRIAD_TYPES]);
      if (!type) throw new Error(`Unknown chord ${option.id}`);
      const chord = buildChord(type, root);
      return { notes: chord.notes, reveal: `${chord.name}: ${chord.notes.join(' - ')}` };
    },
  },
  scales: {
    title: 'Scale',
    hint: 'Ascolta la scala (sale e scende) e riconoscila.',
    mode: 'scale',
    options: scaleOptions,
    make: (option, root) => {
      const type = SCALE_TYPES.find((t) => t.id === option.id);
      if (!type) throw new Error(`Unknown scale ${option.id}`);
      const scale = buildScale(type, root);
      return { notes: scale.notes, reveal: `${root} ${type.name}: ${scale.notes.join(' - ')}` };
    },
  },
};

const KIND_IDS = Object.keys(KINDS) as Kind[];

/** Ear training: listen to an interval, chord or scale and pick the right name. */
@Component({
  selector: 'app-ear-training',
  imports: [RouterLink, PlayButton],
  template: `
    <div class="mb-6 flex flex-wrap gap-2">
      @for (k of kindIds; track k) {
        <a
          [routerLink]="[]"
          [queryParams]="{ ear: k }"
          queryParamsHandling="merge"
          class="rounded-lg px-3 py-2 text-sm font-semibold shadow transition"
          [class.bg-slate-900]="kind() === k"
          [class.text-white]="kind() === k"
          [class.bg-white]="kind() !== k"
          [class.text-slate-700]="kind() !== k"
        >
          {{ kinds[k].title }}
        </a>
      }
    </div>

    <p class="mb-4 text-sm text-slate-500">{{ config().hint }}</p>

    @if (question(); as q) {
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <app-play-button [mode]="q.mode" [notes]="q.notes" label="Ascolta"></app-play-button>
        <button type="button" class="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow" (click)="next()">Nuova domanda</button>
        <span class="text-sm text-slate-500">Punteggio: {{ correct() }} / {{ total() }}</span>
      </div>

      <div class="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
        @for (o of config().options; track o.id) {
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-left text-sm font-semibold shadow transition"
            [class.bg-white]="!answered() || (o.id !== q.answerId && o.id !== picked())"
            [class.text-slate-700]="!answered() || (o.id !== q.answerId && o.id !== picked())"
            [class.bg-emerald-600]="answered() && o.id === q.answerId"
            [class.text-white]="answered() && (o.id === q.answerId || o.id === picked())"
            [class.bg-rose-600]="answered() && o.id === picked() && o.id !== q.answerId"
            [disabled]="answered()"
            (click)="answer(o.id)"
          >
            {{ o.label }}
          </button>
        }
      </div>

      @if (answered()) {
        <div class="mt-4 rounded-xl bg-white p-4 shadow">
          <div class="font-semibold" [class.text-emerald-700]="picked() === q.answerId" [class.text-rose-700]="picked() !== q.answerId">
            {{ picked() === q.answerId ? 'Esatto!' : 'Non è questa.' }}
          </div>
          <div class="text-sm text-slate-600">{{ q.reveal }}</div>
          <button type="button" class="mt-3 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white" (click)="next()">Prossima</button>
        </div>
      }
    }
  `,
})
export class EarTraining {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly kinds = KINDS;
  protected readonly kindIds = KIND_IDS;

  protected readonly kind = computed<Kind>(() => {
    const k = this.params().get('ear') as Kind | null;
    return k !== null && KIND_IDS.includes(k) ? k : 'intervals';
  });
  protected readonly config = computed(() => KINDS[this.kind()]);

  protected readonly question = signal<Question | null>(null);
  protected readonly picked = signal<string | null>(null);
  protected readonly answered = computed(() => this.picked() !== null);
  protected readonly correct = signal(0);
  protected readonly total = signal(0);

  constructor() {
    effect(() => {
      this.kind();
      untracked(() => {
        this.correct.set(0);
        this.total.set(0);
        this.next();
      });
    });
  }

  protected next(): void {
    const config = this.config();
    const option = config.options[Math.floor(Math.random() * config.options.length)];
    const root = ROOTS[Math.floor(Math.random() * ROOTS.length)];
    this.picked.set(null);
    this.question.set({ mode: config.mode, answerId: option.id, ...config.make(option, root) });
  }

  protected answer(id: string): void {
    if (this.answered()) return;
    this.picked.set(id);
    this.total.update((n) => n + 1);
    if (id === this.question()?.answerId) this.correct.update((n) => n + 1);
  }
}
