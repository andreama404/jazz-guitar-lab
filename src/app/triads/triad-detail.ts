import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FretboardDiagram } from '../fretboard/fretboard-diagram';
import { TRIADS } from './triads.data';

@Component({
  selector: 'app-triad-detail',
  imports: [FretboardDiagram, RouterLink],
  templateUrl: './triad-detail.html',
})
export class TriadDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly triad = computed(() => TRIADS.find((t) => t.id === this.params().get('id')) ?? null);
}
