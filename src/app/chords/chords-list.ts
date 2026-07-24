import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FretboardDiagram } from '../fretboard/fretboard-diagram';
import { chordMutedStrings, chordToDots } from './chord-diagram.util';
import { CHORDS } from './chords.data';

@Component({
  selector: 'app-chords-list',
  imports: [FretboardDiagram, RouterLink],
  templateUrl: './chords-list.html',
})
export class ChordsList {
  protected readonly chords = CHORDS.map((chord) => ({
    chord,
    dots: chordToDots(chord),
    muted: chordMutedStrings(chord),
  }));
}
