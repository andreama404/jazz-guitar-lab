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
  {
    id: 'melodia-con-accordi',
    title: 'Melodia con Accordi (esempio)',
    artist: 'esempio chord symbols',
    file: '/scores/melodia-con-accordi.alphatex',
  },
  {
    id: 'alice-in-wonderland',
    title: 'Alice in Wonderland',
    artist: 'Sammy Fain / Bob Hilliard',
    file: '/scores/alice-in-wonderland.alphatex',
  },
  {
    id: 'autumn-leaves',
    title: 'Autumn Leaves (estratto)',
    artist: 'Joseph Kosma',
    file: '/scores/autumn-leaves.alphatex',
  },
  {
    id: 'misty',
    title: 'Misty (estratto)',
    artist: 'Erroll Garner',
    file: '/scores/misty.alphatex',
  },
  {
    id: 'all-of-me',
    title: 'All of Me (estratto)',
    artist: 'Gerald Marks / Seymour Simons',
    file: '/scores/all-of-me.alphatex',
  },
  {
    id: 'estate',
    title: 'Estate (estratto)',
    artist: 'Bruno Martino',
    file: '/scores/estate.alphatex',
  },
];
