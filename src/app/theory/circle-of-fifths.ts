import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Note, Scale } from 'tonal';
import { injectRoot } from './theory-root';

const MAJORS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
/** Sharps (positive) or flats (negative) in the key signature of each major key; F# is shown with 6 sharps. */
const SIGNATURE_COUNT = [0, 1, 2, 3, 4, 5, 6, -5, -4, -3, -2, -1];

/** Staff step of each accidental in the treble clef (0 = bottom line E4, one step per line or space). */
const SHARP_STEPS = [8, 5, 9, 6, 3, 7, 4]; // F C G D A E B
const FLAT_STEPS = [4, 7, 3, 6, 2, 5, 1]; // B E A D G C F

const R_OUT = 130;
const R_IN = 84;
const CENTER = 160;

type Mode = 'major' | 'minor';

/** Clickable circle of fifths: major keys outside, relative minors inside; shows the key signature on a staff. */
@Component({
  selector: 'app-circle-of-fifths',
  imports: [RouterLink],
  template: `
    <h2 class="text-xl font-bold text-slate-800">Circolo delle quinte</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      Clicca una tonalità: all'esterno le maggiori, all'interno le minori relative. Salendo di quinta (in senso orario) si aggiunge un diesis, scendendo si
      aggiunge un bemolle. Una tonalità minore ha la stessa armatura della sua relativa maggiore.
    </p>
    <div class="flex flex-wrap items-start gap-6">
      <svg viewBox="0 0 320 320" class="h-auto w-full max-w-xs" role="img" aria-label="Circolo delle quinte">
        @for (k of keys(); track k.major) {
          <g class="cursor-pointer" tabindex="0" role="button" (click)="pick(k.major, 'major')" (keydown.enter)="pick(k.major, 'major')">
            <circle [attr.cx]="k.ox" [attr.cy]="k.oy" r="22" [class.fill-slate-900]="k.majorSelected" [class.fill-white]="!k.majorSelected" class="stroke-slate-300 hover:stroke-slate-900" />
            <text [attr.x]="k.ox" [attr.y]="k.oy" text-anchor="middle" dominant-baseline="central" class="pointer-events-none text-sm font-bold" [class.fill-white]="k.majorSelected" [class.fill-slate-800]="!k.majorSelected">{{ k.major }}</text>
          </g>
          <g class="cursor-pointer" tabindex="0" role="button" (click)="pick(k.major, 'minor')" (keydown.enter)="pick(k.major, 'minor')">
            <circle [attr.cx]="k.ix" [attr.cy]="k.iy" r="16" [class.fill-slate-900]="k.minorSelected" [class.fill-slate-50]="!k.minorSelected" class="stroke-slate-300 hover:stroke-slate-900" />
            <text [attr.x]="k.ix" [attr.y]="k.iy" text-anchor="middle" dominant-baseline="central" class="pointer-events-none text-xs font-semibold" [class.fill-white]="k.minorSelected" [class.fill-slate-600]="!k.minorSelected">{{ k.minor }}m</text>
          </g>
        }
      </svg>

      @if (info(); as i) {
        <div class="min-w-64 flex-1 space-y-2 text-sm text-slate-600">
          <div class="text-2xl font-bold text-slate-800">{{ i.title }}</div>
          <div><span class="font-semibold text-slate-800">Armatura:</span> {{ i.signature }}@if (i.accidentals) { ({{ i.accidentals }}) }</div>

          <svg [attr.viewBox]="'0 0 ' + sig().width + ' 80'" class="h-auto" [style.width.px]="sig().width" role="img" aria-label="Armatura di chiave">
            @for (y of staffLines; track y) {
              <line x1="0" [attr.x2]="sig().width" [attr.y1]="y" [attr.y2]="y" class="stroke-slate-700" stroke-width="1" />
            }
            @for (a of sig().marks; track $index) {
              <text [attr.x]="a.x" [attr.y]="a.y" text-anchor="middle" dominant-baseline="central" class="fill-slate-900" font-size="30">{{ a.glyph }}</text>
            }
          </svg>

          @for (row of i.rows; track row.label) {
            <div><span class="font-semibold text-slate-800">{{ row.label }}:</span> {{ row.value }}</div>
          }
          <div class="pt-1">
            <a [routerLink]="[]" [queryParams]="{ mode: null }" queryParamsHandling="merge" class="text-xs text-slate-500 underline hover:text-slate-900">Mostra la tonalità maggiore</a>
            ·
            <a [routerLink]="[]" [queryParams]="{ mode: 'minor' }" queryParamsHandling="merge" class="text-xs text-slate-500 underline hover:text-slate-900">Mostra la minore relativa</a>
          </div>
        </div>
      }
    </div>
  `,
})
export class CircleOfFifths {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly root = injectRoot();
  protected readonly staffLines = [20, 30, 40, 50, 60];

