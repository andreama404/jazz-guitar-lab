import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Chord, Note } from 'tonal';
import { buildScale, findScaleType } from '../scales/scale-theory';
import { PlayButton } from '../shared/play-button';

type Mark = 'ok' | 'warn' | 'no';

interface BarPart {
  chord: string;
  /** Scale root and type (an id of SCALE_TYPES); missing when no pentatonic fits. */
  root?: string;
  type?: string;
  mark: Mark;
  /** What to know about this scale on this chord. */
  note?: string;
}

export interface BluesExercise {
  id: string;
  title: string;
  intro: string[];
  /** One entry per bar of the 12-bar form; a bar holds one or two chords. */
  bars: BarPart[][];
}

export interface BluesKey {
  id: string;
  name: string;
}

export const BLUES_KEYS: BluesKey[] = [
  { id: 'A', name: 'La' },
  { id: 'Bb', name: 'Si♭' },
];

const ITALIAN: Record<string, string> = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };

/** "Eb" -> "Mi♭", "F#" -> "Fa♯". */
function n(note: string): string {
  return (ITALIAN[note[0]] ?? note[0]) + note.slice(1).replaceAll('b', '♭').replaceAll('#', '♯');
}

const up = (note: string, interval: string): string => Note.simplify(Note.transpose(note, interval));

/** The notes and chords of a 12-bar blues in one key, named by their role. */
function theory(key: string) {
  const I = key;
  const IV = up(I, '4P');
  const V = up(I, '5P');
  const bVI = up(I, '6m');
  return {
    I,
    IV,
    V,
    bVI,
    maj3I: up(I, '3M'),
    min3I: up(I, '3m'),
    b7I: up(I, '7m'),
    p5I: up(I, '5P'),
    maj3IV: up(IV, '3M'),
    b7IV: up(IV, '7m'),
    maj3V: up(V, '3M'),
    b7bVI: Note.transpose(bVI, '7m'),
    standard: [I, I, I, I, IV, IV, I, I, V, IV, I, V].map((r) => `${r}7`),
    quickChange: [I, IV, I, I, IV, IV, I, I, V, IV, I, V].map((r) => `${r}7`),
    jazz: [[I, '7'], [IV, '7'], [I, '7'], [V, 'm7', I, '7'], [IV, '7'], [up(IV, '1A'), 'dim7'], [I, '7'], [up(I, '3M'), 'm7', up(I, '6M'), '7'], [up(I, '2M'), 'm7'], [V, '7'], [I, '7', up(I, '6M'), '7'], [up(I, '2M'), 'm7', V, '7']].map((bar) =>
      bar.reduce<string[]>((chords, x, i) => (i % 2 === 0 ? [...chords, x + bar[i + 1]] : chords), []),
    ),
    minor: [`${I}m7`, `${I}m7`, `${I}m7`, `${I}m7`, `${IV}m7`, `${IV}m7`, `${I}m7`, `${I}m7`, `${bVI}7`, `${V}7`, `${I}m7`, `${V}7`],
  };
}

const forChord = (chords: string[], f: (chord: string, bar: number) => Omit<BarPart, 'chord'>): BarPart[][] => chords.map((c, i) => [{ chord: c, ...f(c, i) }]);
/** "Dm7" -> "D", "Bb7" -> "Bb". */
const rootOf = (chord: string): string => chord.replace(/(dim|m)?7$/, '');

