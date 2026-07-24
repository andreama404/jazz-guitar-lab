export interface ScoreEntry {
  id: string;
  title: string;
  artist: string;
  /**
   * Path to a score source file under public/scores. Either an alphaTex text
   * file (.alphatex/.tex) loaded via `api.tex()`, or a binary/XML format
   * (.gp, .gpx, .musicxml, ...) that alphaTab auto-detects and loads via `api.load()`.
   */
  file: string;
}

export const SCORES: readonly ScoreEntry[] = [
  {
    id: 'canon-rock',
    title: 'Canon Rock (estratto)',
    artist: 'arr. per chitarra',
    file: '/scores/canon-rock.alphatex',
  },
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
    artist: 'esercizio base',
    file: '/scores/twinkle.alphatex',
  },
  {
    id: 'happy-birthday',
    title: 'Happy Birthday (estratto)',
    artist: 'Trad. — esempio MusicXML',
    file: '/scores/happy-birthday.musicxml',
  },
];
