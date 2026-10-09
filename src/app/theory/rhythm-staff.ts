import { Component, computed, input } from '@angular/core';

export type NoteValue = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth' | 'thirtysecond';

export interface RhythmItem {
  kind: 'note' | 'rest';
  value: NoteValue;
  /** Number of augmentation dots (1 = dotted, 2 = double dotted). */
  dots?: number;
  /** Tie to the next note. */
  tie?: boolean;
  /** Start a new beam group on this note even if the previous one is beamable. */
  breakBefore?: boolean;
  /** Draw a bracket with this label over this note and the following `span - 1` items. */
  tuplet?: { label: string; span: number };
  /** Accent mark above the note. */
  accent?: boolean;
  /** Text under the note (counting, beat names...). */
  label?: string;
}

interface Placed extends RhythmItem {
  x: number;
  flags: number;
  dotCount: number;
}

/** Number of beams/flags of a value (0 for values without them). */
const BEAM_LEVEL: Record<NoteValue, number> = { whole: 0, half: 0, quarter: 0, eighth: 1, sixteenth: 2, thirtysecond: 3 };
const STEM_X = 5.8;
const BEAM_Y = [16, 24, 32];

/** Draws rhythmic figures (notes and rests) on a five-line staff, with beams, ties, tuplets and an optional time signature. */
@Component({
  selector: 'app-rhythm-staff',
  template: `
    <svg [attr.viewBox]="'0 0 ' + width() + ' 92'" class="h-auto max-w-full" [style.width.px]="width()" role="img">
      @for (y of lines; track y) {
        <line x1="0" [attr.x2]="width()" [attr.y1]="y" [attr.y2]="y" class="stroke-slate-700" stroke-width="1" />
      }
      <line x1="0.5" y1="20" x2="0.5" y2="60" class="stroke-slate-700" stroke-width="1.4" />
      <line [attr.x1]="width() - 1" y1="20" [attr.x2]="width() - 1" y2="60" class="stroke-slate-700" stroke-width="1.6" />

      @if (signature(); as sig) {
        <text x="18" y="39" text-anchor="middle" class="fill-slate-800 text-2xl font-bold">{{ sig[0] }}</text>
        <text x="18" y="59" text-anchor="middle" class="fill-slate-800 text-2xl font-bold">{{ sig[1] }}</text>
      }

      @for (b of layout().beams; track $index) {
        <line [attr.x1]="b.x1" [attr.x2]="b.x2" [attr.y1]="b.y" [attr.y2]="b.y" class="stroke-slate-900" stroke-width="4" />
      }
      @for (t of layout().ties; track $index) {
        <path [attr.d]="'M' + t.x1 + ' 57 Q' + (t.x1 + t.x2) / 2 + ' 69 ' + t.x2 + ' 57'" fill="none" class="stroke-slate-900" stroke-width="1.6" />
      }
      @for (t of layout().tuplets; track $index) {
        <path
          [attr.d]="'M' + t.x1 + ' 11 L' + t.x1 + ' 7 L' + (t.xm - 6) + ' 7 M' + (t.xm + 6) + ' 7 L' + t.x2 + ' 7 L' + t.x2 + ' 11'"
          fill="none"
          class="stroke-slate-900"
          stroke-width="1.2"
        />
        <text [attr.x]="t.xm" y="11" text-anchor="middle" class="fill-slate-900 text-xs font-bold italic">{{ t.label }}</text>
      }

      @for (it of layout().items; track $index) {
        <g [attr.transform]="'translate(' + it.x + ',0)'">
          @if (it.kind === 'note') {
            @if (it.value === 'whole') {
              <ellipse cx="0" cy="50" rx="8" ry="5" fill="white" class="stroke-slate-900" stroke-width="2.2" />
            } @else {
              <ellipse
                cx="0"
                cy="50"
                rx="6.5"
                ry="4.6"
                transform="rotate(-20 0 50)"
                [attr.fill]="it.value === 'half' ? 'white' : null"
                [class.fill-slate-900]="it.value !== 'half'"
                class="stroke-slate-900"
                stroke-width="1.8"
              />
              <line x1="5.8" y1="48" x2="5.8" y2="14" class="stroke-slate-900" stroke-width="1.6" />
              @for (f of flagOffsets(it.flags); track f) {
                <path [attr.d]="'M5.8 ' + (14 + f) + ' C 6 ' + (26 + f) + ', 19 ' + (28 + f) + ', 15 ' + (43 + f)" fill="none" class="stroke-slate-900" stroke-width="2.4" />
              }
            }
            @if (it.accent) {
              <path d="M-3 4 L5 7.5 L-3 11" fill="none" class="stroke-slate-900" stroke-width="1.6" transform="translate(1,0)" />
            }
          } @else {
            @switch (it.value) {
              @case ('whole') {
                <rect x="-7" y="30" width="14" height="5" class="fill-slate-900" />
              }
              @case ('half') {
                <rect x="-7" y="35" width="14" height="5" class="fill-slate-900" />
              }
              @case ('quarter') {
                <path d="M-3 24 L3 33 L-3 41 L3 50 Q-5 50 -2 58" fill="none" class="stroke-slate-900" stroke-width="2.4" stroke-linejoin="round" />
              }
              @case ('eighth') {
                <circle cx="-3" cy="36" r="2.8" class="fill-slate-900" />
                <path d="M-3 36 Q3 38 5 33 M5 33 L-3 54" fill="none" class="stroke-slate-900" stroke-width="2" />
              }
              @case ('sixteenth') {
                <circle cx="-3" cy="30" r="2.8" class="fill-slate-900" />
                <circle cx="-5" cy="40" r="2.8" class="fill-slate-900" />
                <path d="M-3 30 Q3 32 5 27 M-5 40 Q1 42 3 37 M5 27 L-5 56" fill="none" class="stroke-slate-900" stroke-width="2" />
              }
              @case ('thirtysecond') {
                <circle cx="-1" cy="24" r="2.6" class="fill-slate-900" />
                <circle cx="-3" cy="33" r="2.6" class="fill-slate-900" />
                <circle cx="-5" cy="42" r="2.6" class="fill-slate-900" />
                <path d="M-1 24 Q5 26 7 21 M-3 33 Q3 35 5 30 M-5 42 Q1 44 3 39 M7 21 L-7 58" fill="none" class="stroke-slate-900" stroke-width="1.8" />
              }
            }
          }
          @for (d of dotList(it.dotCount); track d) {
            <circle [attr.cx]="(it.kind === 'note' ? 14 : 12) + d * 6" cy="46" r="2.2" class="fill-slate-900" />
          }
          @if (it.label) {
            <text x="0" y="86" text-anchor="middle" class="fill-slate-500 text-xs">{{ it.label }}</text>
          }
        </g>
      }
    </svg>
  `,
})
export class RhythmStaff {
  readonly items = input.required<RhythmItem[]>();
  readonly signature = input<[number, number] | null>(null);
  readonly spacing = input(52);

