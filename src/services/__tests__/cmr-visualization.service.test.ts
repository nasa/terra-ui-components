import { expect } from '@open-wc/testing'
import cmrVisualizationService from '../cmr-visualization.service.js'
import type { UmmResponse, UmmResult } from '../../apis/cmr.api.js'
import type { UmmC } from '../../apis/types/cmr/umm-c.js'
import type { UmmVis } from '../../apis/types/cmr/umm-vis.js'

function makeVisualization(
    overrides: Partial<UmmVis> = {},
): UmmResult<UmmVis> {
    return {
        meta: {
            'concept-id': 'VIS123-ESDIS',
            'native-id': 'test-vis',
            'provider-id': 'ESDIS',
        },
        umm: {
            VisualizationType: 'tiles',
            Specification: {
                ProductIdentification: {
                    BestAvailableExternalIdentifier: 'Best_Layer_Id',
                    StandardOrNRTExternalIdentifier: 'Standard_Layer_Id',
                },
                ProductMetadata: {
                    NativeSpatialCoverage: [-180, -90, 180, 90],
                },
            },
            Generation: {
                OutputProjection: 'EPSG:4326',
            },
            ...overrides,
        },
    }
}

function makeCollection(relatedUrls: UmmC['RelatedUrls'] = []): UmmC {
    return { RelatedUrls: relatedUrls } as UmmC
}

