import { Component, computed } from '@angular/core';
import { Note, Scale } from 'tonal';
import { ChordLine, chordAt } from './chord-line';
import { injectRoot } from './theory-root';

/** Tonic, subdominant and dominant functions, and why V resolves to I. */
@Component({
  selector: 'app-functions',
  imports: [ChordLine],
  template: `
    <h2 class="text-xl font-bold text-slate-800">Funzioni armoniche</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">
      Gli accordi di una tonalità si raggruppano in tre funzioni, secondo il ruolo che hanno nel discorso armonico: riposo, allontanamento, tensione.
    </p>

    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      @for (f of functions(); track f.name) {
        <div class="rounded-lg bg-slate-50 p-4">
          <div class="text-lg font-bold text-slate-800">{{ f.name }}</div>
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ f.role }}</div>
          <p class="mt-2 text-sm text-slate-600">{{ f.text }}</p>
          <div class="mt-2 text-sm font-semibold text-slate-800">{{ f.chords }}</div>
        </div>
      }
    </div>

    <h3 class="font-semibold text-slate-800">Come si muovono</h3>
    <p class="mt-1 mb-3 text-sm text-slate-600">
      Il percorso più naturale è tonica → sottodominante → dominante → tonica. Dalla tonica si può andare dove si vuole; dalla sottodominante si va verso la
      dominante o si torna alla tonica; la dominante vuole risolvere sulla tonica. Il movimento contrario (dominante → sottodominante) è meno frequente.
    </p>
    <app-chord-line [bars]="[example()]"></app-chord-line>

    <h3 class="mt-6 font-semibold text-slate-800">Perché il V risolve sul I</h3>
    <p class="mt-1 mb-3 text-sm text-slate-600">
      Il V7 ({{ v().name }}) contiene due note instabili che hanno una direzione precisa, tutte e due di semitono:
    </p>
    <ul class="mb-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
      <li>
        la <strong>sensibile</strong> ({{ v().third }}, terza del V7) sale alla tonica {{ key() }};
      </li>
      <li>
        la <strong>settima</strong> ({{ v().seventh }}) scende alla terza del I ({{ v().tonicThird }});
      </li>
      <li>
        la <strong>fondamentale</strong> ({{ v().root }}) scende di quinta (o sale di quarta) alla tonica {{ key() }}.
      </li>
    </ul>
    <p class="text-sm text-slate-600">
      Il tritono tra {{ v().third }} e {{ v().seventh }} è l'intervallo più instabile della tonalità, e si scioglie nell'intervallo stabile di terza tra
      {{ key() }} e {{ v().tonicThird }}. La sottodominante prepara questo punto: il II e il IV portano la sensibile e la settima in tensione o si muovono per grado verso
      il V.
    </p>
  `,
})
export class Functions {
  protected readonly key = injectRoot();

  protected readonly functions = computed(() => {
    const n = Scale.get(`${this.key()} major`).notes;
    return [
      { name: 'Tonica (T)', role: 'Riposo', text: 'Stabilità, casa. Il I è la tonica piena; VI e III la rappresentano con meno forza.', chords: `${n[0]}maj7 · ${n[5]}m7 · ${n[2]}m7` },
      { name: 'Sottodominante (S)', role: 'Allontanamento', text: 'Movimento, apertura. Si allontana dalla tonica senza creare una tensione forte.', chords: `${n[3]}maj7 · ${n[1]}m7` },
      { name: 'Dominante (D)', role: 'Tensione', text: 'Instabilità che chiede di risolvere sulla tonica. Il VII ne è una versione senza fondamentale.', chords: `${n[4]}7 · ${n[6]}m7♭5` },
    ];
  });

  protected readonly example = computed(() => {
    const k = this.key();
    return [
      chordAt(k, '1P', 'maj7', 'I · T'),
      chordAt(k, '4P', 'maj7', 'IV · S'),
      chordAt(k, '5P', '7', 'V · D', true),
      chordAt(k, '1P', 'maj7', 'I · T'),
    ];
  });

  protected readonly v = computed(() => {
    const k = this.key();
    const root = Note.simplify(Note.transpose(k, '5P'));
    return {
      name: `${root}7`,
      root,
      third: Note.simplify(Note.transpose(root, '3M')),
      seventh: Note.simplify(Note.transpose(root, '7m')),
      tonicThird: Note.simplify(Note.transpose(k, '3M')),
    };
  });
}
