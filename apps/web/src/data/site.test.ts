import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  footerNav,
  normalizeToSlug,
  parseServicesQuery,
  primaryNav,
  processSteps,
  services,
  slugToName,
} from './site.ts';

describe('normalizeToSlug', () => {
  it('resolves a slug to itself', () => {
    assert.equal(normalizeToSlug('web-development'), 'web-development');
  });

  it('resolves a service name case-insensitively', () => {
    assert.equal(normalizeToSlug('Web Development'), 'web-development');
  });

  it('trims surrounding whitespace', () => {
    assert.equal(normalizeToSlug('  automation  '), 'automation');
  });

  it('returns undefined for blank or unknown values', () => {
    assert.equal(normalizeToSlug(''), undefined);
    assert.equal(normalizeToSlug('   '), undefined);
    assert.equal(normalizeToSlug('unknown-service'), undefined);
  });
});

describe('parseServicesQuery', () => {
  it('returns an empty list for null or blank values', () => {
    assert.deepEqual(parseServicesQuery(null), []);
    assert.deepEqual(parseServicesQuery(''), []);
    assert.deepEqual(parseServicesQuery('   '), []);
  });

  it('splits comma-separated slugs and drops unknowns', () => {
    assert.deepEqual(parseServicesQuery('web-development,automation'), [
      'web-development',
      'automation',
    ]);
    assert.deepEqual(parseServicesQuery('web-development,unknown-service,, '), ['web-development']);
  });

  it('resolves display names and trims whitespace', () => {
    assert.deepEqual(parseServicesQuery('  Web Development , Video / Media '), [
      'web-development',
      'video-media',
    ]);
    assert.deepEqual(parseServicesQuery('Creative / Graphics,Automation'), [
      'creative-graphics',
      'automation',
    ]);
  });

  it('dedupes repeated services', () => {
    assert.deepEqual(parseServicesQuery('automation,Automation, automation,web-development'), [
      'automation',
      'web-development',
    ]);
  });
});

describe('slugToName', () => {
  it('maps a known slug to its display name', () => {
    assert.equal(slugToName('video-media'), 'Video / Media');
  });

  it('falls back to the slug when unknown', () => {
    assert.equal(slugToName('mystery'), 'mystery');
  });
});

describe('site data', () => {
  it('has unique service slugs with at least one tag each', () => {
    const slugs = services.map((service) => service.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const service of services) {
      assert.ok(service.name.length > 0);
      assert.ok(service.description.length > 0);
      assert.ok(service.tags.length > 0);
    }
  });

  it('numbers process steps sequentially from 01', () => {
    assert.deepEqual(
      processSteps.map((step) => step.number),
      processSteps.map((_, index) => String(index + 1).padStart(2, '0')),
    );
  });

  it('keeps primary and footer navigation anchored to page sections', () => {
    for (const link of [...primaryNav, ...footerNav]) {
      assert.ok(link.label.length > 0);
      assert.ok(
        link.href.startsWith('/#') || link.href.startsWith('mailto:'),
        `unexpected href: ${link.href}`,
      );
    }
  });
});
