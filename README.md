# Jazz Guitar Lab

App web personale per lo studio della chitarra jazz, in italiano. Online su https://jazzguitarlab.heavymasa.workers.dev

## Contenuti

- **Brani**: tablature con riproduzione (alphaTab).
- **Accordi, Triadi, Quadriadi**: scelta di nota e tipologia, con diagrammi sul manico e ascolto.
- **Scale**: scale e modi con diteggiature sul manico e ascolto.
- **Arpeggi**: posizioni sul manico per ogni accordo (triadi, quadriadi, estesi).
- **Teoria**: appunti a lista con dettaglio per argomento: intervalli, circolo delle quinte (maggiore e minore), campi armonici, funzioni, II-V-I, progressioni, modi, dominanti secondarie, intercambio modale, sostituzioni, blues, ritmo e notazione, glossario.
- **Esercizi**: meccanica (spider, salti), arpeggi su progressioni, ear training (intervalli, accordi, scale).

## Stack

Angular 22 (standalone, signals), Tailwind, [Tonal](https://github.com/tonaljs/tonal) per la teoria, [alphaTab](https://www.alphatab.net/) per le tablature, Web Audio API per i suoni.

## Sviluppo

```bash
npm install
npm start        # http://localhost:4200
npm run build    # output in dist/alpha-jazz-tabs/browser
```

## Pubblicazione

Il sito è su Cloudflare (static assets), collegato a questo repository: ogni push su `master` avvia una build e ripubblica.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Variabile d'ambiente: `NODE_VERSION=22`
- Configurazione in `wrangler.jsonc` (cartella `dist/alpha-jazz-tabs/browser`, fallback SPA per le route Angular).
