import { Component } from '@angular/core';
import { Alphatab } from './alphatab/alphatab';

@Component({
  selector: 'app-root',
  imports: [Alphatab],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
