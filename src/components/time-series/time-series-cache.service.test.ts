import { expect } from '@open-wc/testing'
import TimeSeriesCacheService from './time-series-cache.service.js'
import type { VariableDbEntry } from './time-series.types.js'

const toEntry = (overrides: Record<string, unknown>): VariableDbEntry =>
    ({
        variableEntryId: 'var_1',
        key: 'var_1_1.00,%202.00_prod',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-10T00:00:00.000Z',
        cachedAt: Date.now(),
        metadata: {
            prod_name: 'Product',
            param_short_name: 'param',
            param_name: 'Parameter',
            unit: 'unit',
            begin_time: '2024-01-01T00:00:00.000Z',
            end_time: '2024-01-10T00:00:00.000Z',
            lat: 0,
            lon: 0,
        },
        data: [],
        ...overrides,
    }) as VariableDbEntry

describe('TimeSeriesCacheService', () => {
    let service: TimeSeriesCacheService

    beforeEach(() => {
        service = new TimeSeriesCacheService()
    })

    it('creates environment-aware cache key with normalized coordinates', () => {
        const key = service.getCacheKeyForVariable(
            'GPM_3IMERGHH_07_precipitation',
            '33.9375,-86.9375',
            'prod',
        )

        expect(key).to.equal(
            'GPM_3IMERGHH_07_precipitation_33.94,%20-86.94_prod',
        )
    })

    it('returns full gap when no cached entry exists', () => {
        const start = new Date('2024-01-01T00:00:00.000Z')
        const end = new Date('2024-01-10T00:00:00.000Z')

        const gaps = service.calculateDataGaps(start, end)

        expect(gaps).to.have.length(1)
        expect(gaps[0].start.toISOString()).to.equal(start.toISOString())
        expect(gaps[0].end.toISOString()).to.equal(end.toISOString())
    })

    it('returns leading and trailing gaps around cached range', () => {
        const start = new Date('2024-01-01T00:00:00.000Z')
        const end = new Date('2024-01-12T00:00:00.000Z')

        const existing = toEntry({
            startDate: '2024-01-03T00:00:00.000Z',
            endDate: '2024-01-10T00:00:00.000Z',
        })

        const gaps = service.calculateDataGaps(start, end, existing)

        expect(gaps).to.have.length(2)
        expect(gaps[0].start.toISOString()).to.equal(
            '2024-01-01T00:00:00.000Z',
        )
        expect(gaps[0].end.toISOString()).to.equal('2024-01-03T00:00:00.000Z')
        expect(gaps[1].start.toISOString()).to.equal(
            '2024-01-10T00:00:00.000Z',
        )
        expect(gaps[1].end.toISOString()).to.equal('2024-01-12T00:00:00.000Z')
    })

    it('deduplicates rows by timestamp while preserving first occurrence', () => {
        const rows = [
            { timestamp: '2024-01-01T00:00:00.000Z', value: '1' },
            { timestamp: '2024-01-01T00:00:00.000Z', value: '2' },
            { timestamp: '2024-01-02T00:00:00.000Z', value: '3' },
        ]

        const deduped = service.deduplicateByTimestamp(rows)

        expect(deduped).to.have.length(2)
        expect(deduped[0].value).to.equal('1')
        expect(deduped[1].value).to.equal('3')
    })

    it('returns only rows that are within the requested date range', () => {
        const result = service.getDataInRange(
            {
                metadata: {
                    prod_name: 'Product',
                    param_short_name: 'param',
                    param_name: 'Parameter',
                    unit: 'unit',
                    begin_time: '2024-01-01T00:00:00.000Z',
                    end_time: '2024-01-10T00:00:00.000Z',
                    lat: 0,
                    lon: 0,
                },
                data: [
                    { timestamp: '2023-12-31T00:00:00.000Z', value: '0' },
                    { timestamp: '2024-01-01T00:00:00.000Z', value: '1' },
                    { timestamp: '2024-01-05T00:00:00.000Z', value: '2' },
                    { timestamp: '2024-01-11T00:00:00.000Z', value: '3' },
                ],
            },
            new Date('2024-01-01T00:00:00.000Z'),
            new Date('2024-01-10T23:59:59.999Z'),
        )

        expect(result.data.map(row => row.value)).to.deep.equal(['1', '2'])
    })

    it('treats missing cachedAt as invalid cache', () => {
        const entry = toEntry({ cachedAt: undefined })

        expect(service.isCacheValid(entry)).to.equal(false)
    })
})
