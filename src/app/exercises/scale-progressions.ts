import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Note } from 'tonal';
import { findScaleType } from '../scales/scale-theory';
import { PlayButton } from '../shared/play-button';

interface Step {
  interval: string;
  /** Appended to the root: "Bb" + "7♯11". */
  suffix: string;
  roman: string;
  /** Scale to play over this chord (an id of SCALE_TYPES). */
  scale: string;
  /** The chord the exercise is about. */
  featured?: boolean;
}

export interface ScaleProgression {
  id: string;
  /** Scale the exercise develops (an id of SCALE_TYPES). */
  scale: string;
  key: string;
  title: string;
  /** Why the scale fits on the featured chord, one paragraph per item. */
  why: string[];
  steps: Step[];
}

/** For a mode: the scale it belongs to and how far below the mode's root the parent's root lies. */
const PARENTS: Record<string, { parent: string; name: string; below: string }> = {
  major: { parent: 'major', name: 'scala maggiore', below: '1P' },
  dorian: { parent: 'major', name: 'scala maggiore', below: '2M' },
  phrygian: { parent: 'major', name: 'scala maggiore', below: '3M' },
  lydian: { parent: 'major', name: 'scala maggiore', below: '4P' },
  mixolydian: { parent: 'major', name: 'scala maggiore', below: '5P' },
  aeolian: { parent: 'major', name: 'scala maggiore', below: '6M' },
  locrian: { parent: 'major', name: 'scala maggiore', below: '7M' },
  'lydian-dominant': { parent: 'melodic-minor', name: 'minore melodica', below: '4P' },
  altered: { parent: 'melodic-minor', name: 'minore melodica', below: '7M' },
};

const ITALIAN: Record<string, string> = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };

