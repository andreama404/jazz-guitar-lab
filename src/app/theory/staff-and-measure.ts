import { Component } from '@angular/core';
import { RhythmItem, RhythmStaff, note } from './rhythm-staff';

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
}
