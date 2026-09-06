import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  dateLabel,
  filterOperationsData,
  money,
  type OperationsData,
} from './operations-helpers.ts';

describe('money', () => {
  it('formats cents as whole-dollar USD', () => {
    assert.equal(money(12500), '$125');
    assert.equal(money(0), '$0');
  });
});

describe('dateLabel', () => {
  it('formats an ISO date as short month and day', () => {
    assert.equal(dateLabel('2026-09-06T00:00:00.000Z'), 'Sep 6');
  });
});

describe('filterOperationsData', () => {
  const data: OperationsData = {
    clients: [
      { id: '1', name: 'Acme', type: 'Retainer', owner: 'Ana', valueCents: 100, health: 'Good' },
      { id: '2', name: 'Beta', type: 'Project', owner: 'Bo', valueCents: 200, health: 'Risk' },
    ],
    overview: {
      metrics: { clients: 2, projects: 1, approvals: 1, outstandingCents: 300 },
      engines: [
        { name: 'Service', count: 1 },
        { name: 'Media', count: 0 },
      ],
      projects: [],
      approvals: [],
    },
  };

  it('returns the same data for a blank query', () => {
    assert.equal(filterOperationsData(data, '   '), data);
  });

  it('filters clients case-insensitively', () => {
    const result = filterOperationsData(data, 'acme');
    assert.equal(result.clients?.length, 1);
    assert.equal(result.clients?.[0]?.name, 'Acme');
  });

  it('filters overview engines without touching metrics', () => {
    const result = filterOperationsData(data, 'media');
    assert.deepEqual(result.overview?.engines, [{ name: 'Media', count: 0 }]);
    assert.equal(result.overview?.metrics.clients, 2);
  });
});
