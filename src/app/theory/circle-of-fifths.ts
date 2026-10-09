import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Note, Scale } from 'tonal';
import { injectRoot } from './theory-root';

const MAJORS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
const SIGNATURES = ['0', '1♯', '2♯', '3♯', '4♯', '5♯', '6♯ / 6♭', '5♭', '4♭', '3♭', '2♭', '1♭'];

const R_OUT = 130;
const R_IN = 84;
const CENTER = 160;

/** Clickable circle of fifths: choosing a key sets the shared root and shows its signature and relatives. */
@Component({
  selector: 'app-circle-of-fifths',
  template: `
    <h2 class="text-xl font-bold text-slate-800">Circolo delle quinte</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      Clicca una tonalità: all'esterno le maggiori, all'interno le minori relative. Salendo di quinta (in senso orario) si aggiunge un diesis, scendendo si
      aggiunge un bemolle.
    </p>
    <div class="flex flex-wrap items-start gap-6">
      <svg viewBox="0 0 320 320" class="h-auto w-full max-w-xs" role="img" aria-label="Circolo delle quinte">
        @for (k of keys(); track k.major) {
          <g class="cursor-pointer" tabindex="0" role="button" (click)="pick(k.major)" (keydown.enter)="pick(k.major)">
            <circle [attr.cx]="k.ox" [attr.cy]="k.oy" r="22" [class.fill-slate-900]="k.selected" [class.fill-white]="!k.selected" class="stroke-slate-300 hover:stroke-slate-900" />
            <text [attr.x]="k.ox" [attr.y]="k.oy" text-anchor="middle" dominant-baseline="central" class="pointer-events-none text-sm font-bold" [class.fill-white]="k.selected" [class.fill-slate-800]="!k.selected">{{ k.major }}</text>
            <text [attr.x]="k.ix" [attr.y]="k.iy" text-anchor="middle" dominant-baseline="central" class="pointer-events-none text-xs" [class.fill-slate-900]="k.selected" [class.fill-slate-500]="!k.selected">{{ k.minor }}m</text>
          </g>
        }
      </svg>

      @if (info(); as i) {
        <div class="min-w-64 flex-1 space-y-2 text-sm text-slate-600">
          <div class="text-2xl font-bold text-slate-800">{{ i.key }} maggiore</div>
          <div><span class="font-semibold text-slate-800">Alterazioni:</span> {{ i.signature }}@if (i.accidentals) { ({{ i.accidentals }}) }</div>
          <div><span class="font-semibold text-slate-800">Note:</span> {{ i.notes }}</div>
          <div><span class="font-semibold text-slate-800">Relativa minore:</span> {{ i.relative }}m</div>
          <div><span class="font-semibold text-slate-800">Parallela minore:</span> {{ i.key }}m</div>
          <div><span class="font-semibold text-slate-800">Dominante (V):</span> {{ i.dominant }}</div>
          <div><span class="font-semibold text-slate-800">Sottodominante (IV):</span> {{ i.subdominant }}</div>
        </div>
      }
    </div>
  `,
})
export class CircleOfFifths {
  private readonly router = inject(Router);
  protected readonly root = injectRoot();

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
        selected: major === this.root(),
      };
    }),
  );

  protected readonly info = computed(() => {
    const key = this.root();
    const i = MAJORS.indexOf(key);
    if (i < 0) return null; // keys not on the circle (e.g. Gb is shown as F#)
    const notes = Scale.get(`${key} major`).notes;
    return {
      key,
      signature: SIGNATURES[i],
      accidentals: notes.filter((n) => n.length > 1).join(' '),
      notes: notes.join(' - '),
      relative: Note.simplify(Note.transpose(key, '6M')),
      dominant: MAJORS[(i + 1) % 12],
      subdominant: MAJORS[(i + 11) % 12],
    };
  });

  protected pick(root: string): void {
    this.router.navigate([], { queryParams: { root }, queryParamsHandling: 'merge' });
  }
}
