import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FretboardDiagram } from '../fretboard/fretboard-diagram';
import { SCALE_GROUPS } from './scales.data';

@Component({
  selector: 'app-scales-list',
  imports: [FretboardDiagram, RouterLink],
  templateUrl: './scales-list.html',
})
export class ScalesList {
  protected readonly groups = SCALE_GROUPS;
}
