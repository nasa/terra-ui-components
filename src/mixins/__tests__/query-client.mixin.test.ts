import { expect, fixture, html } from '@open-wc/testing'
import { LitElement, html as litHtml } from 'lit'
import sinon from 'sinon'
import {
    QUERY_CACHE_BUSTER,
    QueryClientMixin,
    queryClientPersister,
    sharedQueryClient,
} from '../query-client.mixin.js'

class TestQueryClientElement extends QueryClientMixin(LitElement) {
    override render() {
        return litHtml`<span>query-client-test</span>`
    }
}

if (!customElements.get('test-query-client-element')) {
    customElements.define('test-query-client-element', TestQueryClientElement)
}

describe('QueryClientMixin', () => {
    it('sets queryClient and exposes queryClientReady on connected element', async () => {
        const el = await fixture<TestQueryClientElement>(
            html`<test-query-client-element></test-query-client-element>`
        )

        expect(el.queryClient).to.equal(sharedQueryClient)
        expect(el.queryClientReady).to.be.instanceOf(Promise)
        await el.queryClientReady

        el.remove()
    })

    it('restores persisted cache once per session and manages mount lifecycle across disconnect/reconnect', async () => {
        sharedQueryClient.clear()
        const restoreStub = sinon
            .stub(queryClientPersister, 'restoreClient')
            .resolves(undefined)

        try {
            const el1 = await fixture<TestQueryClientElement>(
                html`<test-query-client-element></test-query-client-element>`
            )
            await el1.queryClientReady
            const initialPromise = el1.queryClientReady
            expect(restoreStub.callCount).to.equal(1)

            // Disconnect the only mounted element
            el1.remove()

            // Connect a new element after all disconnected
            const el2 = await fixture<TestQueryClientElement>(
                html`<test-query-client-element></test-query-client-element>`
            )
            expect(el2.queryClientReady).to.equal(initialPromise)
            await el2.queryClientReady

            // Persisted cache is only restored once per session so IndexedDB never overwrites in-memory state
            expect(restoreStub.callCount).to.equal(1)

            el2.remove()
        } finally {
            restoreStub.restore()
        }
    })

    it('handles rapid disconnect and reconnect while restore is pending without leaking subscriptions or unbalancing mounts', async () => {
        sharedQueryClient.clear()

        let resolveRestore!: () => void
        const restoreStub = sinon.stub(queryClientPersister, 'restoreClient').returns(
            new Promise<undefined>(resolve => {
                resolveRestore = () => resolve(undefined)
            })
        )

        const mountSpy = sinon.spy(sharedQueryClient, 'mount')
        const unmountSpy = sinon.spy(sharedQueryClient, 'unmount')

        try {
            // Mount el1 (starts async restore and mounts client synchronously)
            const el1 = document.createElement(
                'test-query-client-element'
            ) as TestQueryClientElement
            document.body.appendChild(el1)
            const initialReady = el1.queryClientReady
            expect(mountSpy.callCount).to.equal(1)
            expect(unmountSpy.callCount).to.equal(0)

            // Immediately disconnect el1 while restore is still pending
            el1.remove()
            expect(unmountSpy.callCount).to.equal(1)

            // Immediately connect el2 while initialReady is still in-flight
            const el2 = document.createElement(
                'test-query-client-element'
            ) as TestQueryClientElement
            document.body.appendChild(el2)
            expect(mountSpy.callCount).to.equal(2)

            // Both elements share the same one-time restore promise
            expect(el2.queryClientReady).to.equal(initialReady)

            // Resolve pending restore and await readiness
            resolveRestore()
            await el2.queryClientReady

            expect(restoreStub.callCount).to.equal(1)
            expect(unmountSpy.callCount).to.equal(1)

            // Disconnect el2
            el2.remove()
            expect(unmountSpy.callCount).to.equal(2)
        } finally {
            restoreStub.restore()
            mountSpy.restore()
            unmountSpy.restore()
        }
    })

    it('invalidates cached queries when per-query buster changes', async () => {
        sharedQueryClient.clear()
        let fetchCount = 0

        try {
            const runWithBuster = (buster: string | number) =>
                sharedQueryClient.query({
                    queryKey: ['test-buster-key'],
                    queryFn: async () => `value-${++fetchCount}`,
                    staleTime: Number.POSITIVE_INFINITY,
                    buster,
                })

            const first = await runWithBuster('v1')
            const second = await runWithBuster('v1')
            expect(first).to.equal('value-1')
            expect(second).to.equal('value-1')
            expect(fetchCount).to.equal(1)

            // Changing the per-query buster invalidates the cached entry and re-runs queryFn
            const busted = await runWithBuster('v2')
            expect(busted).to.equal('value-2')
            expect(fetchCount).to.equal(2)
        } finally {
            sharedQueryClient.clear()
        }
    })

    it('discards persisted IndexedDB cache when client-wide buster does not match QUERY_CACHE_BUSTER', async () => {
        sharedQueryClient.clear()

        const restoreStub = sinon
            .stub(queryClientPersister, 'restoreClient')
            .resolves({
                timestamp: Date.now(),
                buster: 'outdated-buster',
                clientState: {
                    mutations: [],
                    queries: [],
                },
            })
        const removeStub = sinon.stub(queryClientPersister, 'removeClient').resolves()

        try {
            expect(QUERY_CACHE_BUSTER).to.equal('v1')
            const el = await fixture<TestQueryClientElement>(
                html`<test-query-client-element></test-query-client-element>`
            )
            await el.queryClientReady

            expect(restoreStub.calledOnce).to.be.true
            expect(removeStub.calledOnce).to.be.true

            el.remove()
        } finally {
            restoreStub.restore()
            removeStub.restore()
            sharedQueryClient.clear()
        }
    })
})
