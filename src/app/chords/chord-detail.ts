import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FretboardDiagram } from '../fretboard/fretboard-diagram';
import { chordMutedStrings, chordToDots } from './chord-diagram.util';
import { CHORDS } from './chords.data';

@Component({
  selector: 'app-chord-detail',
  imports: [FretboardDiagram, RouterLink],
  templateUrl: './chord-detail.html',
})
export class ChordDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly chord = computed(() => CHORDS.find((c) => c.id === this.params().get('id')) ?? null);
  protected readonly dots = computed(() => (this.chord() ? chordToDots(this.chord()!) : []));
  protected readonly muted = computed(() => (this.chord() ? chordMutedStrings(this.chord()!) : []));
}
