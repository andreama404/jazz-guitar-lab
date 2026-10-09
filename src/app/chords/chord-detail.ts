import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FretboardNeck } from '../fretboard/fretboard-neck';
import { ROOTS } from '../scales/scale-theory';
import { RootPicker } from '../shared/root-picker';
import { SearchSelect, SelectOption } from '../shared/search-select';
import { CHORD_TYPES, buildChord, findChordType } from './chord-theory';
import { buildChordVoicings } from './chord-voicings';

type LabelMode = 'note' | 'interval';

@Component({
  selector: 'app-chord-detail',
  imports: [FretboardNeck, RootPicker, SearchSelect],
  templateUrl: './chord-detail.html',
})
export class ChordDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly typeOptions: SelectOption[] = CHORD_TYPES.map((t) => ({ id: t.id, label: `${t.name} (${t.symbol})`, keywords: t.symbol }));
  protected readonly labelMode = signal<LabelMode>('note');

  protected readonly root = computed(() => {
    const root = this.params().get('root');
    return root !== null && ROOTS.includes(root) ? root : ROOTS[0];
  });

  protected readonly type = computed(() => findChordType(this.params().get('type')) ?? CHORD_TYPES[0]);

  protected readonly chord = computed(() => {
    const root = this.root();
    const type = this.type();
    return root && type ? buildChord(type, root) : null;
  });

  protected readonly voicings = computed(() => {
    const chord = this.chord();
    if (!chord) return [];
    const labels = this.labelMode() === 'note' ? chord.notes : chord.intervals.map((interval, i) => (i === 0 ? 'R' : interval));
    return buildChordVoicings(chord.type.id, chord.notes, labels, `${chord.type.id}-${chord.root}`);
  });

  protected setLabelMode(mode: LabelMode): void {
    this.labelMode.set(mode);
  }

  protected pickType(id: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: id },
      queryParamsHandling: 'merge',
    });
  }
}
