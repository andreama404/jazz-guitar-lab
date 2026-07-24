import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FretboardDiagram } from '../fretboard/fretboard-diagram';
import { QUADRIAD_GROUPS } from './quadriads.data';

@Component({
  selector: 'app-quadriads-list',
  imports: [FretboardDiagram, RouterLink],
  templateUrl: './quadriads-list.html',
})
export class QuadriadsList {
  protected readonly groups = QUADRIAD_GROUPS;
}
