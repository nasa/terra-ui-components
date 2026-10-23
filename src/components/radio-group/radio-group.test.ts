import { expect, fixture, html } from '@open-wc/testing'
import './radio-group.js'
import '../radio/radio.js'

describe('<terra-radio-group>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(
                html`<terra-radio-group label="Select option"></terra-radio-group>`
            )
            expect(el).to.exist
        })
    })

    describe('Keyboard Navigation', () => {
        it('should not throw TypeError on arrow keys when all radios are disabled (Issue #78)', async () => {
            const el: any = await fixture(html`
                <terra-radio-group label="Select option">
                    <terra-radio value="1" disabled>Option 1</terra-radio>
                    <terra-radio value="2" disabled>Option 2</terra-radio>
                </terra-radio-group>
            `)

            expect(() => {
                el.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowDown',
                        bubbles: true,
                        cancelable: true,
                    })
                )
            }).to.not.throw()

            expect(() => {
                el.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowUp',
                        bubbles: true,
                        cancelable: true,
                    })
                )
            }).to.not.throw()

            expect(() => {
                el.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: ' ',
                        bubbles: true,
                        cancelable: true,
                    })
                )
            }).to.not.throw()
        })

        it('should not throw TypeError on arrow keys when no radios exist', async () => {
            const el: any = await fixture(
                html`<terra-radio-group label="Empty group"></terra-radio-group>`
            )

            expect(() => {
                el.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowDown',
                        bubbles: true,
                        cancelable: true,
                    })
                )
            }).to.not.throw()
        })
    })
})
