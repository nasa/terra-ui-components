import { expect, fixture, html, waitUntil, oneEvent } from '@open-wc/testing'
import sinon from 'sinon'
import { apiClient } from '../../lib/api.client.js'
import { BadRequestException } from '../../exceptions/http.exception.js'
import TerraMap from '../map/map.component.js'
import './collection-visualization.js'
import type TerraCollectionVisualization from './collection-visualization.component.js'

const CONCEPT_ID = 'C1234567890-ESDIS'
const ENTRY_ID = 'TEST_SHORTNAME_1'
const VIS_ID = 'VIS1-ESDIS'

function makeCollectionResponse(
    visualizationIds: string[] = [],
    relatedUrls: unknown[] = [],
) {
    return {
        hits: 1,
        items: [
            {
                meta: {
                    'concept-id': CONCEPT_ID,
                    'native-id': ENTRY_ID,
                    'provider-id': 'ESDIS',
                    associations: visualizationIds.length
                        ? { visualizations: visualizationIds }
                        : undefined,
                },
                umm: relatedUrls.length ? { RelatedUrls: relatedUrls } : {},
            },
        ],
    }
}

const visualizationsWithTileLayer = {
    hits: 1,
    items: [
        {
            meta: {
                'concept-id': VIS_ID,
                'native-id': 'test-vis',
                'provider-id': 'ESDIS',
            },
            umm: {
                VisualizationType: 'tiles',
                Specification: {
                    ProductIdentification: {
                        BestAvailableExternalIdentifier: 'Test_GIBS_Layer',
                    },
                    ProductMetadata: {
                        NativeSpatialCoverage: [-180, -90, 180, 90],
                    },
                },
                Generation: {
                    OutputProjection: 'EPSG:3857',
                },
            },
        },
    ],
}

