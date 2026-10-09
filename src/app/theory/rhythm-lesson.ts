import { Component, input } from '@angular/core';
import { RhythmLesson } from './rhythm-lessons';
import { RhythmStaff } from './rhythm-staff';

/** A rhythm lesson: introduction, key points and staff examples. */
@Component({
  selector: 'app-rhythm-lesson',
  imports: [RhythmStaff],
  template: `
    <h2 class="text-xl font-bold text-slate-800">{{ lesson().title }}</h2>
    <p class="mt-1 mb-3 text-sm text-slate-600">{{ lesson().intro }}</p>
    <ul class="mb-5 list-disc space-y-1 pl-5 text-sm text-slate-600">
      @for (b of lesson().bullets; track $index) {
        <li>{{ b }}</li>
      }
    </ul>
    <div class="space-y-5">
      @for (e of lesson().examples; track e.title) {
        <div class="overflow-x-auto">
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ e.title }}</div>
          @if (e.text) {
            <p class="mb-1 text-sm text-slate-600">{{ e.text }}</p>
          }
          <app-rhythm-staff [items]="e.items" [signature]="e.signature" [spacing]="e.spacing"></app-rhythm-staff>
        </div>
      }
    </div>
  `,
})
export class RhythmLessonView {
  readonly lesson = input.required<RhythmLesson>();
}
