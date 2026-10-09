import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RootPicker } from '../shared/root-picker';
import { Glossary } from './glossary';
import { CircleOfFifths } from './circle-of-fifths';
import { RHYTHM_LESSONS, RhythmLesson } from './rhythm-lessons';
import { RhythmLessonView } from './rhythm-lesson';
import { NoteValues } from './note-values';
import { StaffAndMeasure } from './staff-and-measure';
import { Blues } from './blues';
import { ChordSubstitution } from './chord-substitution';
import { ChordSymbols } from './chord-symbols';
import { MinorField } from './minor-field';
import { Functions } from './functions';
import { HarmonicField } from './harmonic-field';
import { IiVI } from './ii-v-i';
import { ModalInterchange } from './modal-interchange';
import { Modes } from './modes';
import { Progressions } from './progressions';
import { SecondaryDominants } from './secondary-dominants';
import { Extensions } from './extensions';
import { Intervals } from './intervals';
import { PassingChords } from './passing-chords';
import { ScalesOnChords } from './scales-on-chords';
import { injectRoot } from './theory-root';
import { TritoneSubstitution } from './tritone-substitution';

export interface Topic {
  id: string;
  title: string;
  summary: string;
  /** False while the notes for the topic are still to be written. */
  ready: boolean;
  /** False when the example is fixed (no key to choose). */
  picker?: boolean;
}

export const TOPICS: Topic[] = [
  { id: 'glossary', title: 'Glossario', summary: 'I termini usati nella teoria, con ricerca e link agli argomenti.', ready: true, picker: false },
  { id: 'tritone', title: 'Sostituzione di tritono', summary: 'Il dominante a un tritono di distanza e il II-V-I con subV.', ready: true },
  { id: 'extensions', title: 'Estensioni e alterazioni', summary: '9, 11, 13, ♭9, ♯9, ♯11, ♭13: quali tensioni su quale accordo.', ready: true },
  { id: 'passing', title: 'Accordi di passaggio', summary: 'Diminuito di passaggio e diminuito al posto del V7♭9.', ready: true },
  { id: 'scales-on-chords', title: 'Scale sugli accordi', summary: 'Quale scala usare su ogni tipo di accordo.', ready: true },
  { id: 'intervals', title: 'Intervalli', summary: 'Nomi, semitoni e come riconoscerli sulla tastiera.', ready: true },
  { id: 'circle', title: 'Circolo delle quinte', summary: 'Alterazioni di ogni tonalità e tonalità relative.', ready: true },
  { id: 'harmonic-field', title: 'Campo armonico', summary: 'Triadi e quadriadi su ogni grado, con le funzioni.', ready: true },
  { id: 'minor-field', title: 'Campo armonico minore', summary: 'Naturale, armonico e melodico: gli accordi su ogni grado.', ready: true },
  { id: 'chord-symbols', title: 'Cifratura degli accordi', summary: 'Come leggere sigle come Δ, ø, °, −.', ready: true },
  { id: 'chord-substitution', title: 'Sostituzione di accordi', summary: 'Una progressione rielaborata con le tecniche di sostituzione, in Do, Fa e Si bemolle.', ready: true, picker: false },
  { id: 'staff-and-measure', title: 'Pentagramma e misura', summary: 'Il pentagramma, le battute e le indicazioni di tempo.', ready: true, picker: false },
  { id: 'note-values', title: 'Valore delle note', summary: 'Figure ritmiche, pause e punto di valore.', ready: true, picker: false },
  ...RHYTHM_LESSONS.map((l) => ({ id: l.id, title: l.title, summary: l.summary, ready: true, picker: false })),
  { id: 'blues', title: 'Blues', summary: 'Le 12 battute, il blues minore, le scale e la blue note.', ready: true },
  { id: 'functions', title: 'Funzioni armoniche', summary: 'Tonica, sottodominante, dominante e perché il V risolve sul I.', ready: true },
  { id: 'ii-v-i', title: 'II-V-I', summary: 'La cadenza fondamentale, in maggiore e in minore, con varianti.', ready: true },
  { id: 'progressions', title: 'Progressioni tipiche', summary: 'Turnaround, blues jazz e anatole.', ready: true },
  { id: 'modes', title: 'Modi', summary: 'I sette modi della scala maggiore e la loro nota caratteristica.', ready: true },
  { id: 'secondary-dominants', title: 'Dominanti secondarie', summary: 'V7 dei gradi della tonalità, con II-V secondari.', ready: true },
  { id: 'modal-interchange', title: 'Intercambio modale', summary: 'Accordi presi in prestito dal modo parallelo.', ready: true },
];