/** "Eb" -> "Mi♭", "F#" -> "Fa♯". */
function italian(note: string): string {
  return (ITALIAN[note[0]] ?? note[0]) + note.slice(1).replace(/b/g, '♭').replace(/#/g, '♯');
}

export const SCALE_PROGRESSIONS: ScaleProgression[] = [
  {
    id: 'lydian-dominant-c',
    scale: 'lydian-dominant',
    key: 'C',
    title: 'Lidia dominante in Do',
    why: [
      'La lidia dominante è una misolidia con la quarta aumentata: 1 2 3 ♯4 5 6 ♭7. È il quarto modo della minore melodica.',
      'Si♭7 è un ♭VII7, il "backdoor": non risolve di quinta ma sale al Do. Non deve creare tensione, quindi non ha bisogno di ♭9 o ♯9: la ♯11 dà un colore sospeso e luminoso.',
      'La ♯11 di Si♭7 è il Mi, cioè la terza di Cmaj7: il collegamento con l\'accordo successivo è naturale.',
    ],
    steps: [
      { interval: '1P', suffix: 'maj7', roman: 'Imaj7', scale: 'major' },
      { interval: '6M', suffix: 'm7', roman: 'VIm7', scale: 'aeolian' },
      { interval: '4P', suffix: 'm7', roman: 'IVm7', scale: 'dorian' },
      { interval: '7m', suffix: '7♯11', roman: '♭VII7♯11', scale: 'lydian-dominant', featured: true },
    ],
  },
  {
    id: 'lydian-dominant-f',
    scale: 'lydian-dominant',
    key: 'F',
    title: 'Lidia dominante in Fa',
    why: [
      'La lidia dominante è una misolidia con la quarta aumentata: 1 2 3 ♯4 5 6 ♭7. È il quarto modo della minore melodica.',
      'Sol♭7 è il sostituto di tritono di Do7, il V di Fa: il basso scende di semitono sul I.',
      'Su un dominante di sostituzione si usa la lidia dominante. Ha le stesse note dell\'alterata di Do7, cioè del dominante originale, ma su Sol♭7 suona più stabile.',
    ],
    steps: [
      { interval: '1P', suffix: 'maj7', roman: 'Imaj7', scale: 'major' },
      { interval: '6M', suffix: 'm7', roman: 'VIm7', scale: 'aeolian' },
      { interval: '2M', suffix: 'm7', roman: 'IIm7', scale: 'dorian' },
      { interval: '2m', suffix: '7♯11', roman: '♭II7♯11', scale: 'lydian-dominant', featured: true },
    ],
  },
  {
    id: 'altered-c',
    scale: 'altered',
    key: 'C',
    title: 'Alterata (superlocria) in Do',
    why: [
      'L\'alterata, o superlocria, è: 1 ♭9 ♯9 3 ♭5 ♯5 ♭7. È il settimo modo della minore melodica: su Sol7 coincide con la minore melodica di La♭, un semitono sopra.',
      'Si usa sul V7 che risolve sul I. Contiene tutte le tensioni alterate (♭9, ♯9, ♭5, ♯5) e conserva la terza e la settima, cioè le note che definiscono il dominante.',
    ],
    steps: [
      { interval: '1P', suffix: 'maj7', roman: 'Imaj7', scale: 'major' },
      { interval: '6M', suffix: 'm7', roman: 'VIm7', scale: 'aeolian' },
      { interval: '2M', suffix: 'm7', roman: 'IIm7', scale: 'dorian' },
      { interval: '5P', suffix: '7alt', roman: 'V7alt', scale: 'altered', featured: true },
    ],
  },
  {
    id: 'altered-f',
    scale: 'altered',
    key: 'F',
    title: 'Alterata (superlocria) in Fa',
    why: [
      'L\'alterata, o superlocria, è: 1 ♭9 ♯9 3 ♭5 ♯5 ♭7. È il settimo modo della minore melodica: su Do7 coincide con la minore melodica di Re♭, un semitono sopra.',
      'Si usa sul V7 che risolve sul I (qui Do7 verso Fa). Contiene tutte le tensioni alterate (♭9, ♯9, ♭5, ♯5) e conserva la terza e la settima.',
    ],
    steps: [
      { interval: '1P', suffix: 'maj7', roman: 'Imaj7', scale: 'major' },
      { interval: '6M', suffix: 'm7', roman: 'VIm7', scale: 'aeolian' },
      { interval: '2M', suffix: 'm7', roman: 'IIm7', scale: 'dorian' },
      { interval: '5P', suffix: '7alt', roman: 'V7alt', scale: 'altered', featured: true },
    ],
  },
];

/** A four-chord progression built to develop one scale: shows which scale goes on each chord, and highlights the chord for the scale to practise. */
@Component({
  selector: 'app-scale-progressions',
  imports: [RouterLink, PlayButton],
  template: `
    <p class="mb-4 text-sm text-slate-500">
      Una progressione semplice di quattro accordi per sviluppare una scala. Su ogni accordo è indicata la scala da usare; quello evidenziato è l'accordo su cui
      usare la scala da sviluppare. Alla fine si ricomincia da capo.
    </p>

    <div class="mb-6 flex flex-wrap gap-2">
      @for (p of progressions; track p.id) {
        <a
          [routerLink]="[]"
          [queryParams]="{ sprog: p.id }"
          queryParamsHandling="merge"
          class="rounded-lg px-3 py-2 text-sm font-semibold shadow transition"
          [class.bg-slate-900]="progression().id === p.id"
          [class.text-white]="progression().id === p.id"
          [class.bg-white]="progression().id !== p.id"
          [class.text-slate-700]="progression().id !== p.id"
        >
          {{ p.title }}
        </a>
      }
    </div>

    <div class="mb-4 flex flex-wrap items-center gap-3">
      <h2 class="text-lg font-bold text-slate-800">{{ progression().title }}</h2>
      <app-play-button mode="progression" [names]="chordNames()" label="Ascolta la progressione"></app-play-button>
    </div>

    <div class="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
      @for (c of chords(); track $index) {
        <div class="rounded-xl bg-white p-3 shadow" [class.ring-2]="c.featured" [class.ring-slate-900]="c.featured">
          <div class="flex items-baseline justify-between gap-2">
            <span class="text-xl font-bold text-slate-800">{{ c.name }}</span>
            <span class="text-xs text-slate-400">{{ c.roman }}</span>
          </div>
          <div class="mt-2 text-xs uppercase tracking-wide text-slate-400">Scala</div>
          <a
            [routerLink]="['/scales']"
            [queryParams]="{ root: c.root, type: c.scale }"
            class="text-sm font-semibold hover:underline"
            [class.text-slate-900]="c.featured"
            [class.text-slate-600]="!c.featured"
          >
            {{ c.root }} {{ c.scaleName }}
          </a>
          <div class="text-xs text-slate-400">({{ c.parent }})</div>
          @if (c.featured) {
            <div class="mt-2 rounded bg-slate-900 px-1.5 py-0.5 text-center text-xs font-semibold text-white">Scala da sviluppare</div>
          }
        </div>
      }
    </div>

    <div class="rounded-xl bg-white p-4 shadow">
      <h3 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Perché questa scala</h3>
      @for (t of progression().why; track $index) {
        <p class="mb-2 text-sm text-slate-600 last:mb-0">{{ t }}</p>
      }
    </div>
  `,
})
export class ScaleProgressions {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  protected readonly progressions = SCALE_PROGRESSIONS;
  protected readonly progression = computed(() => SCALE_PROGRESSIONS.find((p) => p.id === this.params().get('sprog')) ?? SCALE_PROGRESSIONS[0]);

  protected readonly chords = computed(() => {
    const p = this.progression();
    return p.steps.map((s) => {
      const root = Note.simplify(Note.transpose(p.key, s.interval));
      const scale = findScaleType(s.scale);
      const parent = PARENTS[s.scale];
      if (!scale || !parent) throw new Error(`Unknown scale ${s.scale}`);
      const parentRoot = Note.simplify(Note.transpose(root, `-${parent.below}`));
      const own = parent.below === '1P';
      return {
        name: root + s.suffix,
        roman: s.roman,
        root,
        scale: s.scale,
        scaleName: scale.name,
        parent: own ? `scala di ${italian(root)}` : `${parent.name} di ${italian(parentRoot)}`,
        featured: !!s.featured,
      };
    });
  });

  protected readonly chordNames = computed(() => this.chords().map((c) => c.name));
}
