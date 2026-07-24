import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';
import type * as AlphaTab from '@coderline/alphatab';

@Component({
  selector: 'app-alphatab',
  imports: [],
  templateUrl: './alphatab.html',
  styleUrl: './alphatab.scss',
})
export class Alphatab implements AfterViewInit, OnDestroy {
  readonly scoreFile = input.required<string>();

  private readonly viewPort = viewChild.required<ElementRef<HTMLDivElement>>('alphaTabViewPort');
  private api?: AlphaTab.AlphaTabApi;

  protected readonly playerReady = signal(false);
  protected readonly isPlaying = signal(false);

  constructor() {
    effect(() => {
      const file = this.scoreFile();
      void this.loadScore(file);
    });
  }

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
    settings.display.layoutMode = alphaTab.LayoutMode.Page;
    settings.display.barsPerRow = 4;
    settings.notation.elements.set(alphaTab.NotationElement.BarNumber, false);
    const chordNameFont = settings.display.resources.elementFonts.get(alphaTab.NotationElement.EffectChordNames);
    if (chordNameFont) {
      settings.display.resources.elementFonts.set(alphaTab.NotationElement.EffectChordNames, chordNameFont.withSize(16));
    }
    settings.player.soundFont = '/assets/alphatab/soundfont/sonivox.sf2';

    this.api = new alphaTab.AlphaTabApi(this.viewPort().nativeElement, settings);
    this.api.playerReady.on(() => this.playerReady.set(true));
    this.api.playerStateChanged.on((e) => this.isPlaying.set(e.state === alphaTab.synth.PlayerState.Playing));

    await this.loadScore(this.scoreFile());
  }

  private async loadScore(file: string): Promise<void> {
    if (!this.api) {
      return;
    }
    if (file.endsWith('.alphatex') || file.endsWith('.tex')) {
      const response = await fetch(file);
      const tex = await response.text();
      this.api.tex(tex);
    } else {
      // Binary/XML formats (Guitar Pro, MusicXML, Capella, ...) are auto-detected by
      // alphaTab from the loaded bytes, so the URL can be handed to it directly.
      this.api.load(file);
    }
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
