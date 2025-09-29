import '../../../dist/terra-ui-components.js'
import { expect, fixture, html, waitUntil } from '@open-wc/testing'
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
                            'Variable.LongName': 'B',
                            'Variable.Name': 'B',
                            'Variable.Id': 'B_id',
                            'Variable.Units': 'u',
                        },
                        {
                            'Collection.ShortName': 'C',
                            'Collection.Version': '01',
                            'Variable.LongName': 'D',
                            'Variable.Name': 'D',
                            'Variable.Id': 'D_id',
                            'Variable.Units': 'u',
                        },
                        {
                            'Collection.ShortName': 'A',
                            'Collection.Version': '01',
                            'Variable.LongName': 'A',
                            'Variable.Name': 'A',
                            'Variable.Id': 'A_id',
                            'Variable.Units': 'u',
                        },
                        {
                            'Collection.ShortName': 'C',
                            'Collection.Version': '01',
                            'Variable.LongName': 'C',
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

    it('should sort variables alphabetically by short name then long name', async () => {
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

        console.log(options.map(o => o.dataset.longName))

        expect(options.map(o => o.dataset.longName)).to.deep.equal([
            'A',
            'B',
            'C',
            'D',
        ])
    })
})
