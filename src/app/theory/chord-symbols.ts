import { Component, computed } from '@angular/core';
import { Chord } from 'tonal';
import { injectRoot } from './theory-root';

interface Symbol {
  name: string;
  tonal: string;
  /** Written forms; "C" stands for the root. */
  forms: string[];
}

const SYMBOLS: Symbol[] = [
  { name: 'Maggiore', tonal: 'M', forms: ['C', 'CM', 'Cmaj'] },
  { name: 'Minore', tonal: 'm', forms: ['Cm', 'C-', 'Cmin'] },
  { name: 'Diminuita', tonal: 'dim', forms: ['C°', 'Cdim'] },
  { name: 'Aumentata', tonal: 'aug', forms: ['C+', 'Caug', 'C(♯5)'] },
  { name: 'Settima di dominante', tonal: '7', forms: ['C7'] },
  { name: 'Settima maggiore', tonal: 'maj7', forms: ['Cmaj7', 'CM7', 'CΔ', 'CΔ7'] },
  { name: 'Minore settima', tonal: 'm7', forms: ['Cm7', 'C-7', 'Cmin7'] },
  { name: 'Semidiminuita', tonal: 'm7b5', forms: ['Cø', 'Cø7', 'Cm7♭5'] },
  { name: 'Diminuita settima', tonal: 'dim7', forms: ['C°7', 'Cdim7'] },
  { name: 'Minore con settima maggiore', tonal: 'mMaj7', forms: ['Cm(maj7)', 'C-Δ', 'Cm(Δ7)'] },
  { name: 'Sesta', tonal: '6', forms: ['C6', 'C6'] },
  { name: 'Dominante con ♭9', tonal: '7b9', forms: ['C7♭9', 'C7(♭9)'] },
  { name: 'Sospesa di quarta', tonal: 'sus4', forms: ['Csus4', 'Csus'] },
];

/** How chord symbols are written and read: Δ, ø, °, − and the other common forms. */
@Component({
  selector: 'app-chord-symbols',
  template: `
    <h2 class="text-xl font-bold text-slate-800">Cifratura degli accordi</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">Ogni accordo può essere scritto in più modi, a seconda dello stile dello spartito.</p>
    <ul class="mb-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
      <li><strong>Δ</strong> indica la settima maggiore (CΔ = Cmaj7).</li>
      <li><strong>−</strong> indica il minore (C−7 = Cm7).</li>
      <li><strong>°</strong> indica la diminuita; con il 7 (C°7) è la diminuita settima.</li>
      <li><strong>ø</strong> indica la semidiminuita (Cø = Cm7♭5).</li>
      <li><strong>+</strong> indica la quinta aumentata.</li>
      <li>Le alterazioni si scrivono dopo il numero, spesso tra parentesi: C7(♭9), C7(♯11).</li>
    </ul>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th class="py-2 pr-4">Accordo</th>
            <th class="py-2 pr-4">Come si scrive</th>
            <th class="py-2">Note</th>
          </tr>
        </thead>
        <tbody>
          @for (s of rows(); track s.name) {
            <tr class="border-b border-slate-100">
              <td class="py-2 pr-4 text-slate-600">{{ s.name }}</td>
              <td class="py-2 pr-4 font-semibold text-slate-800">{{ s.forms.join('  ·  ') }}</td>
              <td class="py-2 text-slate-600">{{ s.notes }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class ChordSymbols {
  private readonly root = injectRoot();

  protected readonly rows = computed(() => {
    const root = this.root();
    return SYMBOLS.map((s) => ({
      name: s.name,
      forms: [...new Set(s.forms)].map((f) => root + f.slice(1)),
      notes: Chord.getChord(s.tonal, root).notes.join(' - '),
    }));
  });
}
