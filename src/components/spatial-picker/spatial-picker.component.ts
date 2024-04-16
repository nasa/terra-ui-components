import * as L from 'leaflet'
import type { CSSResultGroup } from 'lit'
import { html } from 'lit'
import { property, query } from 'lit/decorators.js'
import GDElement from '../../internal/gd-element.js'
import componentStyles from '../../styles/component.styles.js'
import styles from './spatial-picker.styles.js'

// import './services/country-select.js'

import 'leaflet-draw'

// This is needed to fix the error: Uncaught ReferenceError: type is not defined
// @ts-ignore
window.type = ''

/**
 * @summary Short summary of the component's intended use.
 * @documentation https://disc.gsfc.nasa.gov/components/spatial-picker
 * @status experimental
 * @since 1.0
 *
 * @dependency gd-example
 *
 * @slot - The default slot.
 * @slot example - An example slot.
 *
 * @csspart base - The component's base wrapper.
 *
 * @cssproperty --example - An example CSS custom property.
 */
export default class GdSpatialPicker extends GDElement {
    static styles: CSSResultGroup = [componentStyles, styles]

    @property() minZoom: number = 0
    @property() maxZoom: number = 24
    @property() zoom: number = 0
    @property() latitude: number = 0
    @property() longitude: number = 0
    @property() fitWorld: boolean = false
    @property() width: number
    @property() height: number
    @property() showNavigation: boolean = true

    @query('#map')
    mapElement!: HTMLDivElement

    connectedCallback(): void {
        super.connectedCallback()

        console.log(this.mapElement)
    }

    /**
     * The map initialization function
     */
    initializeMap() {
        const options = {
            center: L.latLng(40.731253, -73.996139),
            zoom: 3,
        }

        console.log('this.mapElement: ', this.mapElement)
        let myMap = new L.Map(this.mapElement, options)
        const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 24,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(myMap)

        // @ts-ignore
        // const selectCountry = L.countrySelect()

        // selectCountry.addTo(myMap)

        // selectCountry.on('change', function (e: any) {
        //     if (e.feature === undefined) {
        //         //Do nothing on title
        //         console.log('select country on change', e)
        //         return
        //     }
        //     let country = L.geoJson(e.feature)

        //     console.log('country is found: ', country)
        //     if (this.previousCountry != null) {
        //         myMap.removeLayer(this.previousCountry)
        //     }
        //     this.previousCountry = country

        //     myMap.addLayer(country)
        //     myMap.fitBounds(country.getBounds())
        // })

        let editableLayers = new L.FeatureGroup()

        editableLayers.addTo(myMap)

        //// @ts-ignore
        let drawControl = new L.Control.Draw({
            position: 'topright',
            draw: {
                polyline: false,
                polygon: false,
                circle: false, // Turns off this drawing tool
                circlemarker: false,
                rectangle: {},
                marker: {
                    icon: L.icon({
                        iconUrl:
                            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                        iconSize: [25, 41],
                        shadowUrl:
                            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                        shadowSize: [41, 41],
                    }),
                },
            },
            edit: {
                featureGroup: editableLayers, //REQUIRED!!
            },
        })

        myMap.addControl(drawControl)

        // I am currently getting an error in dev console when viewing component. Error states cannot read properties of undefined (reading 'Event')
        // switched to use string value for now
        myMap.on('draw:created', function (event) {
            editableLayers.clearLayers()

            let layer = event.layer

            console.log(layer)

            editableLayers.addLayer(layer)
        })
    }

    firstUpdated() {
        console.log(this.mapElement)
        //@ts-ignore
        console.log(L)
        this.initializeMap()
    }

    render() {
        return html`
            <style>
                @import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
                @import url('https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css');
            </style>
            <div class="spatial-picker">
                <div class="spatial-picker__input_fields"></div>
                <div class="spatial-picker__map">
                    <div class="spatial-picker__map__container">
                        <!-- "Map goes here" -->
                        <div
                            id="map"
                            class="spatial-picker__map__container__map"
                        ></div>
                    </div>
                </div>
            </div>
        `
    }
}
