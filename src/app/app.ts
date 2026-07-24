import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alphatab } from './alphatab/alphatab';
import { HighlightPipe } from './scores/highlight.pipe';
import { SCORES } from './scores/scores.manifest';

@Component({
  selector: 'app-root',
  imports: [Alphatab, FormsModule, HighlightPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly scores = [...SCORES].sort((a, b) => a.title.localeCompare(b.title));
  protected readonly selectedFile = signal<string | null>(null);
  protected readonly search = signal('');

  protected readonly filteredScores = computed(() => {
    const query = this.search().trim().toLowerCase();
    if (!query) {
      return this.scores;
    }
    return this.scores.filter(
      (score) => score.title.toLowerCase().includes(query) || score.artist.toLowerCase().includes(query),
    );
  });

  protected selectScore(file: string): void {
    this.selectedFile.set(file);
  }
}
