import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FretboardNeck } from '../fretboard/fretboard-neck';
import { buildFixedForms } from '../fretboard/fixed-forms';
import { buildPositions } from '../fretboard/fretboard-map';
import { RootPicker } from '../shared/root-picker';
import { SearchSelect, SelectOption } from '../shared/search-select';
import { ROOTS, SCALE_TYPES, buildScale, findScaleType, scaleFormula } from './scale-theory';

type LabelMode = 'note' | 'interval';

@Component({
  selector: 'app-scale-detail',
  imports: [FretboardNeck, RootPicker, SearchSelect],
  templateUrl: './scale-detail.html',
})
export class ScaleDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly labelMode = signal<LabelMode>('note');

  protected readonly type = computed(() => findScaleType(this.params().get('type')) ?? SCALE_TYPES[0]);

  protected readonly root = computed(() => {
    const root = this.params().get('root');
    return root !== null && ROOTS.includes(root) ? root : ROOTS[0];
  });

  protected readonly typeOptions: SelectOption[] = SCALE_TYPES.map((t) => ({
    id: t.id,
    label: t.name,
    group: t.family,
    keywords: t.tonalName,
  }));

  protected readonly formula = computed(() => {
    const type = this.type();
    return type ? scaleFormula(type) : '';
  });

  protected readonly result = computed(() => {
    const type = this.type();
    const root = this.root();
    return type && root ? buildScale(type, root) : null;
  });

  protected readonly positions = computed(() => {
    const result = this.result();
    if (!result) return [];
    const labels = this.labelMode() === 'note' ? result.notes : result.degrees.map((d, i) => (i === 0 ? 'R' : d.interval));
    const prefix = `${result.type.id}-${result.root}`;
    return result.type.fixedForms
      ? buildFixedForms(result.type.fixedForms, result.notes, labels, prefix)
      : buildPositions(result.notes, labels, prefix, result.type.coreDegrees, result.type.formNames);
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
