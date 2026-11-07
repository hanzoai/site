// Self-check for components/pages/tabsTree.js: closing a pane gives its space to the sibling and leaves every other
// part of the tree as it was. Usage: node scripts/tabs-tree.test.mjs
import assert from 'node:assert';
import { leaf, split, close, leaves } from '../components/pages/tabsTree.js';

let t = leaf('a', 'build');
t = split(t, 'a', 'row', leaf('b', 'work'), 's1');
t = split(t, 'b', 'col', leaf('c', 'shell 3'), 's2');
assert.deepEqual(leaves(t).map((l) => l.name), ['build', 'work', 'shell 3']);
const right = t.b;
const t2 = close(t, 'a'); // build closes: the whole right split takes its place, untouched
assert.equal(t2, right);
const t3 = close(t, 'c'); // shell 3 closes: work takes its space, build is the same object
assert.equal(t3.a, t.a);
assert.equal(t3.b.name, 'work');
assert.equal(close(leaf('z', 'last'), 'z').id, 'z'); // the last shell stays
assert.equal(split(t, 'nope', 'row', leaf('d', 'x'), 's3'), t); // unknown id changes nothing
console.log('tabs-tree: OK');
