import test from 'node:test';
import assert from 'node:assert';
import { buildUnapprovedMap, checkGroup, recursiveCheckAndSplit } from './utils.js';

test('buildUnapprovedMap', async (t) => {
  await t.test('returns a map with keys for each member of a disapproved pair', (t) => {
    const DISAPPROVED_PAIRS = [['Ernie', 'The Grouch']]
    const result = buildUnapprovedMap(DISAPPROVED_PAIRS)
    assert.strictEqual(result['The Grouch'][0], 'Ernie');
    assert.strictEqual(result['Ernie'][0], 'The Grouch');
  });
  await t.test('returns a map with a value that contains multiple bad matches for students who have them', (t) => {
    const DISAPPROVED_PAIRS = [['Ernie', 'The Grouch'], ['The Grouch', 'Cookie Monster']];
    const result = buildUnapprovedMap(DISAPPROVED_PAIRS);
    assert.strictEqual(result['The Grouch'].length, 2)
  });
});

test('checkGroup', async (t) => {
  const UNAPPROVED_MAP = {
    'Ernie': ['The Grouch'],
  }
  const expected = 'The Grouch'
  const failingResult = checkGroup(['Big Bird', 'Bert', 'The Grouch', 'Ernie'], UNAPPROVED_MAP);
  const passingResult = checkGroup(['Bert', 'Ernie', 'Count', 'Cookie Monster'], UNAPPROVED_MAP);

  await t.test('returns the first student who triggers a bad match', (t) => {
    assert.notEqual(failingResult, null); 
    assert.strictEqual(failingResult, expected)
  });
  await t.test('returns null for a group with no conflicts', (t) => {
    assert.strictEqual(passingResult, null);
  });
});

test('recursiveCheckAndSplit', async (t) => {
  const DISAPPROVED_PAIRS = [['Ernie', 'The Grouch'], ['The Grouch', 'Cookie Monster']];
  const UNAPPROVED_MAP = buildUnapprovedMap(DISAPPROVED_PAIRS);

  await t.test('returns an easy split for a class shuffle without bad matches', (t) => {
    const shuffledClass = ['Big Bird', 'The Grouch', 'Bert', 'Ernie', 'Count', 'Cookie Monster']
    const result = recursiveCheckAndSplit(shuffledClass, 2, 3, UNAPPROVED_MAP);
    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0][0], 'Big Bird');
    assert.strictEqual(result[2][1], 'Cookie Monster');
  });
  // TODO: failing test
  await t.test('returns a groupings array of the correct length after it recurses', (t) => {
    const shuffledClass = ['Big Bird', 'Bert', 'Ernie', 'The Grouch', 'Count', 'Cookie Monster']
    const result = recursiveCheckAndSplit(shuffledClass, 2, 3, UNAPPROVED_MAP);
    // console.log({result})
    assert.strictEqual(result.length, 3);
  });
  // await t.test('', (t) => {
  // });
});