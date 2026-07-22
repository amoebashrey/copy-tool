import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toExportJson, parseImport } from '../src/lib/export';
import type { ChitraComponent, StringItem } from '../src/lib/types';

const comps: ChitraComponent[] = [{ id: 'c1', name: 'CTA', text: 'Save changes' }];

const item = (over: Partial<StringItem>): StringItem => ({
  id: '1',
  characters: 'Hello',
  frameName: 'Home',
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
