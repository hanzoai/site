import test from 'node:test';
import assert from 'node:assert/strict';
import C from '../content.js';
import { lab } from './lab.js';

const icon = (name) => C.agents.find((a) => a.name === name).icon;

// the chart's points, as the price list and the runs name them
const WEAR = [
  ['Claude Opus 5.5', 'Claude'],
  ['GPT-5.6 Sol', 'ChatGPT'],
  ['DeepSeek V4 Pro 0423', 'DeepSeek'],
  ['Grok 4.7', 'Grok Build'],
  ['Kimi K3', 'Kimi'],
  ['Gemini 3.8 Flash', 'Gemini CLI'],
];

test('a lab with a tile in the agents dock wears that tile\'s drawing', () => {
  for (const [model, tile] of WEAR) {
    const m = lab(model, false);
    assert.ok(m, model);
    if (m.src) assert.ok(icon(tile).includes(m.src), model);
    else assert.ok(icon(tile).includes(m.inner), model);
  }
});

test('an Enso tier wears Hanzo\'s H, whatever it is called', () => {
  assert.equal(lab('Enso Ultra', true).inner, lab('Enso', true).inner);
  assert.ok(icon('Hanzo Dev').includes(lab('Enso', true).inner));
});

test('Z.ai wears its own mark; a lab with none wears nothing', () => {
  assert.ok(lab('GLM 5.3', false).inner.includes('#3859FF'));
  assert.equal(lab('Totally New Lab 1', false), null);
});
