import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FretboardDiagram } from '../fretboard/fretboard-diagram';
import { QUADRIADS } from './quadriads.data';

@Component({
  selector: 'app-quadriad-detail',
  imports: [FretboardDiagram, RouterLink],
  templateUrl: './quadriad-detail.html',
})
export class QuadriadDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly chord = computed(() => QUADRIADS.find((q) => q.id === this.params().get('id')) ?? null);
}
