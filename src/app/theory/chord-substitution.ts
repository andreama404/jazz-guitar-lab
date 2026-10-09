import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChordItem, ChordLine, chordAt } from './chord-line';

const KEYS = ['C', 'F', 'Bb'];

/** The same I - VI - II - V progression with different chord substitutions applied one at a time. */
function buildSteps(key: string) {
  const c = (interval: string, suffix: string, roman: string, highlight = false): ChordItem => chordAt(key, interval, suffix, roman, highlight);
  const I = c('1P', 'maj7', 'Imaj7');
  const VI = c('6M', 'm7', 'VIm7');
  const II = c('2M', 'm7', 'IIm7');
  const V = c('5P', '7', 'V7');

  const iii = c('3M', 'm7', 'IIIm7', true);
  const iv = c('4P', 'maj7', 'IVmaj7', true);
  const subV = c('2m', '7', '♭II7 (subV)', true);
  const v7ii = c('6M', '7', 'V7/II', true);
  const dimPass = c('1A', 'dim7', '♯Idim7', true);
  const bVI = c('6m', 'maj7', '♭VImaj7', true);
  const iiHalf = c('2M', 'm7♭5', 'IIm7♭5', true);

  return {
    base: [[I], [VI], [II], [V]],
    steps: [
      {
        title: 'Sostituzione diatonica',
        text: `Si scambia un accordo con un altro della stessa tonalità che ha la stessa funzione: ${I.name} con ${iii.name} (tonica), ${II.name} con ${iv.name} (sottodominante).`,
        bars: [[iii], [VI], [iv], [V]],
      },
      {
        title: 'Sostituzione di tritono',
        text: `Il V7 (${V.name}) diventa il dominante a un tritono di distanza (${subV.name}): condividono terza e settima e il basso scende di semitono verso il I.`,
        bars: [[I], [VI], [II], [subV]],
      },
      {
        title: 'Dominante secondaria',
        text: `Il VIm7 diventa ${v7ii.name}, il V7 del II: crea una spinta verso ${II.name} come se fosse la nuova tonica.`,
        bars: [[I], [v7ii], [II], [V]],
      },
      {
        title: 'II-V secondario',
        text: `Prima della dominante secondaria si mette il suo II: ${iii.name} - ${v7ii.name} prepara ${II.name} con una cadenza completa.`,
        bars: [[I], [iii, v7ii], [II], [V]],
      },
      {
        title: 'Diminuito di passaggio',
        text: `Il VIm7 diventa ${dimPass.name}, un diminuito che collega ${I.name} a ${II.name} salendo per semitoni.`,
        bars: [[I], [dimPass], [II], [V]],
      },
      {
        title: 'Intercambio modale',
        text: `Accordi presi dal modo parallelo (${key} minore): ${bVI.name} (♭VI) al posto di ${VI.name} e ${iiHalf.name} al posto di ${II.name}.`,
        bars: [[I], [bVI], [iiHalf], [V]],
      },
      {
        title: 'Tutto insieme',
        text: 'Combinando più sostituzioni: il II-V secondario, il subV e il ritorno alla tonica.',
        bars: [[I], [iii, v7ii], [II, c('2m', '7', '♭II7', true)], [I]],
      },
    ],
  };
}

/** Chord substitution examples on a progression in C, F or B♭. */
@Component({
  selector: 'app-chord-substitution',
  imports: [ChordLine, RouterLink],
  template: `
    <h2 class="text-xl font-bold text-slate-800">Sostituzione di accordi</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      Una progressione semplice, rielaborata con le principali tecniche di sostituzione. In scuro gli accordi cambiati rispetto all'originale.
    </p>

    <div class="mb-6 flex flex-wrap gap-2">
      @for (k of keys; track k) {
        <a
          [routerLink]="[]"
          [queryParams]="{ key: k }"
          queryParamsHandling="merge"
          class="min-w-12 rounded-lg px-3 py-2 text-center text-sm font-semibold shadow transition"
          [class.bg-slate-900]="key() === k"
          [class.text-white]="key() === k"
          [class.bg-slate-50]="key() !== k"
          [class.text-slate-700]="key() !== k"
        >
          {{ k }}
        </a>
      }
    </div>

    <div class="mb-6">
      <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Progressione di partenza (I - VI - II - V)</div>
      <div class="mt-1"><app-chord-line [bars]="example().base"></app-chord-line></div>
    </div>

    <div class="space-y-5">
      @for (s of example().steps; track s.title) {
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ s.title }}</div>
          <p class="mb-1 text-sm text-slate-600">{{ s.text }}</p>
          <app-chord-line [bars]="s.bars"></app-chord-line>
        </div>
      }
    </div>
  `,
})
export class ChordSubstitution {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly keys = KEYS;
  protected readonly key = computed(() => {
    const k = this.params().get('key');
    return k !== null && KEYS.includes(k) ? k : KEYS[0];
  });
  protected readonly example = computed(() => buildSteps(this.key()));
}
