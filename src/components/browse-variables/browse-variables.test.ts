import { expect, fixture, html, elementUpdated } from '@open-wc/testing'
import sinon from 'sinon'
import './browse-variables.js'

// Helper to create a mock GraphQL response for Apollo Client
function okJson(body: unknown) {
    return Promise.resolve(
        new Response(JSON.stringify(body), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    )
}

// Mock GraphQL response structure that Apollo Client expects
const mockGraphQLResponse = {
    data: {
        getVariables: {
            variables: [],
            facets: [],
            total: 0,
            count: 0,
        },
        aesirKeywords: [{ id: '123' }],
    },
    errors: undefined,
}

describe('<terra-browse-variables>', () => {
    let fetchStub: sinon.SinonStub

    beforeEach(() => {
        // Mock fetch for Apollo Client's HttpLink
        // Apollo Client makes POST requests to the GraphQL endpoint
        fetchStub = sinon.stub(globalThis, 'fetch').callsFake(() => {
            // Return mock response for any GraphQL requests
            return okJson(mockGraphQLResponse)
        })
    })

    afterEach(() => {
        sinon.restore()
    })

    it('renders the browse variables component', async () => {
        const el = await fixture<HTMLDivElement>(
            html`<terra-browse-variables></terra-browse-variables>`
        )
        expect(el).to.exist
    })

    describe('Browsing Text', () => {
        it('should show "Browsing variables for query `query`" when only query is present', async () => {
            const el: any = await fixture(html`
                <terra-browse-variables></terra-browse-variables>
            `)

            el.searchQuery = 'imerg daily'
            el.showVariablesBrowse = true
            await elementUpdated(el)

            const header = el.shadowRoot?.querySelector('.variables-container header')
            const browsingTextDiv = header?.querySelector('div')

            expect(browsingTextDiv).to.exist
            expect(browsingTextDiv?.textContent?.trim()).to.equal(
                'Browsing variables for query `imerg daily`'
            )
        })

        it('should show "Browsing \'Facet\' variables" when only one facet is selected', async () => {
            const el: any = await fixture(html`
                <terra-browse-variables></terra-browse-variables>
            `)

            el.selectedFacets = {
                disciplines: ['Aerosol'],
            }
            el.showVariablesBrowse = true
            await elementUpdated(el)

            const header = el.shadowRoot?.querySelector('.variables-container header')
            const browsingTextDiv = header?.querySelector('div')

            expect(browsingTextDiv).to.exist
            expect(browsingTextDiv?.textContent?.trim()).to.equal(
                "Browsing 'Aerosol' variables"
            )
        })

        it("should show \"Browsing 'Facet1' and 'Facet2' variables\" when two facets are selected", async () => {
            const el: any = await fixture(html`
                <terra-browse-variables></terra-browse-variables>
            `)

            el.selectedFacets = {
                disciplines: ['Aerosol', 'Another'],
            }
            el.showVariablesBrowse = true
            await elementUpdated(el)

            const header = el.shadowRoot?.querySelector('.variables-container header')
            const browsingTextDiv = header?.querySelector('div')

            expect(browsingTextDiv).to.exist
            expect(browsingTextDiv?.textContent?.trim()).to.equal(
                "Browsing 'Aerosol' and 'Another' variables"
            )
        })

        it("should show \"Browsing 'Facet1', 'Facet2', and 'Facet3' variables\" when three facets are selected", async () => {
            const el: any = await fixture(html`
                <terra-browse-variables></terra-browse-variables>
            `)

            el.selectedFacets = {
                disciplines: ['Aerosol', 'Another', 'Something'],
            }
            el.showVariablesBrowse = true
            await elementUpdated(el)

            const header = el.shadowRoot?.querySelector('.variables-container header')
            const browsingTextDiv = header?.querySelector('div')

            expect(browsingTextDiv).to.exist
            expect(browsingTextDiv?.textContent?.trim()).to.equal(
                "Browsing 'Aerosol', 'Another', and 'Something' variables"
            )
        })

        it('should properly format four or more facets with commas and "and"', async () => {
            const el: any = await fixture(html`
                <terra-browse-variables></terra-browse-variables>
            `)

            el.selectedFacets = {
                disciplines: ['Aerosol', 'Another', 'Something', 'Fourth'],
            }
            el.showVariablesBrowse = true
            await elementUpdated(el)

            const header = el.shadowRoot?.querySelector('.variables-container header')
            const browsingTextDiv = header?.querySelector('div')

            expect(browsingTextDiv).to.exist
            expect(browsingTextDiv?.textContent?.trim()).to.equal(
                "Browsing 'Aerosol', 'Another', 'Something', and 'Fourth' variables"
            )
        })

        it('should handle facets from multiple categories', async () => {
            const el: any = await fixture(html`
                <terra-browse-variables></terra-browse-variables>
            `)

            el.selectedFacets = {
                disciplines: ['Aerosol'],
                measurements: ['Temperature', 'Humidity'],
            }
            el.showVariablesBrowse = true
            await elementUpdated(el)

            const header = el.shadowRoot?.querySelector('.variables-container header')
            const browsingTextDiv = header?.querySelector('div')

            expect(browsingTextDiv).to.exist
            const text = browsingTextDiv?.textContent?.trim()
            expect(text).to.include('Browsing')
            expect(text).to.include("'Aerosol'")
            expect(text).to.include("'Temperature'")
            expect(text).to.include("'Humidity'")
            expect(text).to.include('variables')
            // Should have proper formatting with commas and "and"
            expect(text).to.match(/, and '/)
        })

        it('should show "Browsing \'Facet\' variables for query `query`" when one facet and query are present', async () => {
            const el: any = await fixture(html`
                <terra-browse-variables></terra-browse-variables>
            `)

            el.selectedFacets = {
                disciplines: ['Aerosol'],
            }
            el.searchQuery = 'imerg daily'
            el.showVariablesBrowse = true
            await elementUpdated(el)

            const header = el.shadowRoot?.querySelector('.variables-container header')
            const browsingTextDiv = header?.querySelector('div')

            expect(browsingTextDiv).to.exist
            expect(browsingTextDiv?.textContent?.trim()).to.equal(
                "Browsing 'Aerosol' variables for query `imerg daily`"
            )
        })

        it("should show \"Browsing 'Facet1' and 'Facet2' variables for query `query`\" when two facets and query are present", async () => {
            const el: any = await fixture(html`
                <terra-browse-variables></terra-browse-variables>
            `)

            el.selectedFacets = {
                disciplines: ['Aerosol', 'Another'],
            }
            el.searchQuery = 'imerg daily'
            el.showVariablesBrowse = true
            await elementUpdated(el)

            const header = el.shadowRoot?.querySelector('.variables-container header')
            const browsingTextDiv = header?.querySelector('div')

            expect(browsingTextDiv).to.exist
            expect(browsingTextDiv?.textContent?.trim()).to.equal(
                "Browsing 'Aerosol' and 'Another' variables for query `imerg daily`"
            )
        })

        it("should show \"Browsing 'Facet1', 'Facet2', and 'Facet3' variables for query `query`\" when three facets and query are present", async () => {
            const el: any = await fixture(html`
                <terra-browse-variables></terra-browse-variables>
            `)

            el.selectedFacets = {
                disciplines: ['Aerosol', 'Another', 'Something'],
            }
            el.searchQuery = 'imerg daily'
            el.showVariablesBrowse = true
            await elementUpdated(el)

            const header = el.shadowRoot?.querySelector('.variables-container header')
            const browsingTextDiv = header?.querySelector('div')

            expect(browsingTextDiv).to.exist
            expect(browsingTextDiv?.textContent?.trim()).to.equal(
                "Browsing 'Aerosol', 'Another', and 'Something' variables for query `imerg daily`"
            )
        })

        it('should handle facets with empty arrays', async () => {
            const el: any = await fixture(html`
                <terra-browse-variables></terra-browse-variables>
            `)

            el.selectedFacets = {
                disciplines: [],
                measurements: ['Temperature'],
            }
            el.showVariablesBrowse = true
            await elementUpdated(el)

            const header = el.shadowRoot?.querySelector('.variables-container header')
            const browsingTextDiv = header?.querySelector('div')

            expect(browsingTextDiv).to.exist
            expect(browsingTextDiv?.textContent?.trim()).to.equal(
                "Browsing 'Temperature' variables"
            )
        })

        it('should handle query with special characters', async () => {
            const el: any = await fixture(html`
                <terra-browse-variables></terra-browse-variables>
            `)

            el.searchQuery = 'test query with "quotes" and `backticks`'
            el.showVariablesBrowse = true
            await elementUpdated(el)

            const header = el.shadowRoot?.querySelector('.variables-container header')
            const browsingTextDiv = header?.querySelector('div')

            expect(browsingTextDiv).to.exist
            expect(browsingTextDiv?.textContent?.trim()).to.equal(
                'Browsing variables for query `test query with "quotes" and `backticks``'
            )
        })

        it('should handle facets with special characters in names', async () => {
            const el: any = await fixture(html`
                <terra-browse-variables></terra-browse-variables>
            `)

            el.selectedFacets = {
                disciplines: ["Aerosol's", "Another's"],
            }
            el.showVariablesBrowse = true
            await elementUpdated(el)

            const header = el.shadowRoot?.querySelector('.variables-container header')
            const browsingTextDiv = header?.querySelector('div')

            expect(browsingTextDiv).to.exist
            expect(browsingTextDiv?.textContent?.trim()).to.equal(
                "Browsing 'Aerosol's' and 'Another's' variables"
            )
        })
    })
})
