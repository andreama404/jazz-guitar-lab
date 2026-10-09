import { Component, ElementRef, HostListener, computed, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import type { SearchEntry } from './search-index';

/** Search box in the top bar: type what you want ("scala Do maggiore") and jump straight to it. */
@Component({
  selector: 'app-site-search',
  template: `
    <div class="relative w-72 max-w-full">
      <input
        #box
        type="text"
        autocomplete="off"
        spellcheck="false"
        placeholder="Cerca… (es. scala Do maggiore)"
        class="w-full rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-slate-400"
        [value]="query()"
        (focus)="onFocus()"
        (input)="onInput($event)"
        (keydown)="onKey($event)"
        (blur)="open.set(false)"
      />
      @if (open() && query().trim()) {
        <div class="absolute right-0 z-50 mt-1 w-96 max-w-[90vw] overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-slate-200">
          @if (results().length) {
            @for (r of results(); track $index) {
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm"
                [class.bg-slate-100]="$index === active()"
                (mousedown)="$event.preventDefault(); go(r)"
                (mouseenter)="active.set($index)"
              >
                <span class="truncate text-slate-800">{{ r.label }}</span>
                <span class="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">{{ r.tag }}</span>
              </button>
            }
          } @else {
            <div class="px-3 py-2 text-sm text-slate-500">Nessun risultato</div>
          }
        </div>
      }
    </div>
  `,
})
export class SiteSearch {
  private readonly router = inject(Router);
  private readonly box = viewChild.required<ElementRef<HTMLInputElement>>('box');

  protected readonly query = signal('');
  protected readonly open = signal(false);
  protected readonly active = signal(0);
  // The index pulls in all the theory data, so it is loaded the first time the box is used.
  private readonly index = signal<typeof import('./search-index') | null>(null);

  protected readonly results = computed<SearchEntry[]>(() => this.index()?.search(this.query()) ?? []);

  /** "/" or Ctrl/Cmd+K focus the search box. */
  @HostListener('document:keydown', ['$event'])
  protected onGlobalKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const typing = !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);
    if ((event.key === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !typing)) {
      event.preventDefault();
      this.box().nativeElement.focus();
      this.box().nativeElement.select();
    }
  }

  protected async onFocus(): Promise<void> {
    this.open.set(true);
    if (!this.index()) this.index.set(await import('./search-index'));
  }

  protected onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.active.set(0);
    this.open.set(true);
  }

  protected onKey(event: KeyboardEvent): void {
    const count = this.results().length;
    if (event.key === 'ArrowDown' && count) {
      event.preventDefault();
      this.active.update((i) => (i + 1) % count);
    } else if (event.key === 'ArrowUp' && count) {
      event.preventDefault();
      this.active.update((i) => (i - 1 + count) % count);
    } else if (event.key === 'Enter') {
      const r = this.results()[this.active()];
      if (r) this.go(r);
    } else if (event.key === 'Escape') {
      this.open.set(false);
      this.box().nativeElement.blur();
    }
  }

  protected go(entry: SearchEntry): void {
    this.router.navigate([entry.path], { queryParams: entry.params });
    this.query.set('');
    this.open.set(false);
    this.box().nativeElement.blur();
  }
}
