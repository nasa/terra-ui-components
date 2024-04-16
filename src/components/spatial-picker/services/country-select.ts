import * as L from 'leaflet'
import CountriesShapes from './geo-json/countries.geo.json'

console.log(CountriesShapes)

// @ts-ignore
L.CountrySelect = {}

// @ts-ignore
L.CountrySelect = L.Control.extend({
    options: {
        position: 'bottomright',
        title: 'Countries and Areas',
        exclude: [],
        include: [],
        countries: CountriesShapes.features,
    },
    onAdd: function (map: any) {
        this.div = L.DomUtil.create('div', 'leaflet-countryselect-container')
        this.select = L.DomUtil.create('select', 'leaflet-countryselect', this.div)
        let content = ''

        if (this.options.title.length > 0) {
            content += `<option>${this.options.title}</option>`
        }

        console.log('option countries: ', this.options.countries)

        let countries = this.options.countries

        // var countryKeys = Object.keys(countries).sort();
        for (const country of countries) {
            content += `<option value="${country.id}">${country.properties.name}</option>`
        }

        this.select.innerHTML = content

        this.select.onmousedown = L.DomEvent.stopPropagation

        return this.div
    },
    on: function (type: any, handler: any) {
        if (type == 'change') {
            this.onChange = handler
            L.DomEvent.addListener(this.select, 'change', this._onChange, this)
        } else if (type == 'click') {
            //don't need this here probably, but for convenience?
            this.onClick = handler
            L.DomEvent.addListener(this.select, 'click', this.onClick, this)
        } else {
            console.log('CountrySelect - cannot handle ' + type + ' events.')
        }
    },
    _onChange: function (e: any) {
        console.log(
            'onchange: this.select.options[this.select.selectedIndex]',
            this.select.options[this.select.selectedIndex]
        )
        let selectedCountry = this.select.options[this.select.selectedIndex].value
        e.feature = this.options.countries.find(
            (country: any) => selectedCountry === country.id
        )
        this.onChange(e)
    },
})

// @ts-expect-error

L.countrySelect = function (id, options) {
    // @ts-expect-error
    return new L.CountrySelect(id, options)
}
