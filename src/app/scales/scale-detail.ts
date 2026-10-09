import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FretboardNeck } from '../fretboard/fretboard-neck';
import { buildCagedMajorForms } from '../fretboard/caged-major';
import { buildPositions } from '../fretboard/fretboard-map';
import { ROOTS, SCALE_TYPES, ScaleType, buildScale, findScaleType, scaleFormula } from './scale-theory';

type LabelMode = 'note' | 'interval';

@Component({
  selector: 'app-scale-detail',
  imports: [FretboardNeck, RouterLink],
  templateUrl: './scale-detail.html',
})
export class ScaleDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly roots = ROOTS;
  protected readonly labelMode = signal<LabelMode>('note');

  protected readonly type = computed(() => findScaleType(this.params().get('type')));

  protected readonly root = computed(() => {
    const root = this.params().get('root');
    return root !== null && ROOTS.includes(root) ? root : null;
  });

  // --- scale combobox (search + dropdown) ---
  protected readonly inputText = signal('');
  protected readonly filterText = signal('');
  protected readonly open = signal(false);
  protected readonly active = signal(0);

  protected readonly options = computed<readonly ScaleType[]>(() => {
    const q = normalize(this.filterText());
    return q ? SCALE_TYPES.filter((t) => normalize(`${t.name} ${t.tonalName}`).includes(q)) : SCALE_TYPES;
  });

  constructor() {
    // keep the text box in sync with the selected scale (deep links, back/forward)
    effect(() => {
      this.inputText.set(this.type()?.name ?? '');
    });
  }

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
    return result.type.cagedMajor
      ? buildCagedMajorForms(result.notes, labels, prefix)
      : buildPositions(result.notes, labels, prefix, result.type.coreDegrees, result.type.formNames);
  });

  protected setLabelMode(mode: LabelMode): void {
    this.labelMode.set(mode);
  }

  protected onFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
    this.filterText.set('');
    this.openList();
  }

  protected openList(): void {
    const selected = this.options().findIndex((t) => t.id === this.type()?.id);
    this.active.set(Math.max(selected, 0));
    this.open.set(true);
  }

  protected onInput(value: string): void {
    this.inputText.set(value);
    this.filterText.set(value);
    this.active.set(0);
    this.open.set(true);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.options().length;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.open()) this.openList();
        else this.active.set(Math.min(this.active() + 1, count - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.active.set(Math.max(this.active() - 1, 0));
        break;
      case 'Enter': {
        const option = this.options()[this.active()];
        if (this.open() && option) {
          event.preventDefault();
          this.pick(option);
        }
        break;
      }
      case 'Escape':
        this.close();
        break;
    }
  }

  protected close(): void {
    this.open.set(false);
    this.inputText.set(this.type()?.name ?? '');
  }

  protected pick(type: ScaleType): void {
    this.open.set(false);
    this.inputText.set(type.name);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: type.id },
      queryParamsHandling: 'merge',
    });
  }
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
