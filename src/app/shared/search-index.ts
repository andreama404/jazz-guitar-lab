import { CHORD_TYPES, ChordType, EXTENDED_TYPES, QUADRIAD_TYPES, TRIAD_TYPES } from '../chords/chord-theory';
import { ROOTS, SCALE_TYPES } from '../scales/scale-theory';
import { CATEGORIES } from '../exercises/exercises-page';
import { EXERCISES } from '../exercises/mechanics';
import { PROGRESSIONS } from '../exercises/arpeggio-progression';
import { KINDS } from '../exercises/ear-training';
import { SCALE_PROGRESSIONS } from '../exercises/scale-progressions';
import { BLUES_EXERCISES } from '../exercises/blues-exercises';
import { TOPICS } from '../theory/theory-page';

export interface SearchEntry {
  label: string;
  /** Section shown next to the result ("Scala", "Teoria"...). */
  tag: string;
  path: string;
  params: Record<string, string>;
  /** Words matched exactly (+3) or by prefix (+1). */
  words: string[];
  /** Words that add a bonus when matched exactly (the root name, the section). */
  strong: string[];
  /** Words matched exactly only, for long descriptions. */
  weak: string[];
}

/** Italian names of the roots, and extra words to find enharmonic spellings. */
const ROOT_NAMES: Record<string, { label: string; strong: string[]; extra: string[] }> = {
  C: { label: 'C (Do)', strong: ['c', 'do'], extra: [] },
  Db: { label: 'Db (Reb)', strong: ['db', 'reb'], extra: ['re', 'bemolle', 'do#', 'c#', 'diesis'] },
  D: { label: 'D (Re)', strong: ['d', 're'], extra: [] },
  Eb: { label: 'Eb (Mib)', strong: ['eb', 'mib'], extra: ['mi', 'bemolle', 're#', 'd#', 'diesis'] },
  E: { label: 'E (Mi)', strong: ['e', 'mi'], extra: [] },
  F: { label: 'F (Fa)', strong: ['f', 'fa'], extra: [] },
  'F#': { label: 'F# (Fa#)', strong: ['f#', 'fa#'], extra: ['fa', 'diesis', 'solb', 'gb', 'bemolle', 'sol'] },
  G: { label: 'G (Sol)', strong: ['g', 'sol'], extra: [] },
  Ab: { label: 'Ab (Lab)', strong: ['ab', 'lab'], extra: ['la', 'bemolle', 'sol#', 'g#', 'diesis'] },
  A: { label: 'A (La)', strong: ['a', 'la'], extra: [] },
  Bb: { label: 'Bb (Sib)', strong: ['bb', 'sib'], extra: ['si', 'bemolle', 'la#', 'a#', 'diesis'] },
  B: { label: 'B (Si)', strong: ['b', 'si'], extra: [] },
};

