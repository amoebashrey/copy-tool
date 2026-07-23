import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  filterStrings,
  groupByFrame,
  groupByPage,
  looseStrings,
  toStatus,
  validateKey,
} from '../src/lib/strings';
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

const trackedAndLoose: StringItem[] = [
  item({ id: '1', key: 'settings.save' }),
  item({ id: '2', componentId: 'c1' }),
  item({ id: '3' }),
  item({ id: '4', key: 'settings.cancel', componentId: 'c1' }),
  item({ id: '5', characters: 'Sign up' }),
];

test('filterStrings: looseOnly keeps only items with no key and no component', () => {
  const out = filterStrings(trackedAndLoose, { search: '', status: 'all', looseOnly: true });
  assert.deepEqual(out.map((i) => i.id), ['3', '5']);
});

test('filterStrings: looseOnly false (or omitted) changes nothing', () => {
  assert.deepEqual(
    filterStrings(trackedAndLoose, { search: '', status: 'all', looseOnly: false }),
    trackedAndLoose,
  );
  assert.deepEqual(
    filterStrings(trackedAndLoose, { search: '', status: 'all' }),
    trackedAndLoose,
  );
});

test('filterStrings: looseOnly combines with search and status', () => {
  const out = filterStrings(trackedAndLoose, { search: 'sign', status: 'all', looseOnly: true });
  assert.deepEqual(out.map((i) => i.id), ['5']);
  assert.deepEqual(
    filterStrings(trackedAndLoose, { search: '', status: 'wip', looseOnly: true }),
    [],
  );
});

test('looseStrings: returns items with neither key nor component', () => {
  assert.deepEqual(looseStrings(trackedAndLoose).map((i) => i.id), ['3', '5']);
});

test('looseStrings: a key alone or a component alone counts as tracked', () => {
  assert.deepEqual(looseStrings([item({ id: '1', key: 'k' })]), []);
  assert.deepEqual(looseStrings([item({ id: '1', componentId: 'c1' })]), []);
});

test('looseStrings: empty input gives []', () => {
  assert.deepEqual(looseStrings([]), []);
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

// ---- validateKey --------------------------------------------------------

const keyedItems: StringItem[] = [
  item({ id: '1:1', key: 'checkout.cta_primary', characters: 'Pay now', frameName: 'Checkout' }),
  item({ id: '1:2', key: 'nav.title' }),
  item({ id: '1:3', key: null }),
];

test('validateKey: a well-formed unique key is accepted', () => {
  assert.equal(validateKey('checkout.cta_secondary', keyedItems, '1:3'), null);
  assert.equal(validateKey('a', keyedItems, '1:3'), null);
  assert.equal(validateKey('a-b_c.d0', keyedItems, '1:3'), null);
});

test('validateKey: empty string is valid (it clears the key)', () => {
  assert.equal(validateKey('', keyedItems, '1:3'), null);
});

test('validateKey: whitespace-only is an error, not a clear', () => {
  assert.notEqual(validateKey('   ', keyedItems, '1:3'), null);
  assert.notEqual(validateKey('\t', keyedItems, '1:3'), null);
});

test('validateKey: surrounding whitespace is trimmed before validating', () => {
  assert.equal(validateKey('  checkout.cta_secondary  ', keyedItems, '1:3'), null);
  // trimmed value still collides with an existing key
  assert.notEqual(validateKey(' nav.title ', keyedItems, '1:3'), null);
});

test('validateKey: rejects invalid characters', () => {
  for (const bad of ['Checkout.CTA', 'has space', 'emoji🙂', 'semi;colon', 'slash/x', 'a,b']) {
    assert.notEqual(validateKey(bad, keyedItems, '1:3'), null, `expected error for "${bad}"`);
  }
});

test('validateKey: rejects a key already used by another item', () => {
  const err = validateKey('checkout.cta_primary', keyedItems, '1:3');
  assert.notEqual(err, null);
  assert.match(err!, /Checkout/); // error names the clashing frame
});

test('validateKey: keeping your own key is not a duplicate', () => {
  assert.equal(validateKey('checkout.cta_primary', keyedItems, '1:1'), null);
});

test('validateKey: no items means any well-formed key passes', () => {
  assert.equal(validateKey('anything.goes', [], '1:1'), null);
});
