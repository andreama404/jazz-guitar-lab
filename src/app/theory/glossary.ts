import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Link {
  path: string;
  query: Record<string, string>;
}

interface Term {
  term: string;
  definition: string;
  link?: Link;
}

const topic = (id: string): Link => ({ path: '/theory', query: { topic: id } });
const page = (path: string, query: Record<string, string> = {}): Link => ({ path, query });

const TERMS: Term[] = [
  { term: 'Accordo', definition: 'Tre o più note suonate insieme, di solito costruite sovrapponendo terze.', link: page('/chords') },
  { term: 'Alterazione', definition: 'Segno (♯, ♭, ♮) che alza, abbassa o annulla l\'altezza di una nota. Nei dominanti indica anche le tensioni ♭9, ♯9, ♯11, ♭13.', link: topic('extensions') },
  { term: 'Anatole', definition: 'Giro armonico I - VI - II - V ripetuto, tipico della sezione A dei Rhythm Changes.', link: topic('progressions') },
  { term: 'Armatura di chiave', definition: 'Alterazioni scritte all\'inizio del pentagramma, che indicano la tonalità.', link: topic('circle') },
  { term: 'Arpeggio', definition: 'Le note di un accordo suonate una dopo l\'altra invece che insieme.', link: page('/arpeggios') },
  { term: 'Backbeat', definition: 'Accento sul 2 e sul 4 della battuta, tipico di jazz, blues e rock.', link: topic('beat-upbeat') },
  { term: 'Battere', definition: 'Il movimento forte della battuta, in cui la mano scende.', link: topic('beat-upbeat') },
  { term: 'Battuta (misura)', definition: 'Il tratto di pentagramma tra due stanghette, con un numero fisso di movimenti.', link: topic('staff-and-measure') },
  { term: 'Biscroma', definition: 'Figura che vale 1/32 di semibreve: 8 in un movimento.', link: topic('small-values') },
  { term: 'Blue note', definition: 'La quinta diminuita aggiunta alla pentatonica minore: dà il caratteristico suono blues.', link: topic('blues') },
  { term: 'Blues', definition: 'Forma di 12 battute su I, IV e V (di solito accordi di settima) e scale pentatoniche.', link: topic('blues') },
  { term: 'Cadenza', definition: 'Successione di accordi che conclude una frase, come II - V - I.', link: topic('ii-v-i') },
  { term: 'Campo armonico', definition: 'Gli accordi costruiti su ogni grado di una scala.', link: topic('harmonic-field') },
  { term: 'Circolo delle quinte', definition: 'Disposizione delle dodici tonalità per quinte: ogni passo a destra aggiunge un diesis, a sinistra un bemolle.', link: topic('circle') },
  { term: 'Contrattempo', definition: 'Note suonate sul levare, con la pausa sul battere.', link: topic('syncopation') },
  { term: 'Croma', definition: 'Figura che vale 1/8 di semibreve: metà movimento in 4/4.', link: topic('note-values') },
  { term: 'Diatonico', definition: 'Che appartiene alla scala della tonalità, senza alterazioni estranee.', link: topic('harmonic-field') },
  { term: 'Diminuito di passaggio', definition: 'Accordo dim7 che collega due accordi i cui bassi distano un tono, salendo o scendendo per semitoni.', link: topic('passing') },
  { term: 'Dominante', definition: 'Quinto grado e funzione di tensione: chiede di risolvere sulla tonica.', link: topic('functions') },
  { term: 'Dominante secondaria', definition: 'Accordo di settima di dominante di un grado diverso dal primo (V7/II, V7/III...).', link: topic('secondary-dominants') },
  { term: 'Drop 2', definition: 'Voicing a quattro note ottenuto abbassando di un\'ottava la seconda nota dall\'alto di un accordo in posizione stretta.', link: page('/quadriads') },
  { term: 'Estensione (tensione)', definition: 'Nota oltre la settima aggiunta a un accordo: 9, 11, 13.', link: topic('extensions') },
  { term: 'Funzione armonica', definition: 'Il ruolo di un accordo nel discorso: tonica (riposo), sottodominante (movimento), dominante (tensione).', link: topic('functions') },
  { term: 'Grado', definition: 'Posizione di una nota o di un accordo nella scala (I, II, III...).', link: topic('harmonic-field') },
  { term: 'Intercambio modale', definition: 'Prestito di accordi dal modo parallelo (per esempio dal minore naturale in una tonalità maggiore).', link: topic('modal-interchange') },
  { term: 'Intervallo', definition: 'Distanza tra due note, misurata in gradi e in semitoni.', link: topic('intervals') },
  { term: 'Legatura di valore', definition: 'Curva che unisce due note uguali sommandone la durata.', link: topic('ties-dots') },
  { term: 'Levare', definition: 'Il movimento debole della battuta, in cui la mano sale.', link: topic('beat-upbeat') },
  { term: 'Minima', definition: 'Figura che vale metà semibreve: due movimenti in 4/4.', link: topic('note-values') },
  { term: 'Modo', definition: 'Scala che parte da un grado diverso di una scala madre: dorico, frigio, lidio, misolidio, eolio, locrio.', link: topic('modes') },
  { term: 'Nota caratteristica', definition: 'La nota che distingue un modo dagli altri (per esempio la sesta maggiore nel dorico).', link: topic('modes') },
  { term: 'Pausa', definition: 'Silenzio con la stessa durata della figura corrispondente.', link: topic('note-values') },
  { term: 'Pentagramma', definition: 'Cinque linee e quattro spazi su cui si scrivono le note.', link: topic('staff-and-measure') },
  { term: 'Pentatonica', definition: 'Scala di cinque note, senza semitoni: base del blues e del rock.', link: page('/scales', { type: 'minor-pentatonic' }) },
  { term: 'Progressione', definition: 'Successione di accordi.', link: topic('progressions') },
  { term: 'Punto di valore', definition: 'Punto accanto alla nota che ne aumenta la durata della metà.', link: topic('ties-dots') },
  { term: 'Quadriade', definition: 'Accordo di quattro note (triade più settima).', link: page('/quadriads') },
  { term: 'Relativa minore', definition: 'Tonalità minore con la stessa armatura di una maggiore, sul suo sesto grado (Do maggiore - La minore).', link: topic('circle') },
  { term: 'Rivolto', definition: 'Disposizione di un accordo con una nota diversa dalla fondamentale al basso.', link: page('/triads') },
  { term: 'Semibreve', definition: 'Figura che vale 4 movimenti in 4/4: la più lunga delle figure base.', link: topic('note-values') },
  { term: 'Semicroma', definition: 'Figura che vale 1/16 di semibreve: 4 in un movimento.', link: topic('note-values') },
  { term: 'Semiminima', definition: 'Figura che vale un quarto di semibreve: un movimento in 4/4.', link: topic('note-values') },
  { term: 'Semitono', definition: 'Intervallo più piccolo: un tasto sulla chitarra. Due semitoni fanno un tono.', link: topic('intervals') },
  { term: 'Sensibile', definition: 'Settimo grado della scala maggiore, a un semitono dalla tonica: tende a salire.', link: topic('functions') },
  { term: 'Sincope', definition: 'Nota che inizia su una parte debole e si prolunga sulla forte successiva, spostando l\'accento.', link: topic('syncopation') },
  { term: 'Sostituzione di tritono', definition: 'Sostituzione del V7 con il dominante a un tritono di distanza: stessa terza e settima, basso che scende di semitono.', link: topic('tritone') },
  { term: 'Sottodominante', definition: 'Quarto grado (e secondo) e funzione di allontanamento dalla tonica.', link: topic('functions') },
  { term: 'Swing', definition: 'Suddivisione ineguale delle crome, vicina alla terzina, tipica del jazz.', link: topic('swing') },
  { term: 'Tempo (indicazione)', definition: 'Frazione all\'inizio del pentagramma: il numeratore dice quanti movimenti ha la battuta, il denominatore che figura vale un movimento.', link: topic('staff-and-measure') },
  { term: 'Terzina', definition: 'Tre note nello spazio di due della stessa figura.', link: topic('tuplets') },
  { term: 'Tonalità', definition: 'La scala e l\'accordo di riferimento (tonica) di un brano, con la sua armatura.', link: topic('circle') },
  { term: 'Tonica', definition: 'Primo grado e funzione di riposo: l\'accordo e la nota "di casa".', link: topic('functions') },
  { term: 'Triade', definition: 'Accordo di tre note: tonica, terza e quinta.', link: page('/triads') },
  { term: 'Tritono', definition: 'Intervallo di tre toni (sei semitoni): quarta aumentata o quinta diminuita, il più instabile.', link: topic('tritone') },
  { term: 'Turnaround', definition: 'Breve giro armonico (come I - VI - II - V) che riporta all\'inizio.', link: topic('progressions') },
  { term: 'Voice leading', definition: 'Collegare gli accordi spostando le note il meno possibile.', link: page('/exercises', { category: 'voice-leading' }) },
  { term: 'Voicing', definition: 'Modo di disporre le note di un accordo sulla tastiera.', link: page('/chords') },
];

