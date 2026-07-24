import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FretboardDiagram } from '../fretboard/fretboard-diagram';
import { ARPEGGIO_GROUPS } from './arpeggios.data';

@Component({
  selector: 'app-arpeggios-list',
  imports: [FretboardDiagram, RouterLink],
  templateUrl: './arpeggios-list.html',
})
export class ArpeggiosList {
  protected readonly groups = ARPEGGIO_GROUPS;
}
