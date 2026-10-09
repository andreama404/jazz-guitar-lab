import { Component } from '@angular/core';

/** Placeholder for the exercises section: only the categories are defined so far. */
@Component({
  selector: 'app-exercises-page',
  template: `
    <main class="h-full w-full overflow-y-auto px-6 py-10">
      <h1 class="mb-1 text-3xl font-bold text-slate-800">Esercizi</h1>
      <p class="mb-6 text-sm text-slate-500">Sezione in costruzione: per ora sono definite solo le categorie.</p>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        @for (c of categories; track c) {
          <div class="rounded-xl bg-white p-6 shadow">
            <h2 class="text-xl font-bold text-slate-800">{{ c }}</h2>
            <p class="mt-1 text-sm text-slate-500">{{ descriptions[c] ?? 'In arrivo.' }}</p>
          </div>
        }
      </div>
    </main>
  `,
})
export class ExercisesPage {
  protected readonly descriptions: Record<string, string> = {
    'Rivolti e voice leading': 'Come collegare gli accordi spostando poco le dita. In arrivo.',
  };
  protected readonly categories = ['Meccanica', 'Arpeggi', 'Improvvisazione', 'Triadi', 'Rivolti e voice leading'];
}
