// The post says: after four turns the glider is itself again, one cell further along the diagonal. Run: node components/pages/post/life.test.mjs
import assert from 'node:assert/strict';
import { glider, step } from './lifeGrid.ts';
let g = glider(2, 3);
for (let i = 0; i < 4; i++) g = step(g);
assert.deepEqual([...g], [...glider(3, 4)]);
let w = glider(14, 8); // across the edge: the board wraps
for (let i = 0; i < 4; i++) w = step(w);
assert.deepEqual([...w], [...glider(15, 9)]);
console.log('life: ok');
