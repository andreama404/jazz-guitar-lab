import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { buildScale, findScaleType } from '../scales/scale-theory';
import { PlayButton } from '../shared/play-button';

type Mark = 'ok' | 'warn' | 'no';

interface BarScale {
  /** Scale root and type (an id of SCALE_TYPES). */
  root: string;
  type: string;
  mark: Mark;
  /** What to know about this scale on this chord. */
  note?: string;
}

export interface BluesExercise {
  id: string;
  title: string;
  intro: string[];
  /** One entry per bar of the 12-bar form. */
  bars: BarScale[];
}

/** Standard 12-bar blues in A. */
const CHORDS = ['A7', 'A7', 'A7', 'A7', 'D7', 'D7', 'A7', 'A7', 'E7', 'D7', 'A7', 'E7'];

const forChord = (f: (chord: string, bar: number) => BarScale): BarScale[] => CHORDS.map((c, i) => f(c, i));
const ROOT_OF: Record<string, string> = { A7: 'A', D7: 'D', E7: 'E' };

export const BLUES_EXERCISES: BluesExercise[] = [
  {
    id: 'major-pent-per-chord',
    title: 'Pentatonica maggiore su ogni accordo',
    intro: [
      'Su ogni battuta si usa la pentatonica maggiore (1 2 3 5 6) dell\'accordo: La maggiore su A7, Re maggiore su D7, Mi maggiore su E7. Si cambia scala insieme all\'accordo.',
      'La terza dell\'accordo (Do♯, Fa♯, Sol♯) è sempre dentro la scala, quindi niente urta con l\'armonia. Manca la settima minore: il suono è più dolce e "country" del blues scuro.',
    ],
    bars: forChord((c) => ({ root: ROOT_OF[c], type: 'major-pentatonic', mark: 'ok' })),
  },
  {
    id: 'a-major-pent-whole',
    title: 'Dove usare la pentatonica maggiore di La',
    intro: [
      'Qui la scala è una sola, La maggiore pentatonica (La Si Do♯ Mi Fa♯), su tutto il giro. Ogni battuta dice se funziona.',
      'Su A7 è la scala giusta: il Do♯ è la terza dell\'accordo. Su E7 funziona: il La è solo una tensione di passaggio (quarta di Mi). Su D7 no: il Do♯ urta con la settima dell\'accordo (Do♮), e conviene passare alla Re maggiore pentatonica o alla La minore pentatonica.',
    ],
    bars: forChord((c) =>
      c === 'A7'
        ? { root: 'A', type: 'major-pentatonic', mark: 'ok', note: 'Do♯ è la terza' }
        : c === 'E7'
          ? { root: 'A', type: 'major-pentatonic', mark: 'warn', note: 'La = quarta, solo di passaggio' }
          : { root: 'A', type: 'major-pentatonic', mark: 'no', note: 'Do♯ urta con Do♮ (7ª): meglio Re maggiore pent.' },
    ),
  },
  {
    id: 'a-minor-pent-whole',
    title: 'La minore pentatonica su tutto il giro',
    intro: [
      'La minore pentatonica (La Do Re Mi Sol) è la scala classica del blues e si usa su tutti gli accordi del giro, senza cambiarla.',
      'Il Do (♭3) contro il Do♯ di A7 è la tensione tipica del blues, la "blue third". Su D7 il Do è la settima dell\'accordo e il Sol la quarta: suona molto stabile. Su E7 il Sol urta con il Sol♯ (terza di Mi): è accettato nel blues, ma conviene appoggiarsi su La e Mi.',
      'Il blues scuro usa la minore pentatonica; quello dolce la maggiore. Mescolarle, per esempio maggiore su A7 e minore su D7 ed E7, è il suono del blues.',
    ],
    bars: forChord((c) =>
      c === 'E7'
        ? { root: 'A', type: 'minor-pentatonic', mark: 'warn', note: 'Sol urta con Sol♯ (3ª): appoggiati su La e Mi' }
        : c === 'D7'
          ? { root: 'A', type: 'minor-pentatonic', mark: 'ok', note: 'Do è la 7ª, Sol la 4ª' }
          : { root: 'A', type: 'minor-pentatonic', mark: 'ok', note: 'Do contro Do♯: la blue third' },
    ),
  },
];

const MARKS: Record<Mark, { symbol: string; label: string; cls: string }> = {
  ok: { symbol: '✔', label: 'Funziona', cls: 'text-emerald-700' },
  warn: { symbol: '△', label: 'Con attenzione', cls: 'text-amber-700' },
  no: { symbol: '✘', label: 'Evita', cls: 'text-rose-700' },
};

