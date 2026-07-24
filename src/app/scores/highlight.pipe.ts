import { Pipe, PipeTransform } from '@angular/core';

export interface HighlightSegment {
  text: string;
  match: boolean;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  transform(text: string, query: string): HighlightSegment[] {
    const trimmed = query.trim();
    if (!trimmed) {
      return [{ text, match: false }];
    }

    const parts = text.split(new RegExp(`(${escapeRegExp(trimmed)})`, 'gi'));
    return parts.filter((part) => part.length > 0).map((part) => ({
      text: part,
      match: part.toLowerCase() === trimmed.toLowerCase(),
    }));
  }
}
