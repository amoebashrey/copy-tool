import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterStrings, groupByFrame, toStatus } from '../src/lib/strings';
import type { StringItem } from '../src/lib/types';

const item = (over: Partial<StringItem>): StringItem => ({
  id: '1',
  characters: 'Hello',
  frameName: 'Home',
  status: 'none',
  componentId: null,
  ...over,
});

const items: StringItem[] = [
  item({ id: '1', characters: 'Save changes', frameName: 'Settings', status: 'final' }),
  item({ id: '2', characters: 'Cancel', frameName: 'Settings', status: 'wip' }),
  item({ id: '3', characters: 'Welcome back', frameName: 'Login', status: 'review' }),
  item({ id: '4', characters: 'save draft', frameName: 'Editor', status: 'wip' }),
];

test('filterStrings: no search + status all returns everything', () => {
  assert.deepEqual(filterStrings(items, { search: '', status: 'all' }), items);
});

test('filterStrings: search is a case-insensitive substring match on text', () => {
  const out = filterStrings(items, { search: 'SAVE', status: 'all' });
  assert.deepEqual(out.map((i) => i.id), ['1', '4']);
});

test('filterStrings: filters by status', () => {
  const out = filterStrings(items, { search: '', status: 'wip' });
  assert.deepEqual(out.map((i) => i.id), ['2', '4']);
});

test('filterStrings: search and status combine', () => {
  const out = filterStrings(items, { search: 'save', status: 'wip' });
  assert.deepEqual(out.map((i) => i.id), ['4']);
});

test('filterStrings: no match returns empty array', () => {
  assert.deepEqual(filterStrings(items, { search: 'zzz', status: 'all' }), []);
});

test('groupByFrame: groups in first-appearance order, items keep order', () => {
  const groups = groupByFrame(items);
  assert.deepEqual(groups.map((g) => g.frame), ['Settings', 'Login', 'Editor']);
  assert.deepEqual(groups[0].items.map((i) => i.id), ['1', '2']);
  assert.deepEqual(groups[1].items.map((i) => i.id), ['3']);
});

test('groupByFrame: empty input gives no groups', () => {
  assert.deepEqual(groupByFrame([]), []);
});

test('toStatus: passes valid statuses through', () => {
  assert.equal(toStatus('wip'), 'wip');
  assert.equal(toStatus('final'), 'final');
});

test('toStatus: missing or legacy values fall back to none', () => {
  assert.equal(toStatus(''), 'none');
  assert.equal(toStatus('approved'), 'none');
});
