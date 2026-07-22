import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toExportJson, parseImport, matchImportRows } from '../src/lib/export';
import type { ChitraComponent, StringItem } from '../src/lib/types';

const comps: ChitraComponent[] = [{ id: 'c1', name: 'CTA', text: 'Save changes' }];

const item = (over: Partial<StringItem>): StringItem => ({
  id: '1',
  characters: 'Hello',
  frameName: 'Home',
  pageName: 'Page 1',
  status: 'none',
  componentId: null,
  ...over,
});

test('toExportJson: maps items to the handoff shape, resolving component names', () => {
  const items = [
    item({ id: '1', characters: 'Save changes', frameName: 'Settings', status: 'final', componentId: 'c1' }),
    item({ id: '2', characters: 'Welcome', frameName: 'Login', status: 'wip' }),
  ];
  assert.deepEqual(toExportJson(items, comps), [
    { id: '1', frame: 'Settings', text: 'Save changes', status: 'final', component: 'CTA' },
    { id: '2', frame: 'Login', text: 'Welcome', status: 'wip', component: null },
  ]);
});

test('toExportJson: unknown componentId exports as null', () => {
  const rows = toExportJson([item({ componentId: 'ghost' })], comps);
  assert.equal(rows[0].component, null);
});

test('parseImport: comma-delimited', () => {
  assert.deepEqual(parseImport('a,Hello\nb,World'), [
    { id: 'a', text: 'Hello' },
    { id: 'b', text: 'World' },
  ]);
});

test('parseImport: tab-delimited', () => {
  assert.deepEqual(parseImport('a\tHello\nb\tWorld'), [
    { id: 'a', text: 'Hello' },
    { id: 'b', text: 'World' },
  ]);
});

test('parseImport: semicolon-delimited', () => {
  assert.deepEqual(parseImport('a;Hello'), [{ id: 'a', text: 'Hello' }]);
});

test('parseImport: picks the most frequent delimiter', () => {
  // semicolons dominate, the comma is content
  assert.deepEqual(parseImport('a;Hello, world;extra\nb;Bye;x'), [
    { id: 'a', text: 'Hello, world;extra' },
    { id: 'b', text: 'Bye;x' },
  ]);
});

test('parseImport: on a tie, tab beats semicolon beats comma', () => {
  assert.deepEqual(parseImport('a\tHello, world'), [{ id: 'a', text: 'Hello, world' }]);
});

test('parseImport: splits on the first delimiter only, so text keeps commas', () => {
  assert.deepEqual(parseImport('a,Hello, world'), [{ id: 'a', text: 'Hello, world' }]);
});

test('parseImport: trims fields and strips surrounding quotes', () => {
  assert.deepEqual(parseImport('"a" , "Hello, world"'), [{ id: 'a', text: 'Hello, world' }]);
});

test('parseImport: skips blank lines and lines without a delimiter', () => {
  assert.deepEqual(parseImport('\na,Hi\n\njunk line\nb,Yo\n'), [
    { id: 'a', text: 'Hi' },
    { id: 'b', text: 'Yo' },
  ]);
});

test('parseImport: empty input gives []', () => {
  assert.deepEqual(parseImport(''), []);
  assert.deepEqual(parseImport('   \n  '), []);
});

test('matchImportRows: splits rows into matched and missing by node id', () => {
  const rows = parseImport('1:2,Hello\n9:9,Ghost\n1:3,World');
  const { matched, missingIds } = matchImportRows(rows, ['1:2', '1:3', '1:4']);
  assert.deepEqual(matched, [
    { id: '1:2', text: 'Hello' },
    { id: '1:3', text: 'World' },
  ]);
  assert.deepEqual(missingIds, ['9:9']);
});

test('matchImportRows: keeps duplicated ids in order so the last row wins on apply', () => {
  const rows = [
    { id: '1:2', text: 'first' },
    { id: '1:2', text: 'second' },
  ];
  const { matched, missingIds } = matchImportRows(rows, ['1:2']);
  assert.deepEqual(matched.map((r) => r.text), ['first', 'second']);
  assert.deepEqual(missingIds, []);
});

test('matchImportRows: no known ids means everything is missing', () => {
  const { matched, missingIds } = matchImportRows([{ id: 'a', text: 'x' }], []);
  assert.deepEqual(matched, []);
  assert.deepEqual(missingIds, ['a']);
});

test('matchImportRows: empty rows give empty result', () => {
  assert.deepEqual(matchImportRows([], ['1:2']), { matched: [], missingIds: [] });
});