describe('CmrVisualizationService', () => {
    describe('getCuratedGibsLayerId', () => {
        it('returns undefined when there are no RelatedUrls', () => {
            expect(
                cmrVisualizationService.getCuratedGibsLayerId(makeCollection()),
            ).to.be.undefined
        })

        it('returns undefined when given null/undefined', () => {
            expect(cmrVisualizationService.getCuratedGibsLayerId(null)).to.be
                .undefined
            expect(cmrVisualizationService.getCuratedGibsLayerId(undefined)).to.be
                .undefined
        })

        it('returns undefined when there is no WORLDVIEW visualization RelatedUrl', () => {
            const collection = makeCollection([
                {
                    Type: 'GET DATA',
                    URL: 'https://example.com/data',
                    URLContentType: 'DistributionURL',
                },
            ])
            expect(cmrVisualizationService.getCuratedGibsLayerId(collection)).to.be
                .undefined
        })

        it('returns the first non-hidden layer from a curated Worldview link', () => {
            const collection = makeCollection([
                {
                    Type: 'GET RELATED VISUALIZATION',
                    Subtype: 'WORLDVIEW',
                    URLContentType: 'VisualizationURL',
                    URL: 'https://worldview.earthdata.nasa.gov/?l=Reference_Labels_15m(hidden),Coastlines_15m(hidden),AIRS_L2_Temperature_500hPa_Day,AIRS_L2_Temperature_500hPa_Night',
                },
            ])

            expect(cmrVisualizationService.getCuratedGibsLayerId(collection)).to.equal(
                'AIRS_L2_Temperature_500hPa_Day',
            )
        })

        it('returns undefined if the URL has no "l" param', () => {
            const collection = makeCollection([
                {
                    Type: 'GET RELATED VISUALIZATION',
                    Subtype: 'WORLDVIEW',
                    URLContentType: 'VisualizationURL',
                    URL: 'https://worldview.earthdata.nasa.gov/',
                },
            ])

            expect(cmrVisualizationService.getCuratedGibsLayerId(collection)).to.be
                .undefined
        })
    })

    describe('selectTopVisualization', () => {
        it('returns undefined when there are no items', () => {
            const result = cmrVisualizationService.selectTopVisualization({
                hits: 0,
                items: [],
            })
            expect(result).to.be.undefined
        })

        it('returns undefined when given null/undefined', () => {
            expect(cmrVisualizationService.selectTopVisualization(null)).to.be
                .undefined
            expect(cmrVisualizationService.selectTopVisualization(undefined)).to
                .be.undefined
        })

        it('returns the first tile-type visualization', () => {
            const nonTile = makeVisualization({ VisualizationType: 'vectors' })
            const tile = makeVisualization({ VisualizationType: 'tiles' })
            const response: UmmResponse<UmmVis> = {
                hits: 2,
                items: [nonTile, tile],
            }

            const result = cmrVisualizationService.selectTopVisualization(response)
            expect(result).to.equal(tile)
        })

        it('returns undefined when no visualization is tile-type', () => {
            const response: UmmResponse<UmmVis> = {
                hits: 1,
                items: [makeVisualization({ VisualizationType: 'vectors' })],
            }

            expect(cmrVisualizationService.selectTopVisualization(response)).to.be
                .undefined
        })
    })

    describe('getGibsLayerIdentifier', () => {
        it('prefers BestAvailableExternalIdentifier', () => {
            const vis = makeVisualization()
            expect(cmrVisualizationService.getGibsLayerIdentifier(vis)).to.equal(
                'Best_Layer_Id',
            )
        })

        it('falls back to StandardOrNRTExternalIdentifier', () => {
            const vis = makeVisualization({
                Specification: {
                    ProductIdentification: {
                        StandardOrNRTExternalIdentifier: 'Standard_Layer_Id',
                    },
                },
            })
            expect(cmrVisualizationService.getGibsLayerIdentifier(vis)).to.equal(
                'Standard_Layer_Id',
            )
        })

        it('returns undefined when no identifier is present', () => {
            const vis = makeVisualization({ Specification: {} })
            expect(cmrVisualizationService.getGibsLayerIdentifier(vis)).to.be
                .undefined
        })
    })

    describe('resolveGibsLayer', () => {
        it('prefers the curated Worldview layer over UMM-Vis associations', () => {
            const collection = makeCollection([
                {
                    Type: 'GET RELATED VISUALIZATION',
                    Subtype: 'WORLDVIEW',
                    URLContentType: 'VisualizationURL',
                    URL: 'https://worldview.earthdata.nasa.gov/?l=Curated_Layer_Id',
                },
            ])
            const matchingVis = makeVisualization({
                Specification: {
                    ProductIdentification: {
                        BestAvailableExternalIdentifier: 'Curated_Layer_Id',
                    },
                },
            })
            const otherVis = makeVisualization({
                Specification: {
                    ProductIdentification: {
                        BestAvailableExternalIdentifier: 'Some_Other_Layer_Id',
                    },
                },
            })

            const result = cmrVisualizationService.resolveGibsLayer({
                collection,
                visualizations: { hits: 2, items: [otherVis, matchingVis] },
            })

            expect(result?.layerId).to.equal('Curated_Layer_Id')
            expect(result?.visualization).to.equal(matchingVis)
        })

        it('returns the curated layer id even with no matching UMM-Vis record', () => {
            const collection = makeCollection([
                {
                    Type: 'GET RELATED VISUALIZATION',
                    Subtype: 'WORLDVIEW',
                    URLContentType: 'VisualizationURL',
                    URL: 'https://worldview.earthdata.nasa.gov/?l=Curated_Layer_Id',
                },
            ])

            const result = cmrVisualizationService.resolveGibsLayer({
                collection,
                visualizations: { hits: 0, items: [] },
            })

            expect(result?.layerId).to.equal('Curated_Layer_Id')
            expect(result?.visualization).to.be.undefined
        })

        it('falls back to the top UMM-Vis visualization when there is no curated layer', () => {
            const collection = makeCollection()
            const vis = makeVisualization()

            const result = cmrVisualizationService.resolveGibsLayer({
                collection,
                visualizations: { hits: 1, items: [vis] },
            })

            expect(result?.layerId).to.equal('Best_Layer_Id')
            expect(result?.visualization).to.equal(vis)
        })

        it('returns undefined when there is neither a curated layer nor a usable visualization', () => {
            const result = cmrVisualizationService.resolveGibsLayer({
                collection: makeCollection(),
                visualizations: { hits: 0, items: [] },
            })

            expect(result).to.be.undefined
        })
    })

    describe('buildGibsLayerConfig', () => {
        it('builds a GibsLayerConfig enriched with the visualization metadata', () => {
            const vis = makeVisualization()
            const config = cmrVisualizationService.buildGibsLayerConfig(
                { layerId: 'Best_Layer_Id', visualization: vis },
                { name: 'top-layer', date: '2024-06-01' },
            )

            expect(config).to.deep.equal({
                name: 'top-layer',
                layer: 'Best_Layer_Id',
                date: '2024-06-01',
                projection: 'EPSG:4326',
                extent: [-180, -90, 180, 90],
                position: 'top',
            })
        })

        it('builds a minimal config when there is no matching visualization record', () => {
            const config = cmrVisualizationService.buildGibsLayerConfig(
                { layerId: 'Curated_Layer_Id' },
                { name: 'top-layer' },
            )

            expect(config).to.deep.equal({
                name: 'top-layer',
                layer: 'Curated_Layer_Id',
                date: undefined,
                projection: undefined,
                extent: undefined,
                position: 'top',
            })
        })

        it('omits projection when unsupported/unrecognized', () => {
            const vis = makeVisualization({
                Generation: { OutputProjection: 'EPSG:9999' },
            })
            const config = cmrVisualizationService.buildGibsLayerConfig(
                { layerId: 'Best_Layer_Id', visualization: vis },
                { name: 'top-layer' },
            )

            expect('projection' in config && config.projection).to.be.undefined
        })
    })
})
