import { strict as assert } from 'node:assert';
import test from 'node:test';
import { resolveLocale, translate, translateRarity } from '../src/lib/i18n';

test('uses saved language preference before browser language', () => {
  assert.equal(resolveLocale('en', 'es-MX'), 'en');
  assert.equal(resolveLocale('es', 'en-US'), 'es');
});

test('detects supported browser languages and falls back to Spanish', () => {
  assert.equal(resolveLocale(null, 'en-US'), 'en');
  assert.equal(resolveLocale(null, 'es-MX'), 'es');
  assert.equal(resolveLocale(null, 'fr-FR'), 'es');
  assert.equal(resolveLocale(null, null), 'es');
});

test('interpolates localized labels and translates supported rarities', () => {
  assert.equal(translate('en', 'page', { page: 2 }), 'Page 2');
  assert.equal(translate('es', 'page', { page: 2 }), 'Página 2');
  assert.equal(translateRarity('es', 'mythic'), 'Mítica');
  assert.equal(translateRarity('en', 'rare'), 'Rare');
});
