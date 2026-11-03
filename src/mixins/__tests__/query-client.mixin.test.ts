import { expect, fixture, html } from '@open-wc/testing'
import { LitElement, html as litHtml } from 'lit'
import sinon from 'sinon'
import { QueryClientMixin, sharedQueryClient } from '../query-client.mixin.js'

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
        await new Promise(r => setTimeout(r, 20))
    })

    it('resets mountPromise when all components disconnect and reinstantiates on reconnect', async () => {
        const el1 = await fixture<TestQueryClientElement>(
            html`<test-query-client-element></test-query-client-element>`
        )
        await el1.queryClientReady
        const initialPromise = el1.queryClientReady

        // Disconnect the only mounted element
        el1.remove()

        // Give the microtask queue a tick for disconnect/unmount cleanup
        await new Promise(r => setTimeout(r, 20))

        // Connect a new element after all disconnected
        const el2 = await fixture<TestQueryClientElement>(
            html`<test-query-client-element></test-query-client-element>`
        )
        expect(el2.queryClientReady).to.be.instanceOf(Promise)
        expect(el2.queryClientReady).to.not.equal(initialPromise)
        await el2.queryClientReady

        el2.remove()
        await new Promise(r => setTimeout(r, 20))
    })

    it('handles rapid disconnect and reconnect without leaking subscriptions or double mounting', async () => {
        const mountSpy = sinon.spy(sharedQueryClient, 'mount')
        const unmountSpy = sinon.spy(sharedQueryClient, 'unmount')

        try {
            // Mount el1
            const el1 = document.createElement(
                'test-query-client-element'
            ) as TestQueryClientElement
            document.body.appendChild(el1)
            const initialReady = el1.queryClientReady

            // Immediately disconnect el1 before initialReady settles
            el1.remove()

            // Immediately connect el2 while initialReady is still in-flight
            const el2 = document.createElement(
                'test-query-client-element'
            ) as TestQueryClientElement
            document.body.appendChild(el2)

            // Both elements should share the same in-flight mountPromise
            expect(el2.queryClientReady).to.equal(initialReady)

            // Await readiness
            await el2.queryClientReady

            // Shared client should have been mounted exactly once
            expect(mountSpy.callCount).to.equal(1)
            expect(unmountSpy.callCount).to.equal(0)

            // Disconnect el2
            el2.remove()
            await new Promise(r => setTimeout(r, 20))

            // Now unmount should have been called exactly once
            expect(unmountSpy.callCount).to.equal(1)
        } finally {
            mountSpy.restore()
            unmountSpy.restore()
        }
    })
})
