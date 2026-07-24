import { AfterViewInit, Component, ElementRef, OnDestroy, viewChild } from '@angular/core';
import type * as AlphaTab from '@coderline/alphatab';

@Component({
  selector: 'app-alphatab',
  imports: [],
  templateUrl: './alphatab.html',
  styleUrl: './alphatab.scss',
})
export class Alphatab implements AfterViewInit, OnDestroy {
  private readonly viewPort = viewChild.required<ElementRef<HTMLDivElement>>('alphaTabViewPort');
  private api?: AlphaTab.AlphaTabApi;

  ngAfterViewInit(): void {
    void this.initAlphaTab();
  }

  private async initAlphaTab(): Promise<void> {
    // Loaded from the public asset copy (not the bundled npm import) so that alphaTab's
    // internal `import.meta.url` resolves next to the worker/font/soundfont files we copied
    // into /assets/alphatab, instead of into Angular's own bundled main.js chunk.
    const assetUrl = new URL('/assets/alphatab/alphaTab.mjs', document.baseURI).href;
    const alphaTab = (await import(/* @vite-ignore */ assetUrl)) as typeof AlphaTab;

    const settings = new alphaTab.Settings();
    settings.player.enablePlayer = true;
    settings.player.enableCursor = true;
    settings.player.soundFont = '/assets/alphatab/soundfont/sonivox.sf2';

    this.api = new alphaTab.AlphaTabApi(this.viewPort().nativeElement, settings);
    this.api.tex(String.raw`\title "Alpha Jazz Tabs" \tempo 120 . 3.3 3.3 3.4 3.5 | 3.5 3.4 3.3 3.3 |`);
  }

  ngOnDestroy(): void {
    this.api?.destroy();
  }
}
