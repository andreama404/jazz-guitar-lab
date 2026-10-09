import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Note } from 'tonal';
import { ROOTS } from '../scales/scale-theory';

interface Tension {
  label: string;
  interval: string;
}

const T = {
  b9: { label: '♭9', interval: '2m' },
  n9: { label: '9', interval: '2M' },
  s9: { label: '♯9', interval: '2A' },
  n11: { label: '11', interval: '4P' },
  s11: { label: '♯11', interval: '4A' },
  b13: { label: '♭13', interval: '6m' },
  n13: { label: '13', interval: '6M' },
} satisfies Record<string, Tension>;

interface ChordRule {
  suffix: string;
  name: string;
  /** Tensions that sound natural on the chord. */
  available: Tension[];
  /** Tensions that need care or are avoided, with the reason. */
  avoid: { tension: Tension; why: string }[];
  note: string;
}

const RULES: ChordRule[] = [
  {
    suffix: 'maj7',
    name: 'Maggiore 7',
    available: [T.n9, T.s11, T.n13],
    avoid: [{ tension: T.n11, why: 'urta con la terza maggiore' }],
    note: 'Suono lidio: l\'11 giusto si evita, si usa la ♯11.',
  },
  {
    suffix: 'm7',
    name: 'Minore 7',
    available: [T.n9, T.n11, T.n13],
    avoid: [{ tension: T.b13, why: 'suona eolio, in conflitto con la 13 dorica' }],
    note: 'Suono dorico: tutte le tensioni naturali funzionano.',
  },
  {
    suffix: '7',
    name: 'Dominante 7',
    available: [T.n9, T.n13],
    avoid: [{ tension: T.n11, why: 'urta con la terza maggiore' }],
    note: 'Sul dominante non risolto: 9 e 13 naturali (misolidio).',
  },
  {
    suffix: '7alt',
    name: 'Dominante alterato',
    available: [T.b9, T.s9, T.s11, T.b13],
    avoid: [{ tension: T.n13, why: 'con la ♭13 non convivono' }],
    note: 'Su un dominante che risolve: tensioni alterate (scala alterata).',
  },
  {
    suffix: 'm7b5',
    name: 'Semidiminuito',
    available: [T.n11, T.b13],
    avoid: [{ tension: T.b9, why: 'è la nota "evitata" del locrio' }],
    note: 'Suono locrio; con la 9 naturale si ha il locrio ♯2.',
  },
];

/** Available tensions and the ones to avoid, for each main chord type, in the chosen key. */
@Component({
  selector: 'app-extensions',
  template: `
    <h2 class="text-xl font-bold text-slate-800">Estensioni e alterazioni</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      9, 11, 13, ♭9, ♯9, ♯11, ♭13: quali tensioni si possono aggiungere a ogni tipo di accordo. Le tensioni sono le note oltre la settima; quelle
      alterate (♭ o ♯) colorano soprattutto i dominanti.
    </p>
    <div class="space-y-3">
      @for (r of rows(); track r.suffix) {
        <div class="rounded-lg bg-slate-50 p-4">
          <div class="flex flex-wrap items-baseline gap-x-3">
            <span class="text-lg font-bold text-slate-800">{{ r.chord }}</span>
            <span class="text-sm text-slate-500">{{ r.name }}</span>
          </div>
          <p class="mt-1 text-sm text-slate-600">{{ r.note }}</p>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            @for (t of r.available; track t.label) {
              <span class="rounded-lg bg-slate-900 px-3 py-1 text-sm font-semibold text-white">{{ t.label }} · {{ t.note }}</span>
            }
            @for (t of r.avoid; track t.label) {
              <span class="rounded-lg bg-white px-3 py-1 text-sm text-slate-500 shadow" [title]="t.why">
                <s>{{ t.label }} · {{ t.note }}</s> <span class="text-xs">{{ t.why }}</span>
              </span>
            }
          </div>
        </div>
      }
    </div>
    <p class="mt-3 text-xs text-slate-400">Scuro = tensione disponibile · barrato = da evitare.</p>
  `,
})
export class Extensions {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  private readonly root = computed(() => {
    const root = this.params().get('root');
    return root !== null && ROOTS.includes(root) ? root : ROOTS[0];
  });

  protected readonly rows = computed(() => {
    const root = this.root();
    const withNote = (t: Tension) => ({ label: t.label, note: Note.transpose(root, t.interval) });
    return RULES.map((r) => ({
      suffix: r.suffix,
      name: r.name,
      chord: root + r.suffix,
      note: r.note,
      available: r.available.map(withNote),
      avoid: r.avoid.map((a) => ({ ...withNote(a.tension), why: a.why })),
    }));
  });
}
