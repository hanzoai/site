// The piano roll as a Standard MIDI File (format 0): one track, 96 ticks a quarter, a sixteenth is 24 ticks.
// notes: [track 0-3 (MIDI channel), start step, length in steps, midi note]; bpm sets the tempo meta event.
const vlq = (n: number) => { const b = [n & 0x7f]; while ((n >>= 7)) b.unshift((n & 0x7f) | 0x80); return b; };
const u32 = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];

export type MidiNote = readonly [track: number, start: number, length: number, midi: number];

export function midi(notes: readonly MidiNote[], bpm: number) {
  const us = Math.round(60e6 / bpm);
  const ev: [tick: number, order: number, bytes: number[]][] = [];
  for (const [ch, st, len, m] of notes) {
    ev.push([st * 24, 1, [0x90 | ch, m, 96]], [(st + len) * 24, 0, [0x80 | ch, m, 0]]);
  }
  ev.sort((a, b) => a[0] - b[0] || a[1] - b[1]); // at the same tick a note ends before the next begins
  const body: number[] = [0, 0xff, 0x51, 3, (us >> 16) & 255, (us >> 8) & 255, us & 255];
  let t = 0;
  for (const [at, , bytes] of ev) { body.push(...vlq(at - t), ...bytes); t = at; }
  body.push(0, 0xff, 0x2f, 0);
  return new Uint8Array([0x4d, 0x54, 0x68, 0x64, ...u32(6), 0, 0, 0, 1, 0, 96, 0x4d, 0x54, 0x72, 0x6b, ...u32(body.length), ...body]);
}
