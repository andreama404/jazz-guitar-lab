import { AfterViewInit, Component, ElementRef, OnDestroy, signal, viewChild } from '@angular/core';
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

  protected readonly playerReady = signal(false);
  protected readonly isPlaying = signal(false);

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
    settings.player.playerMode = alphaTab.PlayerMode.EnabledAutomatic;
    settings.player.enableCursor = true;
    settings.player.soundFont = '/assets/alphatab/soundfont/sonivox.sf2';

    this.api = new alphaTab.AlphaTabApi(this.viewPort().nativeElement, settings);
    this.api.playerReady.on(() => this.playerReady.set(true));
    this.api.playerStateChanged.on((e) => this.isPlaying.set(e.state === alphaTab.synth.PlayerState.Playing));

    this.api.tex(String.raw`\title "Alpha Jazz Tabs" \tempo 120 . 3.3 3.3 3.4 3.5 | 3.5 3.4 3.3 3.3 |`);
  }

  protected togglePlay(): void {
    this.api?.playPause();
  }

  protected stop(): void {
    this.api?.stop();
  }

  ngOnDestroy(): void {
    this.api?.destroy();
  }
}
