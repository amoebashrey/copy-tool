import { test } from 'node:test';
import assert from 'node:assert/strict';
import { groupDuplicates } from '../src/lib/duplicates';
import type { StringItem } from '../src/lib/types';

const item = (over: Partial<StringItem>): StringItem => ({
  id: '1',
  characters: 'Hello',
  frameName: 'Home',
  pageName: 'Page 1',
  status: 'none',
  componentId: null,
  key: null,
  ...over,
});

test('groupDuplicates: groups 2+ items with identical trimmed text', () => {
  const items = [
    item({ id: '1', characters: 'Continue' }),
    item({ id: '2', characters: 'Cancel' }),
    item({ id: '3', characters: 'Continue' }),
    item({ id: '4', characters: 'Continue' }),
  ];
  const groups = groupDuplicates(items);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].text, 'Continue');
  assert.deepEqual(groups[0].items.map((i) => i.id), ['1', '3', '4']);
});

test('groupDuplicates: trims whitespace before comparing', () => {
  const items = [
    item({ id: '1', characters: '  Continue' }),
    item({ id: '2', characters: 'Continue  ' }),
  ];
  const groups = groupDuplicates(items);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].text, 'Continue');
  assert.deepEqual(groups[0].items.map((i) => i.id), ['1', '2']);
});

test('groupDuplicates: comparison is case-sensitive ("Continue" ≠ "continue")', () => {
  const items = [
    item({ id: '1', characters: 'Continue' }),
    item({ id: '2', characters: 'continue' }),
  ];
  assert.deepEqual(groupDuplicates(items), []);
});

test('groupDuplicates: singletons are not duplicates', () => {
  const items = [item({ id: '1', characters: 'A' }), item({ id: '2', characters: 'B' })];
  assert.deepEqual(groupDuplicates(items), []);
});

test('groupDuplicates: ignores empty and whitespace-only strings', () => {
  const items = [
    item({ id: '1', characters: '' }),
    item({ id: '2', characters: '' }),
    item({ id: '3', characters: '   ' }),
    item({ id: '4', characters: ' ' }),
  ];
  assert.deepEqual(groupDuplicates(items), []);
});

test('groupDuplicates: skips groups already all linked to the same component', () => {
  const items = [
    item({ id: '1', characters: 'Continue', componentId: 'c1' }),
    item({ id: '2', characters: 'Continue', componentId: 'c1' }),
  ];
  assert.deepEqual(groupDuplicates(items), []);
});

test('groupDuplicates: keeps a group when only some members are linked', () => {
  const items = [
    item({ id: '1', characters: 'Continue', componentId: 'c1' }),
    item({ id: '2', characters: 'Continue' }),
  ];
  const groups = groupDuplicates(items);
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].items.map((i) => i.id), ['1', '2']);
});

test('groupDuplicates: keeps a group linked to two different components', () => {
  const items = [
    item({ id: '1', characters: 'Continue', componentId: 'c1' }),
    item({ id: '2', characters: 'Continue', componentId: 'c2' }),
  ];
  assert.equal(groupDuplicates(items).length, 1);
});

test('groupDuplicates: returns groups largest-first', () => {
  const items = [
    item({ id: '1', characters: 'Cancel' }),
    item({ id: '2', characters: 'Cancel' }),
    item({ id: '3', characters: 'Continue' }),
    item({ id: '4', characters: 'Continue' }),
    item({ id: '5', characters: 'Continue' }),
  ];
  const groups = groupDuplicates(items);
  assert.deepEqual(groups.map((g) => g.text), ['Continue', 'Cancel']);
});

test('groupDuplicates: empty input gives []', () => {
  assert.deepEqual(groupDuplicates([]), []);
});
