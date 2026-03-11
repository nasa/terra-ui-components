import { expect } from '@open-wc/testing'
import './time-series.js'

describe('<terra-time-series>', () => {
    it('should parse JSON variable-entry-ids attribute values', () => {
        const el = document.createElement('terra-time-series') as any

        el.setAttribute('variable-entry-ids', '["A_B_c", "D_E_f"]')

        expect(el.variableEntryIds).to.deep.equal(['A_B_c', 'D_E_f'])
    })

    it('should parse comma-delimited variable-entry-ids attribute values', () => {
        const el = document.createElement('terra-time-series') as any

        el.setAttribute('variable-entry-ids', 'A_B_c, D_E_f, G_H_i')

        expect(el.variableEntryIds).to.deep.equal(['A_B_c', 'D_E_f', 'G_H_i'])
    })

    it('should allow variableEntryIds property assignment', () => {
        const el = document.createElement('terra-time-series') as any

        el.variableEntryIds = ['A_B_c', 'D_E_f']

        expect(el.variableEntryIds).to.deep.equal(['A_B_c', 'D_E_f'])
    })
})
