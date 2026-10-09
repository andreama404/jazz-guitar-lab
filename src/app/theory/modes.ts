import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Scale } from 'tonal';
import { injectRoot } from './theory-root';

const MODES = [
  { id: 'major', tonal: 'major', name: 'Ionica', degree: 'I', chord: 'maj7', special: -1, text: 'Maggiore stabile e risolto. L\'11 giusto urta con la terza.' },
  { id: 'dorian', tonal: 'dorian', name: 'Dorica', degree: 'II', chord: 'm7', special: 5, text: 'Minore con la sesta maggiore: il suono jazz del minore.' },
  { id: 'phrygian', tonal: 'phrygian', name: 'Frigia', degree: 'III', chord: 'm7', special: 1, text: 'Minore con la seconda minore: colore scuro, spagnoleggiante.' },
  { id: 'lydian', tonal: 'lydian', name: 'Lidia', degree: 'IV', chord: 'maj7♯11', special: 3, text: 'Maggiore con la quarta aumentata: suono sospeso e luminoso.' },
  { id: 'mixolydian', tonal: 'mixolydian', name: 'Misolidia', degree: 'V', chord: '7', special: 6, text: 'Maggiore con la settima minore: la scala del dominante.' },
  { id: 'aeolian', tonal: 'aeolian', name: 'Eolia', degree: 'VI', chord: 'm7', special: 5, text: 'Il minore naturale, con la sesta minore.' },
  { id: 'locrian', tonal: 'locrian', name: 'Locria', degree: 'VII', chord: 'm7♭5', special: 4, text: 'Minore con la quinta diminuita: scala del semidiminuito.' },
];

/** The seven modes of the major scale built on the chosen note, with the note that gives each its colour. */
@Component({
  selector: 'app-modes',
  imports: [RouterLink],
  template: `
    <h2 class="text-xl font-bold text-slate-800">Modi della scala maggiore</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      Ogni modo parte da un grado diverso della scala maggiore. Qui sono costruiti sulla stessa nota ({{ root() }}) per confrontarli: in grassetto la nota
      caratteristica, quella che dà il colore al modo.
    </p>
    <div class="space-y-3">
      @for (m of rows(); track m.id) {
        <div class="rounded-lg bg-slate-50 p-4">
          <div class="flex flex-wrap items-baseline gap-x-3">
            <span class="text-lg font-bold text-slate-800">{{ root() }} {{ m.name }}</span>
            <span class="text-sm text-slate-500">{{ m.degree }} grado · accordo {{ root() }}{{ m.chord }}</span>
          </div>
          <div class="mt-1 text-sm text-slate-700">
            @for (n of m.notes; track $index) {
              <span class="mr-2" [class.font-bold]="$index === m.special" [class.text-slate-900]="$index === m.special">{{ n }}</span>
            }
          </div>
          <p class="mt-1 text-sm text-slate-600">{{ m.text }}</p>
          <a [routerLink]="['/scales']" [queryParams]="{ root: root(), type: m.id }" class="mt-1 inline-block text-xs text-slate-500 underline hover:text-slate-900">Vedi diteggiature</a>
        </div>
      }
    </div>
  `,
})
export class Modes {
  protected readonly root = injectRoot();

  protected readonly rows = computed(() => MODES.map((m) => ({ ...m, notes: Scale.get(`${this.root()} ${m.tonal}`).notes })));
}
