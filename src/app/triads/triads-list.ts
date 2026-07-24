import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FretboardDiagram } from '../fretboard/fretboard-diagram';
import { TRIAD_GROUPS } from './triads.data';

@Component({
  selector: 'app-triads-list',
  imports: [FretboardDiagram, RouterLink],
  templateUrl: './triads-list.html',
})
export class TriadsList {
  protected readonly groups = TRIAD_GROUPS;
}
