import { expect } from '@open-wc/testing'
import TimeAvgMapCacheService, {
    TIME_AVERAGE_MAP_CACHE_TTL_MS,
} from './time-average-map-cache.service.js'
import type { TimeAvgMapCacheEntry } from './time-average-map-cache.service.js'

const makeEntry = (overrides: Partial<TimeAvgMapCacheEntry> = {}): TimeAvgMapCacheEntry => ({
    key: 'map_AIRX3STD_Temperature_A_2024-01-01_2024-01-31_-180,-90,180,90_prod',
    cachedAt: Date.now(),
    environment: 'prod',
    blob: new Blob(['test'], { type: 'image/tiff' }),
    harmonyJobId: 'abc123',
    ...overrides,
})

describe('TimeAvgMapCacheService', () => {
    let service: TimeAvgMapCacheService

    beforeEach(() => {
        service = new TimeAvgMapCacheService()
    })

    it('builds a consistent cache key from all parameters', () => {
        const key = service.getCacheKey(
            'AIRX3STD',
            'Temperature_A',
            '2024-01-01',
            '2024-01-31',
            '-180,-90,180,90',
            'prod',
        )
        expect(key).to.equal(
            'map_AIRX3STD_Temperature_A_2024-01-01_2024-01-31_-180,-90,180,90_prod',
        )
    })

    it('defaults environment to prod when not provided', () => {
        const key = service.getCacheKey(
            'AIRX3STD',
            'Temperature_A',
            '2024-01-01',
            '2024-01-31',
            '-180,-90,180,90',
        )
        expect(key).to.include('_prod')
    })

    it('considers a fresh entry valid', () => {
        const entry = makeEntry({ cachedAt: Date.now() })
        expect(service.isCacheValid(entry)).to.be.true
    })

    it('considers an expired entry invalid', () => {
        const entry = makeEntry({
            cachedAt: Date.now() - TIME_AVERAGE_MAP_CACHE_TTL_MS - 1,
        })
        expect(service.isCacheValid(entry)).to.be.false
    })

    it('considers an entry without cachedAt invalid', () => {
        const entry = makeEntry({ cachedAt: 0 })
        expect(service.isCacheValid(entry)).to.be.false
    })

    it('returns false for undefined entry', () => {
        expect(service.isCacheValid(undefined)).to.be.false
    })
})