/** The blues exercises in a key. */
export function bluesExercises(key: string): BluesExercise[] {
  const t = theory(key);
  const maj = 'major-pentatonic';
  const min = 'minor-pentatonic';
  const [chordI, chordIV, chordV] = [`${t.I}7`, `${t.IV}7`, `${t.V}7`];
  const blueNote = buildScale(findScaleType('blues')!, t.I).notes[3];

  return [
    {
      id: 'major-pent-per-chord',
      title: 'Pentatonica maggiore su ogni accordo',
      intro: [
        `Su ogni battuta si usa la pentatonica maggiore (1 2 3 5 6) dell'accordo: ${n(t.I)} maggiore su ${chordI}, ${n(t.IV)} su ${chordIV}, ${n(t.V)} su ${chordV}. Si cambia scala insieme all'accordo.`,
        `La terza dell'accordo (${n(t.maj3I)}, ${n(t.maj3IV)}, ${n(t.maj3V)}) è sempre dentro la scala, quindi niente urta con l'armonia. Manca la settima minore: il suono è più dolce e "country" del blues scuro.`,
      ],
      bars: forChord(t.standard, (c) => ({ root: rootOf(c), type: maj, mark: 'ok' })),
    },
    {
      id: 'a-major-pent-whole',
      title: `Dove usare la pentatonica maggiore di ${n(t.I)}`,
      intro: [
        `Qui la scala è una sola, ${n(t.I)} maggiore pentatonica, su tutto il giro. Ogni battuta dice se funziona.`,
        `Su ${chordI} è la scala giusta: ${n(t.maj3I)} è la terza dell'accordo. Su ${chordV} funziona: ${n(t.I)} è solo una tensione di passaggio (quarta di ${n(t.V)}). Su ${chordIV} no: ${n(t.maj3I)} urta con la settima dell'accordo (${n(t.b7IV)}), e conviene passare alla ${n(t.IV)} maggiore pentatonica o alla ${n(t.I)} minore pentatonica.`,
      ],
      bars: forChord(t.standard, (c) =>
        c === chordI
          ? { root: t.I, type: maj, mark: 'ok', note: `${n(t.maj3I)} è la terza` }
          : c === chordV
            ? { root: t.I, type: maj, mark: 'warn', note: `${n(t.I)} = quarta, solo di passaggio` }
            : { root: t.I, type: maj, mark: 'no', note: `${n(t.maj3I)} urta con ${n(t.b7IV)} (7ª): meglio ${n(t.IV)} maggiore pent.` },
      ),
    },
    {
      id: 'a-minor-pent-whole',
      title: `${n(t.I)} minore pentatonica su tutto il giro`,
      intro: [
        `La minore pentatonica di ${n(t.I)} è la scala classica del blues e si usa su tutti gli accordi del giro, senza cambiarla.`,
        `Il ${n(t.min3I)} (♭3) contro il ${n(t.maj3I)} di ${chordI} è la tensione tipica del blues, la "blue third". Su ${chordIV} il ${n(t.min3I)} è la settima dell'accordo e il ${n(t.b7I)} la quarta: suona molto stabile. Su ${chordV} il ${n(t.b7I)} urta con il ${n(t.maj3V)} (terza di ${n(t.V)}): è accettato nel blues, ma conviene appoggiarsi su ${n(t.I)} e ${n(t.V)}.`,
        'Il blues scuro usa la minore pentatonica; quello dolce la maggiore. Mescolarle, per esempio maggiore sul I e minore sul IV e sul V, è il suono del blues.',
      ],
      bars: forChord(t.standard, (c) =>
        c === chordV
          ? { root: t.I, type: min, mark: 'warn', note: `${n(t.b7I)} urta con ${n(t.maj3V)} (3ª): appoggiati su ${n(t.I)} e ${n(t.V)}` }
          : c === chordIV
            ? { root: t.I, type: min, mark: 'ok', note: `${n(t.min3I)} è la 7ª, ${n(t.b7I)} la 4ª` }
            : { root: t.I, type: min, mark: 'ok', note: `${n(t.min3I)} contro ${n(t.maj3I)}: la blue third` },
      ),
    },
    {
      id: 'blues-scale',
      title: `${n(t.I)} blues scale`,
      intro: [
        `La blues scale è la minore pentatonica di ${n(t.I)} con in più la ♭5, il ${n(blueNote)}: la "blue note". Su tutto il giro valgono le stesse indicazioni della minore pentatonica.`,
        `Il ${n(blueNote)} è una nota di passaggio: si usa per muoversi tra ${n(t.IV)} e ${n(t.V)} (o tra ${n(t.V)} e ${n(t.IV)}) e non ci si ferma. Su ${chordV} il ${n(t.b7I)} urta con il ${n(t.maj3V)} come nella minore pentatonica; la blue note aggiunge un'altra tensione, quindi appoggiati su ${n(t.I)} e ${n(t.V)}.`,
      ],
      bars: forChord(t.standard, (c) =>
        c === chordV
          ? { root: t.I, type: 'blues', mark: 'warn', note: `${n(t.b7I)} urta con ${n(t.maj3V)}: appoggiati su ${n(t.I)} e ${n(t.V)}` }
          : { root: t.I, type: 'blues', mark: 'ok', note: `${n(blueNote)} di passaggio tra ${n(t.IV)} e ${n(t.V)}` },
      ),
    },
    {
      id: 'mix-quick-change',
      title: 'Maggiore e minore insieme (quick change)',
      intro: [
        `Il giro con il "quick change": il IV grado (${chordIV}) arriva già alla battuta 2, la forma più diffusa del blues. Si alternano le due pentatoniche.`,
        `Sul I si usa la maggiore di ${n(t.I)} (dolce); sul IV la minore di ${n(t.I)}, che dà la settima (${n(t.min3I)}) e la quarta (${n(t.b7I)}) di ${chordIV}; sul V la maggiore di ${n(t.V)}. Il contrasto tra dolce e scuro è proprio il suono del blues.`,
      ],
      bars: forChord(t.quickChange, (c) =>
        c === chordI
          ? { root: t.I, type: maj, mark: 'ok', note: `${n(t.maj3I)} è la terza` }
          : c === chordIV
            ? { root: t.I, type: min, mark: 'ok', note: `${n(t.min3I)} è la 7ª, ${n(t.b7I)} la 4ª` }
            : { root: t.V, type: maj, mark: 'ok', note: `${n(t.maj3V)} è la terza` },
      ),
    },
    {
      id: 'minor-blues',
      title: `Blues minore in ${n(t.I)}`,
      intro: [
        `Il blues minore ha gli accordi minori sul I e sul IV (${t.I}m7, ${t.IV}m7); le ultime battute usano ${t.bVI}7 e ${t.V}7. La minore pentatonica di ${n(t.I)} è la scala di tutto il giro.`,
        `La pentatonica maggiore di ${n(t.I)} non funziona sugli accordi minori: il ${n(t.maj3I)} urta con il ${n(t.min3I)}, la terza minore. Su ${t.bVI}7 il ${n(t.p5I)} urta con il ${n(t.b7bVI)} (settima dell'accordo); su ${t.V}7 il ${n(t.b7I)} urta con il ${n(t.maj3V)}: in entrambi i casi appoggiati su note stabili come ${n(t.I)}.`,
      ],
      bars: forChord(t.minor, (c) =>
        c === `${t.bVI}7`
          ? { root: t.I, type: min, mark: 'warn', note: `${n(t.p5I)} urta con ${n(t.b7bVI)} (7ª di ${n(t.bVI)}): appoggiati su ${n(t.I)} e ${n(t.min3I)}` }
          : c === `${t.V}7`
            ? { root: t.I, type: min, mark: 'warn', note: `${n(t.b7I)} urta con ${n(t.maj3V)} (3ª): appoggiati su ${n(t.I)} e ${n(t.V)}` }
            : { root: t.I, type: min, mark: 'ok', note: c === `${t.IV}m7` ? `${n(t.I)} = 5ª, ${n(t.min3I)} = 7ª, ${n(t.p5I)} = 9ª` : 'Tonica minore: scala di casa' },
      ),
    },
    {
      id: 'jazz-blues',
      title: 'Blues jazz',
      intro: [
        `Il blues jazz ha lo stesso giro di 12 battute ma con II-V e un diminuito di passaggio: ${t.jazz.map((b) => b.join(' ')).join(' | ')}.`,
        'Su ogni accordo si usa la pentatonica della sua fondamentale: minore sugli accordi m7 (contiene ♭3 e ♭7, le note dell\'accordo), maggiore sui dominanti 7 (la terza è dentro la scala; in alternativa la minore, per la blue third). Quando una battuta ha due accordi si cambia scala a metà battuta.',
        'Sul diminuito di passaggio nessuna pentatonica funziona: usa le note dell\'accordo e risolvi sull\'accordo successivo.',
      ],
      bars: t.jazz.map((bar) =>
        bar.map((chord): BarPart => {
          const root = rootOf(chord).replace(/dim$/, '');
          if (chord.endsWith('dim7')) {
            return { chord, mark: 'no', note: `Nessuna pentatonica: usa le note dell'accordo (${Chord.get(chord).notes.map(n).join(' ')})` };
          }
          return chord.endsWith('m7')
            ? { chord, root, type: min, mark: 'ok', note: '♭3 e ♭7 sono nell\'accordo' }
            : { chord, root, type: maj, mark: 'ok', note: chord === `${up(t.I, '6M')}7` ? 'Dominante del II: porta la tensione' : 'La terza è dentro la scala' };
        }),
      ),
    },
  ];
}

