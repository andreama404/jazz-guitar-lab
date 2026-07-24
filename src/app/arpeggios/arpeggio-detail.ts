import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FretboardDiagram } from '../fretboard/fretboard-diagram';
import { ARPEGGIOS } from './arpeggios.data';

@Component({
  selector: 'app-arpeggio-detail',
  imports: [FretboardDiagram, RouterLink],
  templateUrl: './arpeggio-detail.html',
})
export class ArpeggioDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly arpeggio = computed(() => ARPEGGIOS.find((a) => a.id === this.params().get('id')) ?? null);
}
