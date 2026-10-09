import { Component, computed, effect, input, output, signal } from '@angular/core';

export interface SelectOption {
  id: string;
  label: string;
  /** Options with the same group are listed together under a heading. */
  group?: string;
  /** Extra text matched by the search, besides the label. */
  keywords?: string;
}

let nextId = 0;

/** Dropdown with search-as-you-type: type to filter, arrows + Enter or click to choose. */
@Component({
  selector: 'app-search-select',
  imports: [],
  templateUrl: './search-select.html',
  host: { class: 'relative block' },
})
export class SearchSelect {
  readonly options = input.required<readonly SelectOption[]>();
  readonly selectedId = input<string | null>(null);
  readonly label = input('');
  readonly placeholder = input('Cerca...');
  readonly emptyText = input('Nessun risultato');
  readonly picked = output<string>();

  protected readonly uid = `search-select-${nextId++}`;
  protected readonly inputText = signal('');
  protected readonly filterText = signal('');
  protected readonly open = signal(false);
  protected readonly active = signal(0);

  protected readonly selected = computed(() => this.options().find((o) => o.id === this.selectedId()) ?? null);

  protected readonly filtered = computed(() => {
    const query = normalize(this.filterText());
    return query ? this.options().filter((o) => normalize(`${o.label} ${o.keywords ?? ''}`).includes(query)) : this.options();
  });

  constructor() {
    // keep the text box in sync with the selection (deep links, back/forward)
    effect(() => {
      this.inputText.set(this.selected()?.label ?? '');
    });
  }

  protected onFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
    this.filterText.set('');
    this.openList();
  }

  protected openList(): void {
    const index = this.filtered().findIndex((o) => o.id === this.selectedId());
    this.active.set(Math.max(index, 0));
    this.open.set(true);
  }

  protected onInput(value: string): void {
    this.inputText.set(value);
    this.filterText.set(value);
    this.active.set(0);
    this.open.set(true);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const count = this.filtered().length;
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
        const option = this.filtered()[this.active()];
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
    this.inputText.set(this.selected()?.label ?? '');
  }

  protected pick(option: SelectOption): void {
    this.open.set(false);
    this.inputText.set(option.label);
    this.picked.emit(option.id);
  }
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
