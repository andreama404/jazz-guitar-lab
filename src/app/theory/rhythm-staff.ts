import { Component, computed, input } from '@angular/core';

export type NoteValue = 'whole' | 'half' | 'quarter' | 'eighth' | 'sixteenth';

export interface RhythmItem {
  kind: 'note' | 'rest';
  value: NoteValue;
  dotted?: boolean;
}

/** Draws rhythmic figures (notes and rests) on a five-line staff, optionally with a time signature. */
@Component({
  selector: 'app-rhythm-staff',
  template: `
    <svg [attr.viewBox]="'0 0 ' + width() + ' 80'" class="h-auto max-w-full" [style.width.px]="width()" role="img">
      @for (y of lines; track y) {
        <line x1="0" [attr.x2]="width()" [attr.y1]="y" [attr.y2]="y" class="stroke-slate-700" stroke-width="1" />
      }
      <line x1="0.5" y1="20" x2="0.5" y2="60" class="stroke-slate-700" stroke-width="1.4" />
      <line [attr.x1]="width() - 1" y1="20" [attr.x2]="width() - 1" y2="60" class="stroke-slate-700" stroke-width="1.6" />

      @if (signature(); as sig) {
        <text x="18" y="39" text-anchor="middle" class="fill-slate-800 text-2xl font-bold">{{ sig[0] }}</text>
        <text x="18" y="59" text-anchor="middle" class="fill-slate-800 text-2xl font-bold">{{ sig[1] }}</text>
      }

      @for (it of positioned(); track $index) {
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
              @if (it.value === 'eighth' || it.value === 'sixteenth') {
                <path d="M5.8 14 C 6 26, 19 28, 15 43" fill="none" class="stroke-slate-900" stroke-width="2.4" />
              }
              @if (it.value === 'sixteenth') {
                <path d="M5.8 23 C 6 35, 19 37, 15 52" fill="none" class="stroke-slate-900" stroke-width="2.4" />
              }
            }
            @if (it.dotted) {
              <circle cx="15" cy="46" r="2.2" class="fill-slate-900" />
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
            }
            @if (it.dotted) {
              <circle cx="12" cy="46" r="2.2" class="fill-slate-900" />
            }
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

  protected readonly positioned = computed(() => this.items().map((it, i) => ({ ...it, x: this.start() + 14 + i * this.spacing() })));

  protected readonly width = computed(() => this.start() + 14 + Math.max(this.items().length - 1, 0) * this.spacing() + 26);
}
