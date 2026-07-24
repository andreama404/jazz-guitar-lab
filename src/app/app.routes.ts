import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'songs', pathMatch: 'full' },
  {
    path: 'songs',
    loadComponent: () => import('./songs/songs-page').then((m) => m.SongsPage),
  },
  {
    path: 'songs/:id',
    loadComponent: () => import('./songs/songs-page').then((m) => m.SongsPage),
  },
  {
    path: 'chords',
    loadComponent: () => import('./chords/chords-list').then((m) => m.ChordsList),
  },
  {
    path: 'chords/:id',
    loadComponent: () => import('./chords/chord-detail').then((m) => m.ChordDetail),
  },
  {
    path: 'scales',
    loadComponent: () => import('./scales/scales-list').then((m) => m.ScalesList),
  },
  {
    path: 'scales/:id',
    loadComponent: () => import('./scales/scale-detail').then((m) => m.ScaleDetail),
  },
  {
    path: 'triads',
    loadComponent: () => import('./triads/triads-list').then((m) => m.TriadsList),
  },
  {
    path: 'triads/:id',
    loadComponent: () => import('./triads/triad-detail').then((m) => m.TriadDetail),
  },
  {
    path: 'quadriads',
    loadComponent: () => import('./quadriads/quadriads-list').then((m) => m.QuadriadsList),
  },
  {
    path: 'quadriads/:id',
    loadComponent: () => import('./quadriads/quadriad-detail').then((m) => m.QuadriadDetail),
  },
  {
    path: 'arpeggios',
    loadComponent: () => import('./arpeggios/arpeggios-list').then((m) => m.ArpeggiosList),
  },
  {
    path: 'arpeggios/:id',
    loadComponent: () => import('./arpeggios/arpeggio-detail').then((m) => m.ArpeggioDetail),
  },
  { path: '**', redirectTo: 'songs' },
];
