import { strict as assert } from 'node:assert';
import test from 'node:test';
import { getPageOffset, getPaginationItems } from '../src/lib/pagination';

test('shows every page when the range fits in the control', () => {
  assert.deepEqual(getPaginationItems(3, 5), [1, 2, 3, 4, 5]);
});

test('adds ellipses around the current page for a long range', () => {
  assert.deepEqual(getPaginationItems(5, 10), [
    1,
    'ellipsis',
    4,
    5,
    6,
    'ellipsis',
    10,
  ]);
});

test('keeps the first and last pages visible at the range edges', () => {
  assert.deepEqual(getPaginationItems(1, 10), [1, 2, 'ellipsis', 10]);
  assert.deepEqual(getPaginationItems(10, 10), [1, 'ellipsis', 9, 10]);
});

test('clamps an out-of-range current page and handles invalid totals', () => {
  assert.deepEqual(getPaginationItems(0, 9), [1, 2, 'ellipsis', 9]);
  assert.deepEqual(getPaginationItems(12, 9), [1, 'ellipsis', 8, 9]);
  assert.deepEqual(getPaginationItems(1, 0), []);
});

test('converts a one-based page number to a zero-based API offset', () => {
  assert.equal(getPageOffset(1, 50), 0);
  assert.equal(getPageOffset(3, 50), 100);
  assert.equal(getPageOffset(0, 50), 0);
});
