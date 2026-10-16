import { expect, fixture, html } from '@open-wc/testing'
import './combobox.js'

describe('<terra-combobox>', () => {
    describe('Lifecycle and Event Cleanup', () => {
        it('should remove window click event listener on disconnectedCallback (Issue #75)', async () => {
            let addCount = 0
            let removeCount = 0

            const originalAdd = globalThis.addEventListener
            const originalRemove = globalThis.removeEventListener

            globalThis.addEventListener = ((
                type: string,
                listener: any,
                options: any
            ) => {
                if (type === 'click') {
                    addCount++
                }
                return originalAdd.call(globalThis, type, listener, options)
            }) as any

            globalThis.removeEventListener = ((
                type: string,
                listener: any,
                options: any
            ) => {
                if (type === 'click') {
                    removeCount++
                }
                return originalRemove.call(globalThis, type, listener, options)
            }) as any

            try {
                const el = await fixture(html`<terra-combobox></terra-combobox>`)
                expect(addCount).to.be.greaterThan(0)

                const currentAddCount = addCount
                const currentRemoveCount = removeCount

                // Disconnect element
                el.remove()

                // disconnectedCallback must call removeEventListener, not addEventListener
                expect(removeCount).to.be.greaterThan(currentRemoveCount)
                expect(addCount).to.equal(currentAddCount)
            } finally {
                globalThis.addEventListener = originalAdd
                globalThis.removeEventListener = originalRemove
            }
        })
    })
})