/** Theory notes: a list of topics; choosing one shows its detail. */
@Component({
  selector: 'app-theory-page',
  imports: [RouterLink, RootPicker, TritoneSubstitution, Extensions, PassingChords, ScalesOnChords, Intervals, CircleOfFifths, HarmonicField, MinorField, ChordSymbols, ChordSubstitution, Blues, Glossary, StaffAndMeasure, NoteValues, RhythmLessonView, Functions, IiVI, Progressions, Modes, SecondaryDominants, ModalInterchange],
  template: `
    <main class="h-full w-full overflow-y-auto px-6 py-10">
      @if (topic(); as t) {
        <a [routerLink]="[]" [queryParams]="{ topic: null }" queryParamsHandling="merge" class="mb-4 inline-block text-sm text-slate-500 hover:text-slate-900">← Tutti gli argomenti</a>
        <h1 class="mb-6 text-3xl font-bold text-slate-800">{{ t.title }}</h1>

        @if (t.ready && t.picker !== false) {
          <app-root-picker class="mb-6 block" label="Nota / tonalità" [root]="root()"></app-root-picker>
        }

        <section class="rounded-xl bg-white p-6 shadow">
          @switch (t.id) {
            @case ('tritone') { <app-tritone-substitution></app-tritone-substitution> }
            @case ('extensions') { <app-extensions></app-extensions> }
            @case ('passing') { <app-passing-chords></app-passing-chords> }
            @case ('scales-on-chords') { <app-scales-on-chords></app-scales-on-chords> }
            @case ('intervals') { <app-intervals></app-intervals> }
            @case ('circle') { <app-circle-of-fifths></app-circle-of-fifths> }
            @case ('harmonic-field') { <app-harmonic-field></app-harmonic-field> }
            @case ('minor-field') { <app-minor-field></app-minor-field> }
            @case ('chord-symbols') { <app-chord-symbols></app-chord-symbols> }
            @case ('chord-substitution') { <app-chord-substitution></app-chord-substitution> }
            @case ('staff-and-measure') { <app-staff-and-measure></app-staff-and-measure> }
            @case ('note-values') { <app-note-values></app-note-values> }
            @case ('glossary') { <app-glossary></app-glossary> }
            @case ('blues') { <app-blues></app-blues> }
            @case ('functions') { <app-functions></app-functions> }
            @case ('ii-v-i') { <app-ii-v-i></app-ii-v-i> }
            @case ('progressions') { <app-progressions></app-progressions> }
            @case ('modes') { <app-modes></app-modes> }
            @case ('secondary-dominants') { <app-secondary-dominants></app-secondary-dominants> }
            @case ('modal-interchange') { <app-modal-interchange></app-modal-interchange> }
            @default {
              @if (lesson(); as l) {
                <app-rhythm-lesson [lesson]="l"></app-rhythm-lesson>
              } @else {
                <p class="text-sm text-slate-500">Appunti in arrivo.</p>
              }
            }
          }
        </section>
      } @else {
        <h1 class="mb-1 text-3xl font-bold text-slate-800">Teoria</h1>
        <p class="mb-6 text-sm text-slate-500">Scegli un argomento.</p>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          @for (t of topics; track t.id) {
            <a
              [routerLink]="[]"
              [queryParams]="{ topic: t.id }"
              queryParamsHandling="merge"
              class="rounded-xl bg-white p-6 shadow transition hover:ring-2 hover:ring-slate-900"
            >
              <h2 class="text-lg font-bold text-slate-800">{{ t.title }}</h2>
              <p class="mt-1 text-sm text-slate-500">{{ t.summary }}</p>
            </a>
          }
        </div>
      }
    </main>
  `,
})
export class TheoryPage {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly root = injectRoot();
  protected readonly topics = TOPICS;
  protected readonly lesson = computed<RhythmLesson | null>(() => RHYTHM_LESSONS.find((l) => l.id === this.topic()?.id) ?? null);
  protected readonly topic = computed(() => TOPICS.find((t) => t.id === this.params().get('topic')) ?? null);
}
