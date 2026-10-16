import { expect, fixture, html, oneEvent } from '@open-wc/testing'
import { elementUpdated, waitUntil } from '@open-wc/testing-helpers'
import './tabs.js'
import '../tab/tab.js'
import '../tab-panel/tab-panel.js'

const basicTabs = html`
    <terra-tabs>
        <terra-tab slot="nav" panel="general">General</terra-tab>
        <terra-tab slot="nav" panel="custom">Custom</terra-tab>
        <terra-tab slot="nav" panel="advanced" disabled>Advanced</terra-tab>

        <terra-tab-panel name="general">General panel</terra-tab-panel>
        <terra-tab-panel name="custom">Custom panel</terra-tab-panel>
        <terra-tab-panel name="advanced">Advanced panel</terra-tab-panel>
    </terra-tabs>
`

describe('<terra-tabs>', () => {
    describe('Basic Rendering', () => {
        it('should render a component', async () => {
            const el = await fixture(basicTabs)
            expect(el).to.exist
        })

        it('should render with base part', async () => {
            const el: any = await fixture(basicTabs)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base).to.exist
        })

        it('should render a tablist', async () => {
            const el: any = await fixture(basicTabs)
            const tablist = el.shadowRoot?.querySelector('[part~="tabs"]')
            expect(tablist?.getAttribute('role')).to.equal('tablist')
        })

        it('should render slotted tabs and panels', async () => {
            const el: any = await fixture(basicTabs)
            expect(el.querySelectorAll('terra-tab').length).to.equal(3)
            expect(el.querySelectorAll('terra-tab-panel').length).to.equal(3)
        })
    })

    describe('Properties', () => {
        it('should default placement to top', async () => {
            const el: any = await fixture(basicTabs)
            expect(el.placement).to.equal('top')
        })

        it('should default activation to auto', async () => {
            const el: any = await fixture(basicTabs)
            expect(el.activation).to.equal('auto')
        })

        it('should default size to large', async () => {
            const el: any = await fixture(basicTabs)
            expect(el.size).to.equal('large')
        })

        it('should apply a placement class', async () => {
            const el: any = await fixture(html`
                <terra-tabs placement="bottom">
                    <terra-tab slot="nav" panel="a">A</terra-tab>
                    <terra-tab-panel name="a">A panel</terra-tab-panel>
                </terra-tabs>
            `)
            const base = el.shadowRoot?.querySelector('[part~="base"]')
            expect(base?.classList.contains('tabs--bottom')).to.be.true
        })

        it('should sync size to child tabs that do not set their own size', async () => {
            const el: any = await fixture(html`
                <terra-tabs size="small">
                    <terra-tab slot="nav" panel="a">A</terra-tab>
                    <terra-tab slot="nav" panel="b" size="large">B</terra-tab>
                    <terra-tab-panel name="a">A panel</terra-tab-panel>
                    <terra-tab-panel name="b">B panel</terra-tab-panel>
                </terra-tabs>
            `)
            await waitUntil(() => {
                const tabA = el.querySelector('terra-tab[panel="a"]')
                return tabA?.size === 'small'
            })

            const [tabA, tabB] = el.querySelectorAll('terra-tab')
            expect(tabA.size).to.equal('small')
            expect(tabB.size).to.equal('large')
        })
    })

    describe('Initial Activation', () => {
        it('should activate the first tab by default', async () => {
            const el: any = await fixture(basicTabs)
            await waitUntil(() => el.querySelector('terra-tab[active]'))

            const activeTab = el.querySelector('terra-tab[active]')
            const activePanel = el.querySelector('terra-tab-panel[active]')
            expect(activeTab.getAttribute('panel')).to.equal('general')
            expect(activePanel.getAttribute('name')).to.equal('general')
        })
    })

    describe('User Interaction', () => {
        it('should activate a tab when clicked', async () => {
            const el: any = await fixture(basicTabs)
            await waitUntil(() => el.querySelector('terra-tab[active]'))

            const [, customTab] = el.querySelectorAll('terra-tab')
            const eventPromise = oneEvent(el, 'terra-tab-show')
            customTab.click()
            const event = await eventPromise

            expect(event.detail.name).to.equal('custom')
            expect(customTab.active).to.be.true

            const activePanel = el.querySelector('terra-tab-panel[active]')
            expect(activePanel.getAttribute('name')).to.equal('custom')
        })

        it('should emit terra-tab-hide for the previously active tab', async () => {
            const el: any = await fixture(basicTabs)
            await waitUntil(() => el.querySelector('terra-tab[active]'))

            const [, customTab] = el.querySelectorAll('terra-tab')
            const hidePromise = oneEvent(el, 'terra-tab-hide')
            customTab.click()
            const event = await hidePromise

            expect(event.detail.name).to.equal('general')
        })

        it('should not activate a disabled tab when clicked', async () => {
            const el: any = await fixture(basicTabs)
            await waitUntil(() => el.querySelector('terra-tab[active]'))

            const [, , advancedTab] = el.querySelectorAll('terra-tab')
            advancedTab.click()
            await elementUpdated(el)

            expect(advancedTab.active).to.be.false
            const activeTab = el.querySelector('terra-tab[active]')
            expect(activeTab.getAttribute('panel')).to.equal('general')
        })

        it('should show the requested panel via the show() method', async () => {
            const el: any = await fixture(basicTabs)
            await waitUntil(() => el.querySelector('terra-tab[active]'))

            el.show('custom')
            await elementUpdated(el)

            const activePanel = el.querySelector('terra-tab-panel[active]')
            expect(activePanel.getAttribute('name')).to.equal('custom')
        })
    })

    describe('Keyboard Navigation', () => {
        it('should move focus and activate the next tab with ArrowRight', async () => {
            const el: any = await fixture(basicTabs)
            await waitUntil(() => el.querySelector('terra-tab[active]'))

            const [generalTab, customTab] = el.querySelectorAll('terra-tab')
            generalTab.focus()
            generalTab.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'ArrowRight',
                    bubbles: true,
                    composed: true,
                })
            )
            await elementUpdated(el)

            expect(customTab.active).to.be.true
            expect(document.activeElement === customTab).to.be.true
        })

        it('should skip disabled tabs when navigating with arrow keys', async () => {
            const el: any = await fixture(basicTabs)
            await waitUntil(() => el.querySelector('terra-tab[active]'))

            const [, customTab, ,] = el.querySelectorAll('terra-tab')
            customTab.focus()
            customTab.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'ArrowRight',
                    bubbles: true,
                    composed: true,
                })
            )
            await elementUpdated(el)

            // Advanced is disabled, so focus/activation should wrap back to General
            const generalTab = el.querySelector('terra-tab[panel="general"]')
            expect(generalTab.active).to.be.true
        })

        it('should jump to the last focusable tab with End', async () => {
            const el: any = await fixture(basicTabs)
            await waitUntil(() => el.querySelector('terra-tab[active]'))

            const [generalTab] = el.querySelectorAll('terra-tab')
            generalTab.focus()
            generalTab.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'End',
                    bubbles: true,
                    composed: true,
                })
            )
            await elementUpdated(el)

            const customTab = el.querySelector('terra-tab[panel="custom"]')
            expect(customTab.active).to.be.true
        })

        it('should not activate a tab on arrow navigation in manual mode until Enter is pressed', async () => {
            const el: any = await fixture(html`
                <terra-tabs activation="manual">
                    <terra-tab slot="nav" panel="general">General</terra-tab>
                    <terra-tab slot="nav" panel="custom">Custom</terra-tab>
                    <terra-tab-panel name="general">General panel</terra-tab-panel>
                    <terra-tab-panel name="custom">Custom panel</terra-tab-panel>
                </terra-tabs>
            `)
            await waitUntil(() => el.querySelector('terra-tab[active]'))

            const [generalTab, customTab] = el.querySelectorAll('terra-tab')
            generalTab.focus()
            generalTab.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'ArrowRight',
                    bubbles: true,
                    composed: true,
                })
            )
            await elementUpdated(el)

            expect(generalTab.active).to.be.true
            expect(customTab.active).to.be.false

            customTab.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true,
                    composed: true,
                })
            )
            await elementUpdated(el)

            expect(customTab.active).to.be.true
        })
    })

    describe('Scroll Controls', () => {
        it('should show scroll controls when tabs overflow the nav', async () => {
            const el: any = await fixture(html`
                <div style="width: 150px;">
                    <terra-tabs>
                        ${Array.from(
                            { length: 10 },
                            (_, i) =>
                                html`<terra-tab slot="nav" panel="tab-${i}"
                                    >Tab ${i}</terra-tab
                                >`
                        )}
                        ${Array.from(
                            { length: 10 },
                            (_, i) =>
                                html`<terra-tab-panel name="tab-${i}"
                                    >Panel ${i}</terra-tab-panel
                                >`
                        )}
                    </terra-tabs>
                </div>
            `)
            const tabs = el.querySelector('terra-tabs')
            await waitUntil(() =>
                tabs.shadowRoot?.querySelector('[part~="scroll-button--start"]')
            )

            const scrollButton = tabs.shadowRoot?.querySelector(
                '[part~="scroll-button--start"]'
            )
            expect(scrollButton).to.exist
        })

        it('should not show scroll controls when noScrollControls is set', async () => {
            const el: any = await fixture(html`
                <div style="width: 150px;">
                    <terra-tabs no-scroll-controls>
                        ${Array.from(
                            { length: 10 },
                            (_, i) =>
                                html`<terra-tab slot="nav" panel="tab-${i}"
                                    >Tab ${i}</terra-tab
                                >`
                        )}
                        ${Array.from(
                            { length: 10 },
                            (_, i) =>
                                html`<terra-tab-panel name="tab-${i}"
                                    >Panel ${i}</terra-tab-panel
                                >`
                        )}
                    </terra-tabs>
                </div>
            `)
            const tabs = el.querySelector('terra-tabs')
            await elementUpdated(tabs)

            const scrollButton = tabs.shadowRoot?.querySelector(
                '[part~="scroll-button--start"]'
            )
            expect(scrollButton).to.not.exist
        })
    })

    describe('Edge Cases', () => {
        it('should handle a tabs component with no slotted tabs', async () => {
            const el: any = await fixture(html` <terra-tabs></terra-tabs> `)
            await elementUpdated(el)
            expect(el).to.exist
        })

        it('should handle a single tab', async () => {
            const el: any = await fixture(html`
                <terra-tabs>
                    <terra-tab slot="nav" panel="only">Only</terra-tab>
                    <terra-tab-panel name="only">Only panel</terra-tab-panel>
                </terra-tabs>
            `)
            await waitUntil(() => el.querySelector('terra-tab[active]'))
            const activeTab = el.querySelector('terra-tab[active]')
            expect(activeTab.getAttribute('panel')).to.equal('only')
        })
    })
})
