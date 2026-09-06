import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { services } from './site.ts';
import { works, worksForService } from './works.ts';

describe('works', () => {
  it('references only known service slugs', () => {
    const slugs = new Set(services.map((service) => service.slug));
    for (const work of works) {
      assert.ok(work.serviceSlugs.length > 0, `${work.slug} has no services`);
      for (const slug of work.serviceSlugs) {
        assert.ok(slugs.has(slug), `${work.slug} references unknown service: ${slug}`);
      }
    }
  });

  it('returns an empty list for services without published work', () => {
    assert.deepEqual(worksForService('no-such-service'), []);
  });

  it('returns only matching work for a service', () => {
    for (const service of services) {
      for (const work of worksForService(service.slug)) {
        assert.ok(work.serviceSlugs.includes(service.slug));
      }
    }
  });
});
