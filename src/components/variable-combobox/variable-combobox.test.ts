import '../../../dist/terra-ui-components.js'
import { aTimeout, expect, fixture, html, waitUntil } from '@open-wc/testing'
import sinon from 'sinon'

function okJson(body: unknown) {
    return Promise.resolve(
        new Response(JSON.stringify(body), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    )
}

describe('<terra-variable-combobox>', () => {
    beforeEach(() => {
        sinon.stub(globalThis, 'fetch').callsFake(() =>
            okJson({
                response: {
                    docs: [
                        {
                            'Collection.ShortName': 'B',
                            'Collection.Version': '01',
                            'Variable.LongName': 'B Long Name',
                            'Variable.Name': 'B',
                            'Variable.Id': 'B_id',
                            'Variable.Units': 'u',
                        },
                        {
                            'Collection.ShortName': 'C',
                            'Collection.Version': '01',
                            'Variable.LongName': 'D Long Name',
                            'Variable.Name': 'D',
                            'Variable.Id': 'D_id',
                            'Variable.Units': 'u',
                        },
                        {
                            'Collection.ShortName': 'A',
                            'Collection.Version': '01',
                            'Variable.LongName': 'A Long Name',
                            'Variable.Name': 'A',
                            'Variable.Id': 'A_id',
                            'Variable.Units': 'u',
                        },
                        {
                            'Collection.ShortName': 'C',
                            'Collection.Version': '01',
                            'Variable.LongName': 'C Long Name',
                            'Variable.Name': 'C',
                            'Variable.Id': 'C_id',
                            'Variable.Units': 'u',
                        },
                    ],
                },
            })
        )
    })

    afterEach(() => {
        sinon.restore()
    })

    it('renders', async () => {
        const el = await fixture(
            html`<terra-variable-combobox></terra-variable-combobox>`
        )
        expect(el).to.exist
    })

    it('sorts variables alphabetically by short name then long name', async () => {
        const el: any = await fixture(
            html`<terra-variable-combobox></terra-variable-combobox>`
        )

        await waitUntil(
            () =>
                (el.shadowRoot?.querySelectorAll('.listbox-option')?.length ?? 0) > 0,
            'variables did not load in time',
            { timeout: 3000 }
        )

        const options = [...el.shadowRoot.querySelectorAll('.listbox-option')]

        expect(options.map(o => o.dataset.name)).to.deep.equal(['A', 'B', 'C', 'D'])
    })

    it('shows the variable long name as the selected tag', async () => {
        const el: any = await fixture(
            html`<terra-variable-combobox
                use-tags
                value="A_id"
            ></terra-variable-combobox>`
        )

        await waitUntil(
            () => (el.shadowRoot?.querySelectorAll('.tag')?.length ?? 0) > 0,
            'variables did not load in time',
            { timeout: 3000 }
        )

        // make sure the default tag is using the variable long name
        expect(
            [...el.shadowRoot.querySelectorAll('.tag')].map(o =>
                o.textContent?.trim()
            )
        ).to.deep.equal(['A Long Name'])

        // get the option for the variable "D" and click it
        const dOption = el.shadowRoot?.querySelector('li[data-name="D"]')
        dOption?.click()

        await aTimeout(200)

        expect(
            [...el.shadowRoot.querySelectorAll('.tag')].map(o =>
                o.textContent?.trim()
            )
        ).to.deep.equal(['D Long Name'])
    })
})
