import { expect, fixture, html } from '@open-wc/testing'
import { LitElement, html as litHtml } from 'lit'
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
    })
})
