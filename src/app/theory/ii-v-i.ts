import { Component, computed } from '@angular/core';
import { Note } from 'tonal';
import { ChordItem, ChordLine, chordAt } from './chord-line';
import { injectRoot } from './theory-root';

/** The II-V-I cadence in major and minor, with common variants. */
@Component({
  selector: 'app-ii-v-i',
  imports: [ChordLine],
  template: `
    <h2 class="text-xl font-bold text-slate-800">II-V-I</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      La cadenza fondamentale del jazz: sottodominante (II), dominante (V), tonica (I). Ogni accordo spinge verso il successivo; il V crea la tensione e il I la
      risolve.
    </p>
    <div class="space-y-4">
      @for (g of groups(); track g.title) {
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ g.title }}</div>
          <p class="mb-1 text-xs text-slate-400">{{ g.text }}</p>
          <app-chord-line [bars]="[g.chords]"></app-chord-line>
        </div>
      }
    </div>
  `,
})
export class IiVI {
  private readonly key = injectRoot();

  protected readonly groups = computed(() => {
    const k = this.key();
    const subV = Note.simplify(Note.transpose(k, '2m'));
    const row = (title: string, text: string, chords: ChordItem[]) => ({ title, text, chords });
    return [
      row('In maggiore', 'La forma di base.', [chordAt(k, '2M', 'm7', 'IIm7'), chordAt(k, '5P', '7', 'V7'), chordAt(k, '1P', 'maj7', 'Imaj7')]),
      row('Maggiore con V alterato', 'Il V diventa 7alt (♭9, ♯9, ♭13): più tensione prima della risoluzione.', [
        chordAt(k, '2M', 'm7', 'IIm7'),
        chordAt(k, '5P', '7alt', 'V7alt', true),
        chordAt(k, '1P', 'maj7', 'Imaj7'),
      ]),
      row('Maggiore con sostituto di tritono', 'Il V è sostituito dal dominante a un tritono: il basso scende di semitono.', [
        chordAt(k, '2M', 'm7', 'IIm7'),
        { name: `${subV}7`, roman: '♭II7', highlight: true },
        chordAt(k, '1P', 'maj7', 'Imaj7'),
      ]),
      row('In minore', 'Il II è semidiminuito, il V ha la ♭9 e la tonica è minore.', [
        chordAt(k, '2M', 'm7♭5', 'IIm7♭5'),
        chordAt(k, '5P', '7♭9', 'V7♭9'),
        chordAt(k, '1P', 'm7', 'Im7'),
      ]),
    ];
  });
}