const normalize = (s: string): string => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Searchable list of the terms used in the theory pages, each linking to the relevant topic. */
@Component({
  selector: 'app-glossary',
  imports: [RouterLink],
  template: `
    <h2 class="text-xl font-bold text-slate-800">Glossario</h2>
    <p class="mt-1 mb-4 text-sm text-slate-500">I termini usati nelle pagine di teoria. Cerca una parola o scorri l'elenco; il link porta all'argomento.</p>

    <input
      type="search"
      class="mb-5 w-full max-w-md rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-900"
      placeholder="Cerca un termine (es. levare, tritono...)"
      [value]="query()"
      (input)="query.set($any($event.target).value)"
    />

    @if (filtered().length === 0) {
      <p class="text-sm text-slate-500">Nessun termine trovato.</p>
    }

    <dl class="space-y-3">
      @for (t of filtered(); track t.term) {
        <div class="rounded-lg bg-slate-50 p-4">
          <dt class="font-semibold text-slate-800">{{ t.term }}</dt>
          <dd class="mt-1 text-sm text-slate-600">{{ t.definition }}</dd>
          @if (t.link; as l) {
            <a [routerLink]="[l.path]" [queryParams]="l.query" class="mt-1 inline-block text-xs text-slate-500 underline hover:text-slate-900">Vai all'argomento</a>
          }
        </div>
      }
    </dl>
  `,
})
export class Glossary {
  protected readonly query = signal('');

  protected readonly filtered = computed(() => {
    const q = normalize(this.query().trim());
    const sorted = [...TERMS].sort((a, b) => a.term.localeCompare(b.term, 'it'));
    return q ? sorted.filter((t) => normalize(t.term).includes(q) || normalize(t.definition).includes(q)) : sorted;
  });
}
