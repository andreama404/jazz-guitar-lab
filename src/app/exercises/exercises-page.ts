import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EarTraining } from './ear-training';
import { ArpeggioProgression } from './arpeggio-progression';
import { Mechanics } from './mechanics';

interface Category {
  id: string;
  title: string;
  summary: string;
  /** False while the exercises of the category are still to be written. */
  ready: boolean;
}

const CATEGORIES: Category[] = [
  { id: 'mechanics', title: 'Meccanica', summary: 'Spider, permutazioni delle dita e salti di corda.', ready: true },
  { id: 'arpeggios', title: 'Arpeggi', summary: 'Seguire una progressione con l\'arpeggio di ogni accordo.', ready: true },
  { id: 'improvisation', title: 'Improvvisazione', summary: 'In arrivo.', ready: false },
  { id: 'ear-training', title: 'Ear training', summary: 'Riconoscere a orecchio intervalli, accordi e scale.', ready: true },
  { id: 'triads', title: 'Triadi', summary: 'In arrivo.', ready: false },
  { id: 'voice-leading', title: 'Rivolti e voice leading', summary: 'Come collegare gli accordi spostando poco le dita. In arrivo.', ready: false },
];

/** Exercises: a list of categories; choosing one shows its exercises. */
@Component({
  selector: 'app-exercises-page',
  imports: [RouterLink, Mechanics, ArpeggioProgression, EarTraining],
  template: `
    <main class="h-full w-full overflow-y-auto px-6 py-10">
      @if (category(); as c) {
        <a [routerLink]="[]" [queryParams]="{ category: null, ex: null, fret: null, prog: null, ear: null }" class="mb-4 inline-block text-sm text-slate-500 hover:text-slate-900">← Tutte le categorie</a>
        <h1 class="mb-6 text-3xl font-bold text-slate-800">{{ c.title }}</h1>
        @if (c.id === 'mechanics') {
          <app-mechanics></app-mechanics>
        } @else if (c.id === 'ear-training') {
          <app-ear-training></app-ear-training>
        } @else if (c.id === 'arpeggios') {
          <app-arpeggio-progression></app-arpeggio-progression>
        } @else {
          <p class="rounded-xl bg-white p-6 text-sm text-slate-500 shadow">Esercizi in arrivo.</p>
        }
      } @else {
        <h1 class="mb-1 text-3xl font-bold text-slate-800">Esercizi</h1>
        <p class="mb-6 text-sm text-slate-500">Scegli una categoria.</p>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          @for (c of categories; track c.id) {
            <a [routerLink]="[]" [queryParams]="{ category: c.id }" class="rounded-xl bg-white p-6 shadow transition hover:ring-2 hover:ring-slate-900">
              <h2 class="text-lg font-bold text-slate-800">{{ c.title }}</h2>
              <p class="mt-1 text-sm text-slate-500">{{ c.summary }}</p>
            </a>
          }
        </div>
      }
    </main>
  `,
})
export class ExercisesPage {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly categories = CATEGORIES;
  protected readonly category = computed(() => CATEGORIES.find((c) => c.id === this.params().get('category')) ?? null);
}
