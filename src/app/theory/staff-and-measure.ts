import { Component } from '@angular/core';
import { RhythmItem, RhythmStaff, note, rest } from './rhythm-staff';

/** The staff, bars and time signatures. */
@Component({
  selector: 'app-staff-and-measure',
  imports: [RhythmStaff],
  template: `
    <h2 class="text-xl font-bold text-slate-800">Pentagramma e misura</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">Dove si scrivono le note e come il tempo viene diviso in battute.</p>

    <h3 class="font-semibold text-slate-800">Il pentagramma</h3>
    <ul class="mt-1 mb-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
      <li>Cinque linee orizzontali e quattro spazi, che si contano <strong>dal basso verso l'alto</strong>.</li>
      <li>L'altezza di una nota dipende dalla sua posizione su linea o spazio (e dalla chiave); la durata dipende dalla figura.</li>
      <li>Le note sono lette da sinistra a destra, come un testo.</li>
    </ul>
    <app-rhythm-staff [items]="oneNote"></app-rhythm-staff>

    <h3 class="mt-6 font-semibold text-slate-800">Battute e stanghette</h3>
    <p class="mt-1 mb-3 text-sm text-slate-600">
      Il pentagramma è diviso in <strong>battute</strong> (o misure) da linee verticali dette stanghette. Ogni battuta contiene sempre lo stesso numero di movimenti,
      stabilito dalla frazione all'inizio.
    </p>

    <h3 class="mt-6 font-semibold text-slate-800">Indicazione di tempo</h3>
    <p class="mt-1 mb-3 text-sm text-slate-600">
      È una frazione. Il numeratore dice <strong>quanti movimenti</strong> ci sono in una battuta; il denominatore dice <strong>che figura vale un movimento</strong>
      (4 = semiminima, 8 = croma, 2 = minima).
    </p>

    <div class="space-y-4">
      @for (e of examples; track e.title) {
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ e.title }}</div>
          <p class="mb-1 text-sm text-slate-600">{{ e.text }}</p>
          <app-rhythm-staff [items]="e.items" [signature]="e.signature" [spacing]="e.spacing"></app-rhythm-staff>
        </div>
      }
    </div>

    <h3 class="mt-6 font-semibold text-slate-800">Le pause</h3>
    <p class="mt-1 mb-3 text-sm text-slate-600">
      Il silenzio si scrive con le <strong>pause</strong>. Ogni figura ha la sua pausa, con la stessa durata: nella battuta contano come le note, quindi la somma di
      note e pause deve sempre dare i movimenti dell'indicazione di tempo. Non si lascia mai un buco vuoto.
    </p>
    <div class="space-y-4">
      @for (e of restExamples; track e.title) {
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ e.title }}</div>
          <p class="mb-1 text-sm text-slate-600">{{ e.text }}</p>
          <app-rhythm-staff [items]="e.items" [signature]="e.signature" [spacing]="e.spacing"></app-rhythm-staff>
        </div>
      }
    </div>
    <p class="mt-3 text-sm text-slate-500">Tutte le pause, figura per figura, sono nella tabella di "Valori delle note".</p>
  `,
})
export class StaffAndMeasure {
  protected readonly oneNote: RhythmItem[] = [note('quarter')];

  protected readonly examples: { title: string; text: string; signature: [number, number]; items: RhythmItem[]; spacing: number }[] = [
    {
      title: '4/4',
      text: 'Quattro movimenti da una semiminima: il tempo più comune (detto anche "common time").',
      signature: [4, 4],
      items: [note('quarter'), note('quarter'), note('quarter'), note('quarter')],
      spacing: 52,
    },
    {
      title: '3/4',
      text: 'Tre semiminime per battuta: il tempo del valzer.',
      signature: [3, 4],
      items: [note('quarter'), note('quarter'), note('quarter')],
      spacing: 52,
    },
    {
      title: '2/4',
      text: 'Due semiminime per battuta: il tempo di marcia.',
      signature: [2, 4],
      items: [note('quarter'), note('quarter')],
      spacing: 52,
    },
    {
      title: '6/8',
      text: 'Sei crome per battuta, di solito sentite in due gruppi da tre.',
      signature: [6, 8],
      items: [note('eighth'), note('eighth'), note('eighth'), note('eighth', { breakBefore: true }), note('eighth'), note('eighth')],
      spacing: 42,
    },
  ];

  protected readonly restExamples: { title: string; text: string; signature: [number, number]; items: RhythmItem[]; spacing: number }[] = [
    {
      title: 'Pausa su un movimento',
      text: 'Tre note e una pausa di semiminima: il quarto movimento è silenzio, ma occupa comunque il suo spazio.',
      signature: [4, 4],
      items: [note('quarter'), note('quarter'), note('quarter'), rest('quarter')],
      spacing: 52,
    },
    {
      title: 'Pause diverse nella stessa battuta',
      text: 'Una pausa di croma + una nota di croma valgono una semiminima: è la base del levare.',
      signature: [4, 4],
      items: [note('quarter'), rest('eighth'), note('eighth'), note('quarter'), rest('quarter')],
      spacing: 46,
    },
    {
      title: 'Battuta di silenzio',
      text: 'Una battuta intera senza note si scrive con la pausa di semibreve, in qualsiasi tempo: in 3/4 e in 4/4 si usa lo stesso simbolo, al centro della battuta.',
      signature: [4, 4],
      items: [rest('whole')],
      spacing: 120,
    },
    {
      title: 'Pausa di minima',
      text: 'Due movimenti di silenzio in un colpo solo, per esempio dopo una frase di due note.',
      signature: [4, 4],
      items: [note('quarter'), note('quarter'), rest('half')],
      spacing: 60,
    },
  ];
}
