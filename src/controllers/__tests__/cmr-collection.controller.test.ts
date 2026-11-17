import { expect } from '@open-wc/testing'
import sinon from 'sinon'
import { QueryClient } from '@tanstack/query-core'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { apiClient } from '../../lib/api.client.js'
import type { QueryClientHost } from '../../mixins/query-client.mixin.js'
import type { Projection } from '../../components/map/layers/gibs.layer.js'
import { CmrCollectionController } from '../cmr-collection.controller.js'

const ENTRY_ID = 'AIRS2RET_NRT_7.0'
const CONCEPT_ID = 'C1234567890-GES_DISC'

function makeTagsResponse(
    entries: Array<{
        product: string
        geographic?: boolean
        arctic?: boolean
        antarctic?: boolean
        format?: string
    }>
) {
    return {
        feed: {
            entry: [
                {
                    tags: {
                        'edsc.extra.serverless.gibs': {
                            data: entries.map(entry => ({
                                product: entry.product,
                                title: entry.product,
                                source: 'Test',
                                group: 'overlays',
                                format: entry.format ?? 'png',
                                layerPeriod: 'Daily',
                                geographic: entry.geographic ?? true,
                                geographic_resolution: '2km',
                                arctic: entry.arctic ?? false,
                                arctic_resolution: null,
                                antarctic: entry.antarctic ?? false,
                                antarctic_resolution: null,
                                match: {},
                                updated_at: '2026-10-19T12:45:17.245Z',
                            })),
                        },
                    },
                },
            ],
        },
    }
}

/**
 * A minimal ReactiveControllerHost + QueryClientHost, fresh per test to avoid
 * cache bleed. Controllers are connected immediately (as if the host were
 * already in the DOM), since `QueryController` only actually subscribes/fires
 * its query from `hostConnected()`.
 */
function makeHost(): ReactiveControllerHost & QueryClientHost {
    const controllers: ReactiveController[] = []
    return {
        addController: controller => {
            controllers.push(controller)
            controller.hostConnected?.()
        },
        removeController: () => {},
        requestUpdate: () => {},
        get updateComplete() {
            return Promise.resolve(true)
        },
        queryClient: new QueryClient({
            defaultOptions: { queries: { retry: false } },
        }),
    }
}

describe('CmrCollectionController', () => {
    let apiGetStub: sinon.SinonStub
    let collectionId: string | undefined
    let projection: Projection

    beforeEach(() => {
        apiGetStub = sinon.stub(apiClient, 'get')
        collectionId = undefined
        projection = 'EPSG:3857'
    })

    afterEach(() => {
        sinon.restore()
    })

    function makeController(host = makeHost()) {
        return new CmrCollectionController(host, {
            getCollectionId: () => collectionId,
            getProjection: () => projection,
        })
    }

    it('does not fire a request when no collection id is set', () => {
        makeController()
        expect(apiGetStub.called).to.be.false
    })

    it('queries by entry_id[] when given an entry-id', async () => {
        apiGetStub.resolves(makeTagsResponse([]))
        collectionId = ENTRY_ID
        makeController()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(apiGetStub.calledOnce).to.be.true
        expect(apiGetStub.firstCall.args[0]).to.include(`entry_id[]=${ENTRY_ID}`)
    })

    it('queries by concept-id when given a concept-id', async () => {
        apiGetStub.resolves(makeTagsResponse([]))
        collectionId = CONCEPT_ID
        makeController()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(apiGetStub.calledOnce).to.be.true
        expect(apiGetStub.firstCall.args[0]).to.include(`concept-id=${CONCEPT_ID}`)
        expect(apiGetStub.firstCall.args[0]).to.not.include('entry_id')
    })

    it('resolves every gibs entry available in the current projection', async () => {
        apiGetStub.resolves(
            makeTagsResponse([
                { product: 'Day_Layer', geographic: true },
                { product: 'Arctic_Only_Layer', geographic: false, arctic: true },
            ])
        )
        collectionId = ENTRY_ID
        projection = 'EPSG:3857'
        const controller = makeController()

        // let the underlying query settle
        await new Promise(resolve => setTimeout(resolve, 0))

        const configs = controller.gibsLayerConfigs
        expect(configs).to.have.lengthOf(2)
        expect(configs.map(c => (c as { layer: string }).layer)).to.deep.equal([
            'Day_Layer',
            'Arctic_Only_Layer',
        ])
        expect(configs[0].name).to.equal(`${ENTRY_ID}:Day_Layer`)
    })

    it('filters out entries not available in the current map projection', async () => {
        apiGetStub.resolves(
            makeTagsResponse([
                { product: 'Geographic_Only', geographic: true, arctic: false },
            ])
        )
        collectionId = ENTRY_ID
        projection = 'EPSG:3413'
        const controller = makeController()

        await new Promise(resolve => setTimeout(resolve, 0))

        expect(controller.gibsLayerConfigs).to.have.lengthOf(0)
    })

    it('returns a stable empty array reference when there is nothing to show', () => {
        const controller = makeController()
        const first = controller.gibsLayerConfigs
        const second = controller.gibsLayerConfigs
        expect(first).to.equal(second)
        expect(first).to.have.lengthOf(0)
    })

    it('reports loading and error state', async () => {
        apiGetStub.returns(new Promise(() => {})) // never resolves
        collectionId = ENTRY_ID
        const controller = makeController()

        expect(controller.isLoading).to.be.true
        expect(controller.hasError).to.be.false
    })
})
