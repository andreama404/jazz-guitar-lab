import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Alphatab } from '../alphatab/alphatab';
import { HighlightPipe } from '../scores/highlight.pipe';
import { SCORES } from '../scores/scores.manifest';

@Component({
  selector: 'app-songs-page',
  imports: [Alphatab, FormsModule, HighlightPipe],
  templateUrl: './songs-page.html',
})
export class SongsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly scores = [...SCORES].sort((a, b) => a.title.localeCompare(b.title));
  protected readonly search = signal('');

  private readonly routeId = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly selectedScore = computed(() => {
    const id = this.routeId().get('id');
    return this.scores.find((score) => score.id === id) ?? null;
  });

  protected readonly filteredScores = computed(() => {
    const query = this.search().trim().toLowerCase();
    if (!query) {
      return this.scores;
    }
    return this.scores.filter(
      (score) => score.title.toLowerCase().includes(query) || score.artist.toLowerCase().includes(query),
    );
  });

  protected selectScore(id: string): void {
    void this.router.navigate(['/songs', id]);
  }
}
