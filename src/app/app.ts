import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SiteSearch } from './shared/site-search';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SiteSearch],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