/** Twelve-bar blues in A: which pentatonic scale to use on each bar, with a verdict per bar where the scale is the same throughout. */
@Component({
  selector: 'app-blues-exercises',
  imports: [NgClass, RouterLink, PlayButton],
  template: `
    <p class="mb-4 text-sm text-slate-500">
      Il blues di 12 battute in La, con la pentatonica indicata su ogni battuta. Solo armonia: ascolta il giro e scegli le note sulle scale indicate.
    </p>

    <div class="mb-6 rounded-xl bg-white p-4 shadow">
      <h3 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Regola generale</h3>
      <p class="mb-3 text-sm text-slate-600">
        Nel blues tutti gli accordi sono dominanti (7). Su un dominante puoi sempre usare la pentatonica <strong>maggiore</strong> o <strong>minore</strong> della sua
        fondamentale. La maggiore contiene la terza dell'accordo ed è dolce; la minore contiene la settima e suona "scura": il suo ♭3 contro la terza maggiore
        dell'accordo è la <em>blue third</em>, la tensione tipica del blues.
      </p>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th class="py-2 pr-4">Grado</th>
              <th class="py-2 pr-4">Pentatonica maggiore</th>
              <th class="py-2">Pentatonica minore</th>
            </tr>
          </thead>
          <tbody class="text-slate-600">
            <tr class="border-b border-slate-100 align-top">
              <td class="py-2 pr-4 font-semibold text-slate-800">I7 <span class="font-normal text-slate-400">(A7)</span></td>
              <td class="py-2 pr-4">✔ Maggiore del I (La). Resta sulla tonica: è la scelta più semplice e dolce.</td>
              <td class="py-2">✔ Minore del I (La): la scala classica, con la blue third.</td>
            </tr>
            <tr class="border-b border-slate-100 align-top">
              <td class="py-2 pr-4 font-semibold text-slate-800">IV7 <span class="font-normal text-slate-400">(D7)</span></td>
              <td class="py-2 pr-4">✔ Maggiore del IV (Re). ✘ Non quella del I: il Do♯ urta con la settima Do♮.</td>
              <td class="py-2">✔ Minore del I (La): contiene la settima e la quarta. ✔ Minore del IV (Re).</td>
            </tr>
            <tr class="align-top">
              <td class="py-2 pr-4 font-semibold text-slate-800">V7 <span class="font-normal text-slate-400">(E7)</span></td>
              <td class="py-2 pr-4">✔ Maggiore del V (Mi). △ Quella del I funziona, con il La come nota di passaggio.</td>
              <td class="py-2">✔ Minore del V (Mi). △ Minore del I (La): il Sol urta con il Sol♯, appoggiati su La e Mi.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-sm text-slate-600">
        <strong>In pratica:</strong> con una sola scala su tutto il giro la più sicura è la minore del I, perché funziona su tutti e tre i gradi. La maggiore del I
        funziona sul I e, con attenzione, sul V, ma non sul IV: lì si cambia scala. Mescolare maggiore e minore sullo stesso accordo è il suono del blues.
      </p>
    </div>

    <div class="mb-6 flex flex-wrap gap-2">
      @for (e of exercises; track e.id) {
        <a
          [routerLink]="[]"
          [queryParams]="{ bex: e.id }"
          queryParamsHandling="merge"
          class="rounded-lg px-3 py-2 text-sm font-semibold shadow transition"
          [class.bg-slate-900]="exercise().id === e.id"
          [class.text-white]="exercise().id === e.id"
          [class.bg-white]="exercise().id !== e.id"
          [class.text-slate-700]="exercise().id !== e.id"
        >
          {{ e.title }}
        </a>
      }
    </div>

    <div class="mb-4 flex flex-wrap items-center gap-3">
      <h2 class="text-lg font-bold text-slate-800">{{ exercise().title }}</h2>
      <app-play-button mode="progression" [names]="chordNames" label="Ascolta il giro"></app-play-button>
    </div>

    <div class="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
      @for (b of bars(); track $index) {
        <div class="rounded-xl bg-white p-3 shadow">
          <div class="flex items-baseline justify-between gap-2">
            <span class="text-xl font-bold text-slate-800">{{ b.chord }}</span>
            <span class="text-xs text-slate-400">battuta {{ $index + 1 }}</span>
          </div>
          <div class="mt-2 text-xs uppercase tracking-wide text-slate-400">Scala</div>
          <a [routerLink]="['/scales']" [queryParams]="{ root: b.root, type: b.type }" class="text-sm font-semibold text-slate-700 hover:underline">
            {{ b.root }} {{ b.typeName }}
          </a>
          <div class="mt-1 text-xs font-semibold" [ngClass]="b.mark.cls">{{ b.mark.symbol }} {{ b.mark.label }}</div>
          @if (b.note) {
            <div class="mt-0.5 text-xs text-slate-500">{{ b.note }}</div>
          }
        </div>
      }
    </div>

    <div class="mb-4 rounded-xl bg-white p-4 shadow">
      <h3 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Scale usate</h3>
      <ul class="space-y-1 text-sm text-slate-600">
        @for (s of scales(); track s.key) {
          <li>
            <span class="font-semibold text-slate-800">{{ s.root }} {{ s.name }}</span>
            <span class="ml-2">{{ s.notes }}</span>
          </li>
        }
      </ul>
    </div>

    <div class="rounded-xl bg-white p-4 shadow">
      <h3 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Come funziona</h3>
      @for (t of exercise().intro; track $index) {
        <p class="mb-2 text-sm text-slate-600 last:mb-0">{{ t }}</p>
      }
    </div>
  `,
})
export class BluesExercises {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly exercises = BLUES_EXERCISES;
  protected readonly chordNames = CHORDS;
  protected readonly exercise = computed(() => BLUES_EXERCISES.find((e) => e.id === this.params().get('bex')) ?? BLUES_EXERCISES[0]);

  protected readonly bars = computed(() =>
    this.exercise().bars.map((b, i) => ({
      chord: CHORDS[i],
      root: b.root,
      type: b.type,
      typeName: findScaleType(b.type)?.name ?? b.type,
      mark: MARKS[b.mark],
      note: b.note,
    })),
  );

  /** The distinct scales of the exercise, with their notes. */
  protected readonly scales = computed(() => {
    const seen = new Map<string, { key: string; root: string; name: string; notes: string }>();
    for (const b of this.exercise().bars) {
      const key = `${b.root}-${b.type}`;
      const type = findScaleType(b.type);
      if (type && !seen.has(key)) seen.set(key, { key, root: b.root, name: type.name, notes: buildScale(type, b.root).notes.join(' ') });
    }
    return [...seen.values()];
  });
}
