import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ChordType, QUADRIAD_TYPES, TRIAD_TYPES, buildChord, findChordType } from '../chords/chord-theory';
import { FretboardNeck } from '../fretboard/fretboard-neck';
import { ROOTS } from '../scales/scale-theory';
import { RootPicker } from '../shared/root-picker';
import { SearchSelect, SelectOption } from '../shared/search-select';
import { buildArpeggioPositions, buildDrop2Voicings, buildTriadVoicings } from './voicing-generator';

type LabelMode = 'note' | 'interval';
type Kind = 'triads' | 'quadriads' | 'arpeggios';

interface KindConfig {
  title: string;
  intro: string;
  typeLabel: string;
  types: readonly ChordType[];
  note: string;
  build: typeof buildTriadVoicings;
}

const KINDS: Record<Kind, KindConfig> = {
  triads: {
    title: 'Triadi',
    intro: 'Scegli la nota e il tipo di triade: tutti i rivolti sui quattro gruppi di tre corde vengono calcolati.',
    typeLabel: 'Tipo di triade',
    types: TRIAD_TYPES,
    note: 'Rivolti in posizione stretta su tre corde adiacenti.',
    build: buildTriadVoicings,
  },
  quadriads: {
    title: 'Quadriadi',
    intro: 'Scegli la nota e il tipo di quadriade: i voicing drop 2 sui tre gruppi di quattro corde vengono calcolati.',
    typeLabel: 'Tipo di quadriade',
    types: QUADRIAD_TYPES,
    note: 'Voicing drop 2 su quattro corde adiacenti, in tutti i rivolti.',
    build: buildDrop2Voicings,
  },
  arpeggios: {
    title: 'Arpeggi',
    intro: 'Scegli la nota e il tipo di arpeggio: le note dell\'accordo vengono distribuite sulla tastiera in più posizioni.',
    typeLabel: 'Tipo di arpeggio',
    types: [...TRIAD_TYPES, ...QUADRIAD_TYPES],
    note: 'Ogni posizione parte da una nota dell\'accordo sulla 6ª corda.',
    build: buildArpeggioPositions,
  },
};

/** Root + chord type picker with generated voicings; used by both the triads and quadriads routes. */
@Component({
  selector: 'app-voicing-page',
  imports: [FretboardNeck, RootPicker, SearchSelect],
  templateUrl: './voicing-page.html',
})
export class VoicingPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });

  private readonly kindName = (this.route.snapshot.data['kind'] as Kind | undefined) ?? 'triads';
  protected readonly config = KINDS[this.kindName];
  protected readonly typeOptions: SelectOption[] = this.config.types.map((t) => ({
    id: t.id,
    label: `${t.name} (${t.symbol})`,
    keywords: t.symbol,
    group: this.kindName === 'arpeggios' ? (TRIAD_TYPES.includes(t) ? 'Triadi' : 'Quadriadi') : undefined,
  }));
  protected readonly labelMode = signal<LabelMode>('note');

  protected readonly root = computed(() => {
    const root = this.params().get('root');
    return root !== null && ROOTS.includes(root) ? root : ROOTS[0];
  });

  protected readonly type = computed(() => findChordType(this.params().get('type'), this.config.types) ?? this.config.types[0]);

  protected readonly chord = computed(() => {
    const root = this.root();
    const type = this.type();
    return root && type ? buildChord(type, root) : null;
  });

  protected readonly groups = computed(() => {
    const chord = this.chord();
    if (!chord) return [];
    const labels = this.labelMode() === 'note' ? chord.notes : chord.intervals.map((interval, i) => (i === 0 ? 'R' : interval));
    return this.config.build(chord, labels, `${chord.type.id}-${chord.root}`);
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
