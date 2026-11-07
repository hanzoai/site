// node components/pages/model/Uta.midi.test.mjs
import assert from 'node:assert/strict';
import { midi } from './Uta.midi.mjs';

const f = midi([[3, 0, 2, 69], [0, 2, 1, 50]], 96);
const hex = (a) => [...a].map((b) => b.toString(16).padStart(2, '0')).join(' ');
assert.equal(hex(f.slice(0, 14)), '4d 54 68 64 00 00 00 06 00 00 00 01 00 60'); // MThd, format 0, 1 track, 96 tpq
assert.equal(hex(f.slice(14, 18)), '4d 54 72 6b');
assert.equal((f[18] << 24 | f[19] << 16 | f[20] << 8 | f[21]), f.length - 22); // track length is right
assert.equal(hex(f.slice(22, 29)), '00 ff 51 03 09 89 68'); // 625000 µs a quarter = 96 BPM
assert.equal(hex(f.slice(29, 33)), '00 93 45 60'); // A4 on, channel 4, at tick 0
assert.equal(hex(f.slice(33, 37)), '30 83 45 00'); // off 48 ticks later (two sixteenths)
assert.equal(hex(f.slice(37, 40)), '00 90 32'); // the timpani D3 starts on that same tick, after the off
assert.equal(hex(f.slice(-4)), '00 ff 2f 00');
assert.equal(hex(midi([[0, 6, 1, 60]], 96).slice(29, 31)), '81 10'); // 144 ticks as a two-byte delta
console.log('Uta.midi: ok');
