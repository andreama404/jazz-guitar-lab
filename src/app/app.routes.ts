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
    loadComponent: () => import('./chords/chord-detail').then((m) => m.ChordDetail),
  },
  {
    path: 'scales',
    loadComponent: () => import('./scales/scale-detail').then((m) => m.ScaleDetail),
  },
  {
    path: 'triads',
    data: { kind: 'triads' },
    loadComponent: () => import('./voicings/voicing-page').then((m) => m.VoicingPage),
  },
  {
    path: 'quadriads',
    data: { kind: 'quadriads' },
    loadComponent: () => import('./voicings/voicing-page').then((m) => m.VoicingPage),
  },
  {
    path: 'arpeggios',
    data: { kind: 'arpeggios' },
    loadComponent: () => import('./voicings/voicing-page').then((m) => m.VoicingPage),
  },
  {
    path: 'theory',
    loadComponent: () => import('./theory/theory-page').then((m) => m.TheoryPage),
  },
  {
    path: 'exercises',
    loadComponent: () => import('./exercises/exercises-page').then((m) => m.ExercisesPage),
  },
  { path: '**', redirectTo: 'songs' },
];
