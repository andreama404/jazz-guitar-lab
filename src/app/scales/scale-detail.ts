import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FretboardDiagram } from '../fretboard/fretboard-diagram';
import { SCALES } from './scales.data';

@Component({
  selector: 'app-scale-detail',
  imports: [FretboardDiagram, RouterLink],
  templateUrl: './scale-detail.html',
})
export class ScaleDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly scale = computed(() => SCALES.find((s) => s.id === this.params().get('id')) ?? null);
}