  protected readonly mode = computed<Mode>(() => (this.params().get('mode') === 'minor' ? 'minor' : 'major'));

  protected readonly keys = computed(() =>
    MAJORS.map((major, i) => {
      const angle = ((i * 30 - 90) * Math.PI) / 180;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        major,
        minor: Note.simplify(Note.transpose(major, '6M')),
        ox: CENTER + R_OUT * cos,
        oy: CENTER + R_OUT * sin,
        ix: CENTER + R_IN * cos,
        iy: CENTER + R_IN * sin,
        majorSelected: major === this.root() && this.mode() === 'major',
        minorSelected: major === this.root() && this.mode() === 'minor',
      };
    }),
  );

  private readonly index = computed(() => MAJORS.indexOf(this.root()));

  protected readonly sig = computed(() => {
    const count = SIGNATURE_COUNT[this.index()] ?? 0;
    const sharps = count > 0;
    const steps = (sharps ? SHARP_STEPS : FLAT_STEPS).slice(0, Math.abs(count));
    const marks = steps.map((step, i) => ({
      x: 14 + i * 16,
      y: 60 - step * 5 + (sharps ? 0 : 3),
      glyph: sharps ? '♯' : '♭',
    }));
    return { width: 28 + Math.max(Math.abs(count), 1) * 16, marks };
  });

  protected readonly info = computed(() => {
    const major = this.root();
    const i = this.index();
    if (i < 0) return null; // keys not on the circle (e.g. Gb is shown as F#)
    const count = SIGNATURE_COUNT[i];
    const signature = count === 0 ? 'nessuna alterazione' : `${Math.abs(count)} ${count > 0 ? 'diesis' : Math.abs(count) === 1 ? 'bemolle' : 'bemolli'}`;
    const majorNotes = Scale.get(`${major} major`).notes;
    const accidentals = majorNotes.filter((n) => n.length > 1).join(' ');
    const dominant = MAJORS[(i + 1) % 12];
    const subdominant = MAJORS[(i + 11) % 12];

    if (this.mode() === 'minor') {
      const minor = Note.simplify(Note.transpose(major, '6M'));
      return {
        title: `${minor} minore`,
        signature,
        accidentals,
        rows: [
          { label: 'Naturale', value: Scale.get(`${minor} minor`).notes.join(' - ') },
          { label: 'Armonica', value: Scale.get(`${minor} harmonic minor`).notes.join(' - ') },
          { label: 'Melodica', value: Scale.get(`${minor} melodic minor`).notes.join(' - ') },
          { label: 'Relativa maggiore', value: major },
          { label: 'Parallela maggiore', value: minor },
        ],
      };
    }
    return {
      title: `${major} maggiore`,
      signature,
      accidentals,
      rows: [
        { label: 'Note', value: majorNotes.join(' - ') },
        { label: 'Relativa minore', value: `${Note.simplify(Note.transpose(major, '6M'))}m` },
        { label: 'Parallela minore', value: `${major}m` },
        { label: 'Dominante (V)', value: dominant },
        { label: 'Sottodominante (IV)', value: subdominant },
      ],
    };
  });

  protected pick(root: string, mode: Mode): void {
    this.router.navigate([], { queryParams: { root, mode: mode === 'minor' ? 'minor' : null }, queryParamsHandling: 'merge' });
  }
}
