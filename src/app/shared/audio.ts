import { Injectable } from '@angular/core';
import { Chord, Note } from 'tonal';

/** One sound to play: MIDI notes sounding together, when they start and how long they ring (seconds). */
export interface PlannedSound {
  midis: number[];
  start: number;
  duration: number;
}

const OPEN_MIDI: Record<number, number> = { 6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64 };

/** Notes in ascending pitch order starting from the first one, in the given octave of the root. */
export function ascendingMidis(notes: string[], rootOctave = 3): number[] {
  const out: number[] = [];
  notes.forEach((note, i) => {
    let midi = Note.midi(`${note}${rootOctave}`) as number;
    if (i === 0) {
      out.push(midi);
      return;
    }
    while (midi <= out[i - 1]) midi += 12;
    out.push(midi);
  });
  return out;
}

/** Scale up and back down, including the octave. */
export function scaleRun(notes: string[], rootOctave = 3): number[] {
  const up = ascendingMidis([...notes, notes[0]], rootOctave);
  return [...up, ...up.slice(0, -1).reverse()];
}

/** MIDI notes of a chord symbol such as "Cmaj7" or "Dm7♭5", stacked upwards from the root. */
export function chordNameMidis(name: string, rootOctave = 3): number[] {
  const clean = name.replace(/♭/g, 'b').replace(/♯/g, '#');
  const chord = Chord.get(clean);
  if (chord.empty || !chord.tonic) return [];
  return ascendingMidis(chord.notes, rootOctave);
}

/** MIDI notes of fretboard dots, lowest first. */
export function dotMidis(dots: { string: number; fret: number }[]): number[] {
  return dots.map((d) => OPEN_MIDI[d.string] + d.fret).sort((a, b) => a - b);
}

/** MIDI notes of fretboard dots, in the order given. */
export function orderedDotMidis(dots: { string: number; fret: number }[]): number[] {
  return dots.map((d) => OPEN_MIDI[d.string] + d.fret);
}

export const sequencePlan = (midis: number[], step = 0.38, duration = 0.9): PlannedSound[] =>
  midis.map((m, i) => ({ midis: [m], start: i * step, duration }));

export const chordPlan = (midis: number[], strum = 0.035, duration = 1.8): PlannedSound[] =>
  midis.map((m, i) => ({ midis: [m], start: i * strum, duration }));

/** Chords one after the other, each strummed. */
export function progressionPlan(chords: number[][], beat = 1.4): PlannedSound[] {
  return chords.flatMap((midis, i) => midis.map((m, j) => ({ midis: [m], start: i * beat + j * 0.035, duration: beat * 1.1 })));
}

/** Plays a plan with simple plucked-string tones, using the Web Audio API. */
@Injectable({ providedIn: 'root' })
export class AudioPlayer {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;

  private ensure(): AudioContext {
    if (!this.context) this.context = new AudioContext();
    if (this.context.state === 'suspended') void this.context.resume();
    return this.context;
  }

  /** Starts the plan and returns its total length in milliseconds. */
  play(plan: PlannedSound[]): number {
    this.stop();
    if (!plan.length) return 0;
    const ctx = this.ensure();
    const master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
    this.master = master;
    const now = ctx.currentTime + 0.05;
    let end = 0;
    for (const sound of plan) {
      for (const midi of sound.midis) this.pluck(ctx, master, midi, now + sound.start, sound.duration);
      end = Math.max(end, sound.start + sound.duration);
    }
    return end * 1000;
  }

  stop(): void {
    if (this.master && this.context) {
      const m = this.master;
      m.gain.cancelScheduledValues(this.context.currentTime);
      m.gain.setTargetAtTime(0, this.context.currentTime, 0.02);
      setTimeout(() => m.disconnect(), 200);
    }
    this.master = null;
  }

  private pluck(ctx: AudioContext, out: AudioNode, midi: number, when: number, duration: number): void {
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(0.5, when + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 8, 6000), when);
    filter.frequency.exponentialRampToValueAtTime(Math.max(freq * 1.5, 300), when + duration * 0.6);
    const a = ctx.createOscillator();
    a.type = 'triangle';
    a.frequency.value = freq;
    const b = ctx.createOscillator();
    b.type = 'sawtooth';
    b.frequency.value = freq;
    const bGain = ctx.createGain();
    bGain.gain.value = 0.18;
    a.connect(filter);
    b.connect(bGain).connect(filter);
    filter.connect(gain).connect(out);
    a.start(when);
    b.start(when);
    a.stop(when + duration + 0.05);
    b.stop(when + duration + 0.05);
  }
}
