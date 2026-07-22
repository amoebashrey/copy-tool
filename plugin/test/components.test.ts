import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addComponent,
  updateComponentText,
  parseRegistry,
  propagationTargets,
} from '../src/lib/components';
import type { ChitraComponent, StringItem } from '../src/lib/types';

const comps: ChitraComponent[] = [
  { id: 'c1', name: 'CTA', text: 'Save changes' },
  { id: 'c2', name: 'Cancel', text: 'Cancel' },
];

test('addComponent: appends without mutating the input array', () => {
  const added = { id: 'c3', name: 'Title', text: 'Welcome' };
  const out = addComponent(comps, added);
  assert.equal(out.length, 3);
  assert.deepEqual(out[2], added);
  assert.equal(comps.length, 2);
});

test('updateComponentText: updates only the matching component', () => {
  const out = updateComponentText(comps, 'c1', 'Save all changes');
  assert.equal(out[0].text, 'Save all changes');
  assert.equal(out[1].text, 'Cancel');
  assert.equal(comps[0].text, 'Save changes'); // input untouched
});

test('updateComponentText: unknown id leaves everything as-is', () => {
  assert.deepEqual(updateComponentText(comps, 'nope', 'x'), comps);
});

test('parseRegistry: parses a valid JSON registry', () => {
  assert.deepEqual(parseRegistry(JSON.stringify(comps)), comps);
});

test('parseRegistry: empty, invalid JSON, or non-array yields []', () => {
  assert.deepEqual(parseRegistry(''), []);
  assert.deepEqual(parseRegistry('not json'), []);
  assert.deepEqual(parseRegistry('{"id":"c1"}'), []);
});

test('parseRegistry: drops malformed entries, keeps valid ones', () => {
  const raw = JSON.stringify([comps[0], { id: 'bad' }, 42, null]);
  assert.deepEqual(parseRegistry(raw), [comps[0]]);
});

const item = (id: string, componentId: string | null, pageName = 'Page 1'): StringItem => ({
  id,
  characters: 'x',
  frameName: 'Home',
  pageName,
  status: 'none',
  componentId,
});

test('propagationTargets: returns ids of items linked to the component', () => {
  const items = [item('1', 'c1'), item('2', null), item('3', 'c1'), item('4', 'c2')];
  assert.deepEqual(propagationTargets(items, 'c1'), ['1', '3']);
});

test('propagationTargets: no linked items gives []', () => {
  assert.deepEqual(propagationTargets([item('1', null)], 'c9'), []);
});

test('propagationTargets: includes linked items regardless of which page they live on', () => {
  const items = [
    item('1', 'c1', 'App'),
    item('2', 'c1', 'Onboarding'),
    item('3', null, 'Onboarding'),
    item('4', 'c1', 'Archive'),
  ];
  assert.deepEqual(propagationTargets(items, 'c1'), ['1', '2', '4']);
});
