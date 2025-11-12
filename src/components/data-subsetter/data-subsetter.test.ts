import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-data-subsetter>', () => {
    it('should render a component', async () => {
        const el = await fixture(html`
            <terra-data-subsetter></terra-data-subsetter>
        `)

        expect(el).to.exist
    })

    it('should show mode selection when collection is selected', async () => {
        const el = await fixture(html`
            <terra-data-subsetter
                collection-entry-id="test-collection"
                show-collection-search="false"
            >
            </terra-data-subsetter>
        `)

        // Wait for the component to initialize
        await el.updateComplete

        // Check if mode selection is present
        const modeSelection = el.shadowRoot?.querySelector('.mode-selection')
        expect(modeSelection).to.exist
    })

    it('should show data-access component when original mode is selected', async () => {
        const el = await fixture(html`
            <terra-data-subsetter
                collection-entry-id="test-collection"
                show-collection-search="false"
            >
            </terra-data-subsetter>
        `)

        // Wait for the component to initialize
        await el.updateComplete

        // Set the mode to original
        el.dataAccessMode = 'original'
        await el.updateComplete

        // Check if data-access component is present
        const dataAccessComponent = el.shadowRoot?.querySelector('terra-data-access')
        expect(dataAccessComponent).to.exist
    })

    it('should show subset options when subset mode is selected', async () => {
        const el = await fixture(html`
            <terra-data-subsetter
                collection-entry-id="test-collection"
                show-collection-search="false"
            >
            </terra-data-subsetter>
        `)

        // Wait for the component to initialize
        await el.updateComplete

        // Set the mode to subset (default)
        el.dataAccessMode = 'subset'
        await el.updateComplete

        // Check if subset options are present
        const subsetSection = el.shadowRoot?.querySelector('.section h2')
        expect(subsetSection?.textContent).to.include('Subset Options')
    })
})