/** Lowercase, no accents, flat/sharp signs as b and #, split into words. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/♭/g, 'b')
    .replace(/♯/g, '#')
    .split(/[^a-z0-9#]+/)
    .filter(Boolean);
}

function chordEntries(path: string, tag: string, kindWords: string[], types: readonly ChordType[]): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const type of types) {
    const typeWords = [...tokenize(type.name), ...tokenize(type.symbol), ...tokenize(type.suffix), ...tokenize(type.id)];
    for (const root of ROOTS) {
      const r = ROOT_NAMES[root];
      out.push({
        label: `${r.label} ${type.name} (${type.symbol})`,
        tag,
        path,
        params: { root, type: type.id },
        words: [...kindWords, ...r.strong, ...r.extra, ...typeWords],
        strong: [...r.strong, ...kindWords, ...tokenize(type.symbol)],
        weak: [],
      });
    }
  }
  return out;
}

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const type of SCALE_TYPES) {
    const typeWords = [...tokenize(type.name), ...tokenize(type.id), ...tokenize(type.tonalName)];
    for (const root of ROOTS) {
      const r = ROOT_NAMES[root];
      const kind = ['scala', 'scale', 'scales'];
      entries.push({
        label: `${r.label} ${type.name}`,
        tag: 'Scala',
        path: '/scales',
        params: { root, type: type.id },
        words: [...kind, ...r.strong, ...r.extra, ...typeWords],
        strong: [...r.strong, ...kind],
        weak: tokenize(type.description),
      });
    }
  }

  entries.push(...chordEntries('/chords', 'Accordo', ['accordo', 'accordi', 'chord'], CHORD_TYPES));
  entries.push(...chordEntries('/triads', 'Triade', ['triade', 'triadi', 'triad'], TRIAD_TYPES));
  entries.push(...chordEntries('/quadriads', 'Quadriade', ['quadriade', 'quadriadi', 'quadriad'], QUADRIAD_TYPES));
  entries.push(...chordEntries('/arpeggios', 'Arpeggio', ['arpeggio', 'arpeggi', 'arpeggios'], [...TRIAD_TYPES, ...QUADRIAD_TYPES, ...EXTENDED_TYPES]));

  for (const t of TOPICS) {
    entries.push({
      label: t.title,
      tag: 'Teoria',
      path: '/theory',
      params: { topic: t.id },
      words: [...tokenize(t.title), ...tokenize(t.id), 'teoria'],
      strong: ['teoria'],
      weak: tokenize(t.summary),
    });
  }

  for (const c of CATEGORIES) {
    entries.push({
      label: c.title,
      tag: 'Esercizi',
      path: '/exercises',
      params: { category: c.id },
      words: [...tokenize(c.title), ...tokenize(c.id), 'esercizi', 'esercizio'],
      strong: ['esercizi', 'esercizio'],
      weak: tokenize(c.summary),
    });
  }
  for (const e of EXERCISES) {
    entries.push({
      label: e.name,
      tag: 'Meccanica',
      path: '/exercises',
      params: { category: 'mechanics', ex: e.id },
      words: [...tokenize(e.name), ...tokenize(e.id), 'meccanica', 'esercizio', 'esercizi'],
      strong: ['meccanica'],
      weak: [],
    });
  }
  for (const p of PROGRESSIONS) {
    entries.push({
      label: `Arpeggi su ${p.name}`,
      tag: 'Esercizi',
      path: '/exercises',
      params: { category: 'arpeggios', prog: p.id },
      words: [...tokenize(p.name), ...tokenize(p.id), 'arpeggi', 'arpeggio', 'progressione', 'esercizio', 'esercizi'],
      strong: ['arpeggi'],
      weak: [],
    });
  }
  for (const p of SCALE_PROGRESSIONS) {
    entries.push({
      label: `Progressione: ${p.title}`,
      tag: 'Esercizi',
      path: '/exercises',
      params: { category: 'scale-progressions', sprog: p.id },
      words: [...tokenize(p.title), ...tokenize(p.id), 'progressione', 'progressioni', 'scale', 'scala', 'superlocria', 'esercizio', 'esercizi'],
      strong: ['progressione'],
      weak: [],
    });
  }
  for (const b of BLUES_EXERCISES) {
    entries.push({
      label: `Blues: ${b.title}`,
      tag: 'Esercizi',
      path: '/exercises',
      params: { category: 'blues', bex: b.id },
      words: [...tokenize(b.title), ...tokenize(b.id), 'blues', 'pentatonica', 'pentatonic', 'penta', 'esercizio', 'esercizi', '12', 'battute'],
      strong: ['blues'],
      weak: [],
    });
  }
  for (const [id, k] of Object.entries(KINDS)) {
    entries.push({
      label: `Ear training: ${k.title}`,
      tag: 'Esercizi',
      path: '/exercises',
      params: { category: 'ear-training', ear: id },
      words: [...tokenize(k.title), 'ear', 'training', 'orecchio', 'esercizio', 'esercizi'],
      strong: ['ear'],
      weak: tokenize(k.hint),
    });
  }

  return entries;
}

let cache: SearchEntry[] | null = null;

/** Entries matching every word of the query, best first. */
export function search(query: string, limit = 8): SearchEntry[] {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  cache ??= buildIndex();

  const scored: { entry: SearchEntry; score: number; order: number }[] = [];
  cache.forEach((entry, order) => {
    const word = (token: string): number => {
      let best = 0;
      for (const w of entry.words) {
        if (w === token) best = Math.max(best, entry.strong.includes(w) ? 6 : 3);
        else if (w.startsWith(token)) best = Math.max(best, 1);
      }
      if (!best && entry.weak.includes(token)) best = 1;
      return best;
    };
    let total = 0;
    for (const token of tokens) {
      let best = word(token);
      // Chord symbols typed as one word ("Cmaj7", "Bb7"): try root + type.
      for (let head = Math.min(2, token.length - 1); !best && head >= 1; head--) {
        const a = word(token.slice(0, head));
        const b = word(token.slice(head));
        if (a && b) best = a + b;
      }
      if (!best) return;
      total += best;
    }
    // Shorter labels are usually the more direct hit.
    scored.push({ entry, score: total - entry.label.length / 100, order });
  });

  return scored
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, limit)
    .map((s) => s.entry);
}
