import { Component, computed } from '@angular/core';
import { Chord, Note } from 'tonal';
import { injectRoot } from './theory-root';

const dim7 = (root: string) => ({ name: `${root}dim7`, notes: Chord.getChord('dim7', root).notes });

/** Passing diminished chords and the diminished chord that stands in for V7b9. */
@Component({
  selector: 'app-passing-chords',
  template: `
    <h2 class="text-xl font-bold text-slate-800">Accordi di passaggio</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">Il diminuito di passaggio e il diminuito che sostituisce il V7♭9.</p>

    <h3 class="font-semibold text-slate-800">Diminuito di passaggio</h3>
    <p class="mt-1 mb-3 text-sm text-slate-600">
      Un accordo dim7 costruito un semitono sotto l'accordo di arrivo collega due accordi i cui bassi distano un tono: il basso sale per semitoni.
    </p>
    <div class="mb-6 space-y-3">
      @for (p of passing(); track p.title) {
        <div>
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ p.title }}</div>
          <div class="mt-1 flex flex-wrap items-center gap-2">
            @for (c of p.chords; track $index) {
              <span class="rounded-lg px-3 py-1.5 text-sm font-semibold shadow" [class.bg-slate-900]="c.highlight" [class.text-white]="c.highlight" [class.bg-white]="!c.highlight" [class.text-slate-700]="!c.highlight">{{ c.name }}</span>
              @if (!$last) { <span class="text-slate-400">→</span> }
            }
          </div>
          <div class="mt-1 text-xs text-slate-400">{{ p.notes }}</div>
        </div>
      }
    </div>

    <h3 class="font-semibold text-slate-800">Diminuito al posto del V7♭9</h3>
    <p class="mt-1 mb-3 text-sm text-slate-600">
      Un V7♭9 senza la fondamentale è un accordo diminuito costruito sulla sua terza. Il dim7 è simmetrico (si ripete ogni 3 semitoni), quindi lo stesso
      accordo si può costruire su terza, quinta, settima o ♭9 del dominante.
    </p>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="rounded-lg bg-slate-50 p-4">
        <div class="text-2xl font-bold text-slate-800">{{ sub().dominant.name }}</div>
        <div class="mt-1 text-sm text-slate-600">{{ sub().dominant.notes.join(' - ') }}</div>
      </div>
      <div class="rounded-lg bg-slate-50 p-4">
        <div class="text-2xl font-bold text-slate-800">{{ sub().dim.name }}</div>
        <div class="mt-1 text-sm text-slate-600">{{ sub().dim.notes.join(' - ') }}</div>
        <div class="mt-1 text-xs text-slate-400">Uguale anche a: {{ sub().same.join(', ') }}</div>
      </div>
    </div>
    <p class="mt-3 text-sm text-slate-600">Progressione: {{ sub().line }}</p>
  `,
})
export class PassingChords {
  private readonly key = injectRoot();

  protected readonly passing = computed(() => {
    const key = this.key();
    const mark = (name: string, highlight = false) => ({ name, highlight });
    const ii = Note.simplify(Note.transpose(key, '2M'));
    const iv = Note.simplify(Note.transpose(key, '4P'));
    const v = Note.simplify(Note.transpose(key, '5P'));
    const sharpI = Note.simplify(Note.transpose(key, '1A'));
    const sharpIV = Note.simplify(Note.transpose(key, '4A'));
    const a = dim7(sharpI);
    const b = dim7(sharpIV);
    return [
      { title: 'I → ♯Idim7 → IIm7', chords: [mark(`${key}maj7`), mark(a.name, true), mark(`${ii}m7`)], notes: `${a.name}: ${a.notes.join(' - ')}` },
      { title: 'IV → ♯IVdim7 → V', chords: [mark(`${iv}maj7`), mark(b.name, true), mark(`${v}7`)], notes: `${b.name}: ${b.notes.join(' - ')}` },
    ];
  });

  protected readonly sub = computed(() => {
    const key = this.key();
    const v = Note.simplify(Note.transpose(key, '5P'));
    const ii = Note.simplify(Note.transpose(key, '2M'));
    const third = Note.simplify(Note.transpose(v, '3M'));
    const dim = dim7(third);
    const same = dim.notes.filter((n) => n !== third).map((n) => `${n}dim7`);
    return {
      dominant: { name: `${v}7♭9`, notes: Chord.getChord('7b9', v).notes },
      dim,
      same,
      line: `${ii}m7 → ${third}dim7 → ${key}maj7 (invece di ${ii}m7 → ${v}7♭9 → ${key}maj7)`,
    };
  });
}
