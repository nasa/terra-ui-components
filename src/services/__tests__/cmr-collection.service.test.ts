import { expect } from '@open-wc/testing'
import cmrCollectionService from '../cmr-collection.service.js'
import type {
    CmrCollectionsJsonResponse,
    GibsTagEntry,
} from '../../apis/types/cmr/collection-tags.js'

function makeEntry(overrides: Partial<GibsTagEntry> = {}): GibsTagEntry {
    return {
        product: 'AIRS_L2_Surface_Air_Temperature_Day',
        title: 'Surface Air Temperature (L2, Day)',
        source: 'Aqua / AIRS',
        group: 'overlays',
        format: 'png',
        layerPeriod: 'Daily',
        geographic: true,
        geographic_resolution: '2km',
        arctic: true,
        arctic_resolution: '1km',
        antarctic: true,
        antarctic_resolution: '1km',
        match: { time_start: '>=2002-08-30T00:00:00Z', day_night_flag: 'day' },
        updated_at: '2026-10-19T12:45:17.245Z',
        ...overrides,
    }
}

function makeResponse(entries: GibsTagEntry[]): CmrCollectionsJsonResponse {
    return {
        feed: {
            entry: [
                {
                    tags: {
                        'edsc.extra.serverless.gibs': { data: entries },
                    },
                },
            ],
        },
    }
}

describe('CmrCollectionService', () => {
    describe('extractGibsEntries', () => {
        it('returns the gibs tag data array', () => {
            const entry = makeEntry()
            const result = cmrCollectionService.extractGibsEntries(
                makeResponse([entry])
            )
            expect(result).to.deep.equal([entry])
        })

        it('returns an empty array when the collection has no gibs tag', () => {
            const response: CmrCollectionsJsonResponse = {
                feed: { entry: [{ tags: {} }] },
            }
            expect(cmrCollectionService.extractGibsEntries(response)).to.deep.equal(
                []
            )
        })

        it('returns an empty array when there is no matching entry at all', () => {
            const response: CmrCollectionsJsonResponse = { feed: { entry: [] } }
            expect(cmrCollectionService.extractGibsEntries(response)).to.deep.equal(
                []
            )
        })

        it('returns an empty array when given null/undefined', () => {
            expect(cmrCollectionService.extractGibsEntries(null)).to.deep.equal([])
            expect(cmrCollectionService.extractGibsEntries(undefined)).to.deep.equal(
                []
            )
        })
    })

    describe('filterByProjection', () => {
        const geographicOnly = makeEntry({
            product: 'geo-only',
            geographic: true,
            arctic: false,
            antarctic: false,
        })
        const arcticOnly = makeEntry({
            product: 'arctic-only',
            geographic: false,
            arctic: true,
            antarctic: false,
        })
        const antarcticOnly = makeEntry({
            product: 'antarctic-only',
            geographic: false,
            arctic: false,
            antarctic: true,
        })
        const entries = [geographicOnly, arcticOnly, antarcticOnly]

        it('includes every entry for EPSG:3857 (no explicit availability flag)', () => {
            expect(
                cmrCollectionService.filterByProjection(entries, 'EPSG:3857')
            ).to.deep.equal(entries)
        })

        it('includes only geographic entries for EPSG:4326', () => {
            expect(
                cmrCollectionService.filterByProjection(entries, 'EPSG:4326')
            ).to.deep.equal([geographicOnly])
        })

        it('includes only arctic entries for EPSG:3413', () => {
            expect(
                cmrCollectionService.filterByProjection(entries, 'EPSG:3413')
            ).to.deep.equal([arcticOnly])
        })

        it('includes only antarctic entries for EPSG:3031', () => {
            expect(
                cmrCollectionService.filterByProjection(entries, 'EPSG:3031')
            ).to.deep.equal([antarcticOnly])
        })
    })

    describe('buildGibsLayerConfigs', () => {
        it('builds a named GibsLayerConfig per entry', () => {
            const dayEntry = makeEntry({
                product: 'AIRS_L2_Surface_Air_Temperature_Day',
                format: 'png',
            })
            const nightEntry = makeEntry({
                product: 'AIRS_L2_Surface_Air_Temperature_Night',
                format: 'jpg',
            })

            const configs = cmrCollectionService.buildGibsLayerConfigs(
                [dayEntry, nightEntry],
                { collectionId: 'AIRS2RET_NRT_7.0', projection: 'EPSG:3857' }
            )

            expect(configs).to.deep.equal([
                {
                    type: 'gibs',
                    name: 'AIRS2RET_NRT_7.0:AIRS_L2_Surface_Air_Temperature_Day',
                    layer: 'AIRS_L2_Surface_Air_Temperature_Day',
                    date: undefined,
                    format: 'png',
                    projection: undefined,
                    position: 'top',
                },
                {
                    type: 'gibs',
                    name: 'AIRS2RET_NRT_7.0:AIRS_L2_Surface_Air_Temperature_Night',
                    layer: 'AIRS_L2_Surface_Air_Temperature_Night',
                    date: undefined,
                    format: 'jpg',
                    projection: undefined,
                    position: 'top',
                },
            ])
        })

        it('includes the given date and non-mercator projection', () => {
            const configs = cmrCollectionService.buildGibsLayerConfigs(
                [makeEntry()],
                {
                    collectionId: 'AIRS2RET_NRT_7.0',
                    projection: 'EPSG:3413',
                    date: '2024-06-01',
                }
            )

            expect(configs[0]).to.include({
                date: '2024-06-01',
                projection: 'EPSG:3413',
            })
        })
    })
})