const MARKS: Record<Mark, { symbol: string; label: string; cls: string }> = {
  ok: { symbol: '✔', label: 'Funziona', cls: 'text-emerald-700' },
  warn: { symbol: '△', label: 'Con attenzione', cls: 'text-amber-700' },
  no: { symbol: '✘', label: 'Evita', cls: 'text-rose-700' },
};

/** Twelve-bar blues: which pentatonic scale to use on each bar, with a verdict per bar where the scale is the same throughout. */
@Component({
  selector: 'app-blues-exercises',
  imports: [NgClass, RouterLink, PlayButton],
  template: `
    <p class="mb-4 text-sm text-slate-500">
      Il blues di 12 battute, con la pentatonica indicata su ogni battuta. Solo armonia: ascolta il giro e scegli le note sulle scale indicate.
    </p>

    <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Tonalità</h2>
    <div class="mb-4 flex flex-wrap gap-2">
      @for (k of keys; track k.id) {
        <a
          [routerLink]="[]"
          [queryParams]="{ bkey: k.id }"
          queryParamsHandling="merge"
          class="rounded-lg px-3 py-2 text-sm font-semibold shadow transition"
          [class.bg-slate-900]="key().id === k.id"
          [class.text-white]="key().id === k.id"
          [class.bg-white]="key().id !== k.id"
          [class.text-slate-700]="key().id !== k.id"
        >
          {{ k.name }}
        </a>
      }
    </div>

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
              <td class="py-2 pr-4 font-semibold text-slate-800">I7 <span class="font-normal text-slate-400">({{ rule().I }}7)</span></td>
              <td class="py-2 pr-4">✔ Maggiore del I ({{ rule().nI }}). Resta sulla tonica: è la scelta più semplice e dolce.</td>
              <td class="py-2">✔ Minore del I ({{ rule().nI }}): la scala classica, con la blue third.</td>
            </tr>
            <tr class="border-b border-slate-100 align-top">
              <td class="py-2 pr-4 font-semibold text-slate-800">IV7 <span class="font-normal text-slate-400">({{ rule().IV }}7)</span></td>
              <td class="py-2 pr-4">
                ✔ Maggiore del IV ({{ rule().nIV }}). ✘ Non quella del I: il {{ rule().maj3I }} urta con la settima {{ rule().b7IV }}.
              </td>
              <td class="py-2">✔ Minore del I ({{ rule().nI }}): contiene la settima e la quarta. ✔ Minore del IV ({{ rule().nIV }}).</td>
            </tr>
            <tr class="align-top">
              <td class="py-2 pr-4 font-semibold text-slate-800">V7 <span class="font-normal text-slate-400">({{ rule().V }}7)</span></td>
              <td class="py-2 pr-4">
                ✔ Maggiore del V ({{ rule().nV }}). △ Quella del I funziona, con il {{ rule().nI }} come nota di passaggio.
              </td>
              <td class="py-2">
                ✔ Minore del V ({{ rule().nV }}). △ Minore del I ({{ rule().nI }}): il {{ rule().b7I }} urta con il {{ rule().maj3V }}, appoggiati su {{ rule().nI }} e
                {{ rule().nV }}.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-sm text-slate-600">
        <strong>In pratica:</strong> con una sola scala su tutto il giro la più sicura è la minore del I, perché funziona su tutti e tre i gradi. La maggiore del I
        funziona sul I e, con attenzione, sul V, ma non sul IV: lì si cambia scala. Mescolare maggiore e minore sullo stesso accordo è il suono del blues.
      </p>
      <p class="mt-2 text-sm text-slate-600">
        <strong>Turnaround (battute 11-12):</strong> l'ultimo {{ rule().V }}7 è il V che riporta al I. Usa la pentatonica di {{ rule().nV }}, maggiore o minore, e
        appoggiati sulle note stabili dell'accordo, {{ rule().nV }} (fondamentale) e {{ rule().p5V }} (quinta), per ripartire dal {{ rule().nI }}.
      </p>
    </div>

    <div class="mb-6 flex flex-wrap gap-2">
      @for (e of exercises(); track e.id) {
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
      <app-play-button mode="progression" [names]="chordNames()" label="Ascolta il giro"></app-play-button>
    </div>

    <div class="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
      @for (b of bars(); track $index) {
        <div class="rounded-xl bg-white p-3 shadow">
          <div class="mb-1 text-xs text-slate-400">battuta {{ $index + 1 }}</div>
          @for (p of b; track $index) {
            <div [class.mt-2]="!$first" [class.border-t]="!$first" [class.pt-2]="!$first" class="border-slate-100">
              <div class="text-xl font-bold text-slate-800">{{ p.chord }}</div>
              @if (p.type) {
                <div class="mt-1 text-xs uppercase tracking-wide text-slate-400">Scala</div>
                <a [routerLink]="['/scales']" [queryParams]="{ root: p.root, type: p.type }" class="text-sm font-semibold text-slate-700 hover:underline">
                  {{ p.root }} {{ p.typeName }}
                </a>
              }
              <div class="mt-1 text-xs font-semibold" [ngClass]="p.mark.cls">{{ p.mark.symbol }} {{ p.mark.label }}</div>
              @if (p.note) {
                <div class="mt-0.5 text-xs text-slate-500">{{ p.note }}</div>
              }
            </div>
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

  protected readonly keys = BLUES_KEYS;
  protected readonly key = computed(() => BLUES_KEYS.find((k) => k.id === this.params().get('bkey')) ?? BLUES_KEYS[0]);
  protected readonly exercises = computed(() => bluesExercises(this.key().id));
  protected readonly exercise = computed(() => this.exercises().find((e) => e.id === this.params().get('bex')) ?? this.exercises()[0]);
  protected readonly chordNames = computed(() => this.exercise().bars.flat().map((p) => p.chord));

  /** Notes for the general rule, in the chosen key. */
  protected readonly rule = computed(() => {
    const t = theory(this.key().id);
    return {
      I: t.I,
      IV: t.IV,
      V: t.V,
      nI: n(t.I),
      nIV: n(t.IV),
      nV: n(t.V),
      maj3I: n(t.maj3I),
      b7I: n(t.b7I),
      b7IV: n(t.b7IV),
      maj3V: n(t.maj3V),
      p5V: n(up(t.V, '5P')),
    };
  });

  protected readonly bars = computed(() =>
    this.exercise().bars.map((parts) =>
      parts.map((p) => ({
        chord: p.chord,
        root: p.root,
        type: p.type,
        typeName: p.type ? (findScaleType(p.type)?.name ?? p.type) : '',
        mark: MARKS[p.mark],
        note: p.note,
      })),
    ),
  );

  /** The distinct scales of the exercise, with their notes. */
  protected readonly scales = computed(() => {
    const seen = new Map<string, { key: string; root: string; name: string; notes: string }>();
    for (const b of this.exercise().bars.flat()) {
      if (!b.root || !b.type) continue;
      const key = `${b.root}-${b.type}`;
      const type = findScaleType(b.type);
      if (type && !seen.has(key)) seen.set(key, { key, root: b.root, name: type.name, notes: buildScale(type, b.root).notes.join(' ') });
    }
    return [...seen.values()];
  });
}
