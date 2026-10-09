import { Component } from '@angular/core';
import { RhythmItem, RhythmStaff } from './rhythm-staff';

type Value = RhythmItem['value'];

const FIGURES: { value: Value; name: string; rest: string; beats: string; fraction: string; parts: number }[] = [
  { value: 'whole', name: 'Semibreve', rest: 'Pausa di semibreve', beats: '4', fraction: '1', parts: 1 },
  { value: 'half', name: 'Minima', rest: 'Pausa di minima', beats: '2', fraction: '1/2', parts: 2 },
  { value: 'quarter', name: 'Semiminima', rest: 'Pausa di semiminima', beats: '1', fraction: '1/4', parts: 4 },
  { value: 'eighth', name: 'Croma', rest: 'Pausa di croma', beats: '1/2', fraction: '1/8', parts: 8 },
  { value: 'sixteenth', name: 'Semicroma', rest: 'Pausa di semicroma', beats: '1/4', fraction: '1/16', parts: 16 },
];

/** Note and rest values, how a whole note divides, and dotted notes. */
@Component({
  selector: 'app-note-values',
  imports: [RhythmStaff],
  template: `
    <h2 class="text-xl font-bold text-slate-800">Valore delle note</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      La forma di una nota ne indica la durata, che è sempre relativa: ogni figura vale la metà di quella che la precede. Le durate in movimenti sono quelle di
      un tempo in 4/4, dove la semiminima vale un movimento.
    </p>

    <div class="mb-6 overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th class="py-2 pr-4">Nota</th>
            <th class="py-2 pr-4">Nome</th>
            <th class="py-2 pr-4">Pausa</th>
            <th class="py-2 pr-4">Frazione</th>
            <th class="py-2">In 4/4</th>
          </tr>
        </thead>
        <tbody>
          @for (f of figures; track f.value) {
            <tr class="border-b border-slate-100">
              <td class="py-2 pr-4"><app-rhythm-staff [items]="[note(f.value)]"></app-rhythm-staff></td>
              <td class="py-2 pr-4 font-semibold text-slate-800">{{ f.name }}</td>
              <td class="py-2 pr-4"><app-rhythm-staff [items]="[rest(f.value)]"></app-rhythm-staff></td>
              <td class="py-2 pr-4 font-mono text-slate-600">{{ f.fraction }}</td>
              <td class="py-2 text-slate-600">{{ f.beats }} {{ f.beats === '1' ? 'movimento' : 'movimenti' }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <h3 class="font-semibold text-slate-800">Come si divide una semibreve</h3>
    <div class="mt-2 mb-6 space-y-1">
      @for (f of figures; track f.value) {
        <div class="flex items-center gap-3">
          <div class="w-28 shrink-0 text-xs text-slate-500">{{ f.name }}</div>
          <div class="flex flex-1 gap-0.5">
            @for (p of parts(f.parts); track p) {
              <div class="h-6 flex-1 rounded-sm bg-slate-900"></div>
            }
          </div>
        </div>
      }
    </div>

    <h3 class="font-semibold text-slate-800">Il punto di valore</h3>
    <p class="mt-1 mb-3 text-sm text-slate-600">
      Un punto dopo la nota ne <strong>aumenta la durata della metà</strong>: una minima vale 2 movimenti, una minima col punto ne vale 3 (2 + 1).
    </p>
    <div class="space-y-4">
      @for (d of dotted; track d.title) {
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ d.title }}</div>
          <app-rhythm-staff [items]="d.items" [signature]="[4, 4]"></app-rhythm-staff>
        </div>
      }
    </div>
  `,
})
export class NoteValues {
  protected readonly figures = FIGURES;

  protected note(value: Value, dotted = false): RhythmItem {
    return { kind: 'note', value, dotted };
  }

  protected rest(value: Value): RhythmItem {
    return { kind: 'rest', value };
  }

  protected parts(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  protected readonly dotted: { title: string; items: RhythmItem[] }[] = [
    { title: 'Minima col punto (3) + semiminima (1) = 4', items: [this.note('half', true), this.note('quarter')] },
    { title: 'Semiminima col punto (1,5) + croma (0,5), due volte = 4', items: [this.note('quarter', true), this.note('eighth'), this.note('quarter', true), this.note('eighth')] },
  ];
}
