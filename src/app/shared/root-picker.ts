import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROOTS } from '../scales/scale-theory';

/** Row of the twelve roots; the choice goes in the `root` query parameter of the current page. */
@Component({
  selector: 'app-root-picker',
  imports: [RouterLink],
  template: `
    <h2 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{{ label() }}</h2>
    <div class="flex flex-wrap gap-2">
      @for (r of roots; track r) {
        <a
          [routerLink]="[]"
          [queryParams]="{ root: r }"
          queryParamsHandling="merge"
          class="min-w-12 rounded-lg px-3 py-2 text-center text-sm font-semibold shadow transition"
          [class.bg-slate-900]="root() === r"
          [class.text-white]="root() === r"
          [class.bg-white]="root() !== r"
          [class.text-slate-700]="root() !== r"
        >
          {{ r }}
        </a>
      }
    </div>
  `,
})
export class RootPicker {
  readonly root = input<string | null>(null);
  readonly label = input('Nota');
  protected readonly roots = ROOTS;
}