describe('<terra-collection-visualization>', () => {
    let apiGetStub: sinon.SinonStub

    beforeEach(() => {
        apiGetStub = sinon.stub(apiClient, 'get')
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should render a component', async () => {
        const el = await fixture(
            html`<terra-collection-visualization></terra-collection-visualization>`,
        )
        expect(el).to.exist
    })

    it('shows a warning when no collection-id is provided', async () => {
        const el: any = await fixture(
            html`<terra-collection-visualization></terra-collection-visualization>`,
        )
        const alert = el.shadowRoot?.querySelector('terra-alert')
        expect(alert).to.exist
        expect(alert?.variant).to.equal('warning')
        expect(el.shadowRoot?.textContent).to.include('collection-id')
    })

    it('shows a loading state while resolving the collection', async () => {
        apiGetStub.returns(new Promise(() => {})) // never resolves

        const el: any = await fixture(
            html`<terra-collection-visualization
                collection-id=${ENTRY_ID}
            ></terra-collection-visualization>`,
        )

        expect(el.shadowRoot?.querySelector('terra-loader')).to.exist
    })

    it('resolves an entry-id to a concept-id, then renders the GIBS layer on the map', async () => {
        apiGetStub.callsFake((url: string) => {
            if (url.includes('collections.umm_json')) {
                return Promise.resolve(makeCollectionResponse([VIS_ID]))
            }
            if (url.includes('visualizations.umm_json')) {
                return Promise.resolve(visualizationsWithTileLayer)
            }
            return Promise.reject(new Error(`Unexpected request: ${url}`))
        })

        const el: any = await fixture(
            html`<terra-collection-visualization
                collection-id=${ENTRY_ID}
            ></terra-collection-visualization>`,
        )

        await waitUntil(
            () => el.shadowRoot?.querySelector('terra-map'),
            'map never rendered',
        )

        const mapEl = el.shadowRoot?.querySelector('terra-map') as TerraMap
        expect(mapEl).to.exist
        expect(mapEl.gibsLayers).to.have.lengthOf(1)
        expect(mapEl.gibsLayers[0].layer).to.equal('Test_GIBS_Layer')

        const collectionsRequest = apiGetStub
            .getCalls()
            .find(call => call.args[0].includes('collections.umm_json'))
        expect(collectionsRequest?.args[0]).to.include(`entry_id=${ENTRY_ID}`)

        const visualizationsRequest = apiGetStub
            .getCalls()
            .find(call => call.args[0].includes('visualizations.umm_json'))
        expect(visualizationsRequest?.args[0]).to.include(`concept_id%5B%5D=${VIS_ID}`)
    })

    it('looks up the collection by concept-id rather than entry-id when given one', async () => {
        apiGetStub.callsFake((url: string) => {
            if (url.includes('collections.umm_json')) {
                return Promise.resolve(makeCollectionResponse([VIS_ID]))
            }
            if (url.includes('visualizations.umm_json')) {
                return Promise.resolve(visualizationsWithTileLayer)
            }
            return Promise.reject(new Error(`Unexpected request: ${url}`))
        })

        const el: any = await fixture(
            html`<terra-collection-visualization
                collection-id=${CONCEPT_ID}
            ></terra-collection-visualization>`,
        )

        await waitUntil(
            () => el.shadowRoot?.querySelector('terra-map'),
            'map never rendered',
        )

        const collectionsRequest = apiGetStub
            .getCalls()
            .find(call => call.args[0].includes('collections.umm_json'))
        expect(collectionsRequest?.args[0]).to.include(`concept-id=${CONCEPT_ID}`)
        expect(collectionsRequest?.args[0]).to.not.include('entry_id')
    })

    it('prefers a curated Worldview layer over the unordered UMM-Vis associations', async () => {
        apiGetStub.callsFake((url: string) => {
            if (url.includes('collections.umm_json')) {
                return Promise.resolve(
                    makeCollectionResponse([VIS_ID], [
                        {
                            Type: 'GET RELATED VISUALIZATION',
                            Subtype: 'WORLDVIEW',
                            URLContentType: 'VisualizationURL',
                            URL: 'https://worldview.earthdata.nasa.gov/?l=Curated_Layer_Id',
                        },
                    ]),
                )
            }
            if (url.includes('visualizations.umm_json')) {
                // the UMM-Vis association doesn't match the curated layer — it
                // should still lose to the curated one
                return Promise.resolve(visualizationsWithTileLayer)
            }
            return Promise.reject(new Error(`Unexpected request: ${url}`))
        })

        const el: any = await fixture(
            html`<terra-collection-visualization
                collection-id=${CONCEPT_ID}
            ></terra-collection-visualization>`,
        )

        await waitUntil(
            () => el.shadowRoot?.querySelector('terra-map'),
            'map never rendered',
        )

        const mapEl = el.shadowRoot?.querySelector('terra-map') as TerraMap
        expect(mapEl.gibsLayers[0].layer).to.equal('Curated_Layer_Id')
    })

    it('shows a "not found" alert when the collection has no associated visualizations', async () => {
        apiGetStub.callsFake((url: string) => {
            if (url.includes('collections.umm_json')) {
                return Promise.resolve(makeCollectionResponse([]))
            }
            return Promise.reject(new Error(`Unexpected request: ${url}`))
        })

        const el: any = await fixture(
            html`<terra-collection-visualization
                collection-id=${CONCEPT_ID}
            ></terra-collection-visualization>`,
        )

        await waitUntil(() => {
            const alert = el.shadowRoot?.querySelector('terra-alert')
            return alert && !el.shadowRoot?.querySelector('terra-loader')
        }, 'did not reach a settled state')

        const alert = el.shadowRoot?.querySelector('terra-alert')
        expect(alert?.variant).to.equal('warning')
        expect(el.shadowRoot?.textContent).to.include('No GIBS imagery')

        // no visualization ids to look up, so it should never have made that request
        expect(
            apiGetStub
                .getCalls()
                .some(call => call.args[0].includes('visualizations.umm_json')),
        ).to.be.false
    })

    it('shows a "not found" alert when none of the associated visualizations are GIBS tile layers', async () => {
        apiGetStub.callsFake((url: string) => {
            if (url.includes('collections.umm_json')) {
                return Promise.resolve(makeCollectionResponse([VIS_ID]))
            }
            if (url.includes('visualizations.umm_json')) {
                return Promise.resolve({
                    hits: 1,
                    items: [
                        {
                            meta: {
                                'concept-id': VIS_ID,
                                'native-id': 'test-vis',
                                'provider-id': 'ESDIS',
                            },
                            umm: { VisualizationType: 'maps' },
                        },
                    ],
                })
            }
            return Promise.reject(new Error(`Unexpected request: ${url}`))
        })

        const el: any = await fixture(
            html`<terra-collection-visualization
                collection-id=${CONCEPT_ID}
            ></terra-collection-visualization>`,
        )

        await waitUntil(() => {
            const alert = el.shadowRoot?.querySelector('terra-alert')
            return alert && !el.shadowRoot?.querySelector('terra-loader')
        }, 'did not reach a settled state')

        const alert = el.shadowRoot?.querySelector('terra-alert')
        expect(alert?.variant).to.equal('warning')
        expect(el.shadowRoot?.textContent).to.include('No GIBS imagery')
    })

    it('shows an error alert when the CMR request fails', async () => {
        // a 4xx HttpException skips the shared query client's retry logic,
        // so the error surfaces immediately instead of after retry backoff
        apiGetStub.rejects(new BadRequestException({ message: 'bad request' }))

        const el: any = await fixture(
            html`<terra-collection-visualization
                collection-id=${CONCEPT_ID}
            ></terra-collection-visualization>`,
        )

        await waitUntil(() => {
            const alert = el.shadowRoot?.querySelector('terra-alert')
            return alert?.variant === 'danger'
        }, 'error alert never appeared')
    })

    it('emits terra-collection-visualization-layer-change once a layer is resolved', async () => {
        apiGetStub.callsFake((url: string) => {
            if (url.includes('collections.umm_json')) {
                return Promise.resolve(makeCollectionResponse([VIS_ID]))
            }
            if (url.includes('visualizations.umm_json')) {
                return Promise.resolve(visualizationsWithTileLayer)
            }
            return Promise.reject(new Error(`Unexpected request: ${url}`))
        })

        const el = document.createElement(
            'terra-collection-visualization',
        ) as TerraCollectionVisualization
        el.collectionId = CONCEPT_ID

        const listener = oneEvent(el, 'terra-collection-visualization-layer-change')
        document.body.appendChild(el)

        const event = await listener
        expect(event.detail.gibsLayer.layer).to.equal('Test_GIBS_Layer')
        expect(event.detail.conceptId).to.equal(CONCEPT_ID)
        expect(event.detail.visualization).to.exist

        document.body.removeChild(el)
    })

    it('emits the layer-change event even when a curated layer has no matching UMM-Vis record', async () => {
        // the curated layer id doesn't match anything in the (empty) UMM-Vis
        // results — the component should still render and emit, just without
        // visualization metadata attached
        apiGetStub.callsFake((url: string) => {
            if (url.includes('collections.umm_json')) {
                return Promise.resolve(
                    makeCollectionResponse([], [
                        {
                            Type: 'GET RELATED VISUALIZATION',
                            Subtype: 'WORLDVIEW',
                            URLContentType: 'VisualizationURL',
                            URL: 'https://worldview.earthdata.nasa.gov/?l=Curated_Layer_Id',
                        },
                    ]),
                )
            }
            return Promise.reject(new Error(`Unexpected request: ${url}`))
        })

        const el = document.createElement(
            'terra-collection-visualization',
        ) as TerraCollectionVisualization
        el.collectionId = CONCEPT_ID

        const listener = oneEvent(el, 'terra-collection-visualization-layer-change')
        document.body.appendChild(el)

        const event = await listener
        expect(event.detail.gibsLayer.layer).to.equal('Curated_Layer_Id')
        expect(event.detail.visualization).to.be.undefined

        document.body.removeChild(el)
    })
})
