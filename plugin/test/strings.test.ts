import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterStrings, groupByFrame, groupByPage, toStatus } from '../src/lib/strings';
import type { StringItem } from '../src/lib/types';

const item = (over: Partial<StringItem>): StringItem => ({
  id: '1',
  characters: 'Hello',
  frameName: 'Home',
  pageName: 'Page 1',
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

test('groupByPage: groups by page then frame, first-appearance order at both levels', () => {
  const docItems = [
    item({ id: '1', frameName: 'Settings', pageName: 'App' }),
    item({ id: '2', frameName: 'Login', pageName: 'Onboarding' }),
    item({ id: '3', frameName: 'Settings', pageName: 'App' }),
    item({ id: '4', frameName: 'Profile', pageName: 'App' }),
    item({ id: '5', frameName: 'Login', pageName: 'Onboarding' }),
  ];
  const pages = groupByPage(docItems);
  assert.deepEqual(pages.map((p) => p.page), ['App', 'Onboarding']);
  assert.deepEqual(pages[0].frames.map((f) => f.frame), ['Settings', 'Profile']);
  assert.deepEqual(pages[0].frames[0].items.map((i) => i.id), ['1', '3']);
  assert.deepEqual(pages[0].frames[1].items.map((i) => i.id), ['4']);
  assert.deepEqual(pages[1].frames.map((f) => f.frame), ['Login']);
  assert.deepEqual(pages[1].frames[0].items.map((i) => i.id), ['2', '5']);
});

test('groupByPage: same frame name on different pages stays in separate groups', () => {
  const docItems = [
    item({ id: '1', frameName: 'Home', pageName: 'Mobile' }),
    item({ id: '2', frameName: 'Home', pageName: 'Desktop' }),
  ];
  const pages = groupByPage(docItems);
  assert.equal(pages.length, 2);
  assert.deepEqual(pages[0].frames[0].items.map((i) => i.id), ['1']);
  assert.deepEqual(pages[1].frames[0].items.map((i) => i.id), ['2']);
});

test('groupByPage: empty input gives no groups', () => {
  assert.deepEqual(groupByPage([]), []);
});

test('toStatus: passes valid statuses through', () => {
  assert.equal(toStatus('wip'), 'wip');
  assert.equal(toStatus('final'), 'final');
});

test('toStatus: missing or legacy values fall back to none', () => {
  assert.equal(toStatus(''), 'none');
  assert.equal(toStatus('approved'), 'none');
});
