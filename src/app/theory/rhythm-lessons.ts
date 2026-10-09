import { RhythmItem, note, rest } from './rhythm-staff';

export interface RhythmExample {
  title: string;
  text?: string;
  signature: [number, number] | null;
  items: RhythmItem[];
  spacing: number;
}

export interface RhythmLesson {
  id: string;
  title: string;
  summary: string;
  intro: string;
  bullets: string[];
  examples: RhythmExample[];
}

/** `count` notes of the same value, built by `make(i)`. */
const rep = (count: number, make: (i: number) => RhythmItem): RhythmItem[] => Array.from({ length: count }, (_, i) => make(i));
const quarters = (count: number): RhythmItem[] => rep(count, () => note('quarter'));

export const RHYTHM_LESSONS: RhythmLesson[] = [
  {
    id: 'tuplets',
    title: 'Terzine e gruppi irregolari',
    summary: 'Dividere un movimento in tre, cinque o sei parti uguali.',
    intro:
      'Una terzina suona tre note nello spazio normalmente occupato da due della stessa figura. Si indica con una parentesi e il numero 3. Allo stesso modo la quintina mette cinque note al posto di quattro e la sestina sei al posto di quattro.',
    bullets: [
      'Terzina di crome: tre crome in un movimento (due crome normali).',
      'Terzina di semiminime: tre semiminime in due movimenti.',
      'Quintina e sestina di semicrome: cinque o sei semicrome in un movimento.',
      'Si contano dando a ogni gruppo lo stesso peso: "1 tri-ple, 2 tri-ple".',
    ],
    examples: [
      {
        title: 'Terzina di crome (2/4)',
        signature: [2, 4],
        spacing: 36,
        items: rep(6, (i) => note('eighth', { breakBefore: i === 3, tuplet: i % 3 === 0 ? { label: '3', span: 3 } : undefined, label: ['1', 'tri', 'ple', '2', 'tri', 'ple'][i] })),
      },
      {
        title: 'Terzina di semiminime (4/4)',
        text: 'Tre semiminime occupano due movimenti, poi due semiminime normali.',
        signature: [4, 4],
        spacing: 48,
        items: [note('quarter', { tuplet: { label: '3', span: 3 } }), note('quarter'), note('quarter'), note('quarter'), note('quarter')],
      },
      {
        title: 'Quintina di semicrome (4/4)',
        signature: [4, 4],
        spacing: 40,
        items: [...rep(5, (i) => note('sixteenth', { tuplet: i === 0 ? { label: '5', span: 5 } : undefined })), ...quarters(3)],
      },
      {
        title: 'Sestina di semicrome (4/4)',
        signature: [4, 4],
        spacing: 38,
        items: [...rep(6, (i) => note('sixteenth', { tuplet: i === 0 ? { label: '6', span: 6 } : undefined })), ...quarters(3)],
      },
    ],
  },
  {
    id: 'syncopation',
    title: 'Sincope e contrattempo',
    summary: 'Note che cadono sui tempi deboli e si prolungano sui forti.',
    intro:
      'Nel contrattempo le note cadono sul levare (la parte debole del movimento), con una pausa sul battere. Nella sincope una nota inizia su una parte debole e si prolunga oltre il tempo forte successivo, spostando l\'accento.',
    bullets: [
      'Contrattempo: pausa sul battere, nota sul levare ("e").',
      'Sincope: la nota inizia sul levare e continua sul tempo successivo.',
      'La sincope si può scrivere con una nota lunga oppure con una legatura.',
      'Conta sempre a voce alta "1 e 2 e 3 e 4 e".',
    ],
    examples: [
      {
        title: 'Contrattempo',
        signature: [4, 4],
        spacing: 40,
        items: rep(8, (i) => (i % 2 === 0 ? rest('eighth', { label: String(i / 2 + 1) }) : note('eighth', { label: 'e', accent: true }))),
      },
      {
        title: 'Sincope: croma - semiminima - croma',
        signature: [4, 4],
        spacing: 46,
        items: [note('eighth', { label: '1' }), note('quarter', { label: 'e' }), note('eighth', { label: 'e' }), note('eighth', { label: '3' }), note('quarter', { label: 'e' }), note('eighth', { label: 'e' })],
      },
      {
        title: 'Sincope con minima',
        text: 'La minima inizia sul levare del primo movimento e arriva fino al levare del terzo.',
        signature: [4, 4],
        spacing: 52,
        items: [note('eighth', { label: '1' }), note('half', { label: 'e' }), note('eighth', { label: 'e' }), note('quarter', { label: '4' })],
      },
    ],
  },
  {
    id: 'ties-dots',
    title: 'Legature e punto doppio',
    summary: 'Come sommare le durate e allungare le note.',
    intro:
      'La legatura di valore unisce due note della stessa altezza: si suona una nota sola, con la durata della somma. È l\'unico modo di prolungare una nota oltre la stanghetta. Il punto doppio aggiunge alla nota metà del suo valore più un quarto.',
    bullets: [
      'Legatura di valore: minima + semiminima = 3 movimenti.',
      'Primo punto: + 1/2 del valore. Secondo punto: + 1/4 del valore.',
      'Minima col doppio punto: 2 + 1 + 1/2 = 3 e mezzo.',
      'Anche le pause possono avere il punto.',
    ],
    examples: [
      {
        title: 'Minima legata a una semiminima',
        signature: [4, 4],
        spacing: 56,
        items: [note('half', { tie: true }), note('quarter'), note('quarter')],
      },
      {
        title: 'Minima col doppio punto + croma',
        text: '3 movimenti e mezzo, più mezzo movimento.',
        signature: [4, 4],
        spacing: 62,
        items: [note('half', { dots: 2 }), note('eighth')],
      },
      {
        title: 'Semiminima col doppio punto + semicroma + minima',
        text: '1 + 1/2 + 1/4, più 1/4, più 2.',
        signature: [4, 4],
        spacing: 62,
        items: [note('quarter', { dots: 2 }), note('sixteenth'), note('half')],
      },
      {
        title: 'Pausa di semiminima col punto',
        signature: [4, 4],
        spacing: 58,
        items: [rest('quarter', { dots: 1 }), note('eighth'), note('half')],
      },
    ],
  },
  {
    id: 'small-values',
    title: 'Biscroma e figure piccole',
    summary: 'Le suddivisioni più veloci e come si raggruppano.',
    intro:
      'Dividendo ancora a metà si arriva a biscrome e semibiscrome. Le note più veloci di una semiminima si collegano con travi: una trave per la croma, due per la semicroma, tre per la biscroma. Le travi aiutano a vedere i movimenti.',
    bullets: [
      'In un movimento (una semiminima) ci stanno: 2 crome, 4 semicrome, 8 biscrome, 16 semibiscrome.',
      'Raggruppare per movimento rende il ritmo leggibile.',
      'Le travi corte (monconi) indicano figure miste, come croma e due semicrome.',
    ],
    examples: [
      {
        title: 'Otto biscrome (un movimento) + tre semiminime',
        signature: [4, 4],
        spacing: 24,
        items: [...rep(8, () => note('thirtysecond')), ...quarters(3)],
      },
      {
        title: 'Croma e due semicrome, poi due semicrome e croma',
        signature: [2, 4],
        spacing: 38,
        items: [note('eighth'), note('sixteenth'), note('sixteenth'), note('sixteenth', { breakBefore: true }), note('sixteenth'), note('eighth')],
      },
    ],
  },
  {
    id: 'swing',
    title: 'Swing e suddivisione',
    summary: 'Crome dritte e crome swing: scritte uguali, suonate diverse.',
    intro:
      'Nel jazz le crome si scrivono dritte ma si suonano in modo ineguale: la prima dura circa il doppio della seconda, come nella terzina (semiminima + croma). Il rapporto non è fisso: più il tempo è veloce più le crome si avvicinano a quelle dritte.',
    bullets: [
      'Scritto: due crome uguali. Suonato: due terzi e un terzo di movimento.',
      'L\'accento cade sul levare, la seconda croma.',
      'Nei tempi lenti lo swing è più marcato; nei veloci quasi dritto.',
    ],
    examples: [
      {
        title: 'Come si scrive',
        signature: [2, 4],
        spacing: 40,
        items: rep(4, (i) => note('eighth', { breakBefore: i === 2 })),
      },
      {
        title: 'Come si suona (terzina swing)',
        signature: [2, 4],
        spacing: 58,
        items: [note('quarter', { tuplet: { label: '3', span: 2 } }), note('eighth', { accent: true }), note('quarter', { tuplet: { label: '3', span: 2 } }), note('eighth', { accent: true })],
      },
    ],
  },
  {
    id: 'beat-upbeat',
    title: 'Battere e levare',
    summary: 'I movimenti forti e deboli della battuta.',
    intro:
      'Battere è il movimento forte (la mano scende), levare quello debole (la mano sale). In una battuta ogni tempo ha un peso diverso. Nel jazz l\'accento si sposta spesso sul 2 e sul 4, il cosiddetto backbeat.',
    bullets: [
      'In 4/4: 1 forte, 3 mezzoforte, 2 e 4 deboli.',
      'Nel jazz e nel blues si accentano il 2 e il 4.',
      'Il levare di ogni movimento è la croma debole ("e").',
    ],
    examples: [
      {
        title: 'Accenti in 4/4',
        signature: [4, 4],
        spacing: 60,
        items: [note('quarter', { accent: true, label: 'forte' }), note('quarter', { label: 'debole' }), note('quarter', { accent: true, label: 'mezzoforte' }), note('quarter', { label: 'debole' })],
      },
      {
        title: 'Backbeat sul 2 e sul 4',
        signature: [4, 4],
        spacing: 52,
        items: [note('quarter', { label: '1' }), note('quarter', { accent: true, label: '2' }), note('quarter', { label: '3' }), note('quarter', { accent: true, label: '4' })],
      },
      {
        title: 'Battere e levare in crome',
        text: 'Gli accenti stanno sul levare ("e").',
        signature: [4, 4],
        spacing: 40,
        items: rep(8, (i) => note('eighth', { breakBefore: i % 2 === 0, accent: i % 2 === 1, label: i % 2 === 0 ? String(i / 2 + 1) : 'e' })),
      },
    ],
  },
  {
    id: 'compound-odd',
    title: 'Tempi composti e irregolari',
    summary: '6/8, 9/8, 12/8 e tempi dispari come 5/4 e 7/8.',
    intro:
      'Nei tempi semplici (2/4, 3/4, 4/4) ogni movimento si divide in due. Nei tempi composti (6/8, 9/8, 12/8) il movimento è una semiminima col punto e si divide in tre. I tempi irregolari (5/4, 7/8) si dividono in gruppi di 2 e 3.',
    bullets: [
      '6/8 = 2 movimenti da tre crome; 9/8 = 3 movimenti; 12/8 = 4 movimenti.',
      '5/4 si sente 3 + 2 o 2 + 3; 7/8 può essere 2 + 2 + 3, 3 + 2 + 2 o 2 + 3 + 2.',
      'L\'accento cade all\'inizio di ogni gruppo.',
    ],
    examples: [
      {
        title: '6/8 (3 + 3)',
        signature: [6, 8],
        spacing: 42,
        items: rep(6, (i) => note('eighth', { breakBefore: i === 3, accent: i % 3 === 0, label: String(i + 1) })),
      },
      {
        title: '9/8 (3 + 3 + 3)',
        signature: [9, 8],
        spacing: 38,
        items: rep(9, (i) => note('eighth', { breakBefore: i % 3 === 0, accent: i % 3 === 0, label: String(i + 1) })),
      },
      {
        title: '12/8 (3 + 3 + 3 + 3)',
        signature: [12, 8],
        spacing: 34,
        items: rep(12, (i) => note('eighth', { breakBefore: i % 3 === 0, accent: i % 3 === 0, label: String(i + 1) })),
      },
      {
        title: '5/4 (3 + 2)',
        signature: [5, 4],
        spacing: 52,
        items: rep(5, (i) => note('quarter', { accent: i === 0 || i === 3, label: ['1', '2', '3', '1', '2'][i] })),
      },
      {
        title: '7/8 (2 + 2 + 3)',
        signature: [7, 8],
        spacing: 44,
        items: rep(7, (i) => note('eighth', { breakBefore: i === 2 || i === 4, accent: i === 0 || i === 2 || i === 4, label: ['1', '2', '1', '2', '1', '2', '3'][i] })),
      },
    ],
  },
];