  protected readonly lines = [20, 30, 40, 50, 60];

  private readonly start = computed(() => (this.signature() ? 38 : 8));

  protected readonly width = computed(() => this.start() + 14 + Math.max(this.items().length - 1, 0) * this.spacing() + 26);

  protected flagOffsets(flags: number): number[] {
    return Array.from({ length: flags }, (_, i) => i * 9);
  }

  protected dotList(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }

  protected readonly layout = computed(() => {
    const spacing = this.spacing();
    const base = this.start() + 14;
    const raw = this.items();
    const levels = raw.map((it) => (it.kind === 'note' ? BEAM_LEVEL[it.value] : 0));

    // Beam groups: runs of beamable notes (eighths or shorter), split by `breakBefore`.
    const groups: number[][] = [];
    let current: number[] = [];
    raw.forEach((it, i) => {
      if (levels[i] === 0) {
        if (current.length) groups.push(current);
        current = [];
        return;
      }
      if (it.breakBefore && current.length) {
        groups.push(current);
        current = [];
      }
      current.push(i);
    });
    if (current.length) groups.push(current);
    const beamed = new Set(groups.filter((g) => g.length > 1).flat());

    const beams: { x1: number; x2: number; y: number }[] = [];
    for (const g of groups.filter((g) => g.length > 1)) {
      const stem = (i: number) => base + i * spacing + STEM_X;
      beams.push({ x1: stem(g[0]), x2: stem(g[g.length - 1]), y: BEAM_Y[0] });
      for (let level = 2; level <= 3; level++) {
        let run: number[] = [];
        const flush = () => {
          if (run.length > 1) beams.push({ x1: stem(run[0]), x2: stem(run[run.length - 1]), y: BEAM_Y[level - 1] });
          else if (run.length === 1) {
            const i = run[0];
            const hasNext = g.includes(i + 1);
            beams.push(hasNext ? { x1: stem(i), x2: stem(i) + 9, y: BEAM_Y[level - 1] } : { x1: stem(i) - 9, x2: stem(i), y: BEAM_Y[level - 1] });
          }
          run = [];
        };
        for (const i of g) {
          if (levels[i] >= level) run.push(i);
          else flush();
        }
        flush();
      }
    }

    const items: Placed[] = raw.map((it, i) => ({
      ...it,
      x: base + i * spacing,
      flags: beamed.has(i) ? 0 : levels[i],
      dotCount: it.dots ?? 0,
    }));

    const ties: { x1: number; x2: number }[] = [];
    raw.forEach((it, i) => {
      if (it.tie && i + 1 < raw.length) ties.push({ x1: base + i * spacing, x2: base + (i + 1) * spacing });
    });

    const tuplets: { x1: number; x2: number; xm: number; label: string }[] = [];
    raw.forEach((it, i) => {
      if (!it.tuplet) return;
      const x1 = base + i * spacing - 2;
      const x2 = base + (i + it.tuplet.span - 1) * spacing + STEM_X + 4;
      tuplets.push({ x1, x2, xm: (x1 + x2) / 2, label: it.tuplet.label });
    });

    return { items, beams, ties, tuplets };
  });
}

/** A note of the given value; `extra` adds dots, ties, labels... */
export function note(value: NoteValue, extra: Partial<RhythmItem> = {}): RhythmItem {
  return { kind: 'note', value, ...extra };
}

/** A rest of the given value. */
export function rest(value: NoteValue, extra: Partial<RhythmItem> = {}): RhythmItem {
  return { kind: 'rest', value, ...extra };
}
