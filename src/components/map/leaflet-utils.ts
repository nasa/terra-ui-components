import * as L from 'leaflet'
import 'leaflet-draw'
import type { LatLngBoundsExpression, LatLngBoundsLiteral } from 'leaflet'
import { GiovanniGeoJsonShapes } from '../../geojson/giovanni-geojson.js'

// There is a leaflet bug with type sometimes being undefined. This is a temporary fix
// @ts-expect-error
globalThis.type = ''

export function parseBoundingBox(inputString: string) {
    // Split the string by commas to create an array of strings
    const coords = inputString.split(',')

    // Check if there are exactly four elements (two pairs of coordinates)
    if (coords.length !== 2 && coords.length !== 4) {
        throw new Error(
            'Input must contain exactly 2 or 4 numbers. e.g "9.51, 21.80" or "52.03, -9.38, 96.33, 32.90"'
        )
    }

    //Convert xy to latlng
    if (coords.length == 2) {
        return {
            lat: parseFloat(coords[0]),
            lng: parseFloat(coords[1]),
        }
    }

    // Convert each string in the array to a number and validate each conversion
    const bounds = coords.map(function (coord) {
        let num = parseFloat(coord)
        if (isNaN(num)) {
            throw new Error('All parts of the input string must be valid numbers.')
        }
        return num
    })

    // Create the bounding box for Leaflet
    const leafletBounds = [
        [bounds[1], bounds[0]],
        [bounds[3], bounds[2]],
    ]

    return leafletBounds
}

export function StringifyBoundingBox(input: any): string {
    if ('_southWest' in input && '_northEast' in input) {
        // It's a BoundingBox
        return `${input._southWest.lng.toFixed(2)}, ${input._southWest.lat.toFixed(
            2
        )}, ${input._northEast.lng.toFixed(2)}, ${input._northEast.lat.toFixed(2)}`
    } else if ('lat' in input && 'lng' in input) {
        // It's a LatLng
        return `${input.lat.toFixed(2)}, ${input.lng.toFixed(2)}`
    } else {
        throw new Error('Invalid input type')
    }
}

export interface MapViewOptions {
    latitude?: number
    longitude?: number
    zoom: number
    minZoom: number
    maxZoom: number
    hasCoordTracker?: boolean
    hasNavigation?: boolean
    hideBoundingBoxDrawTool?: boolean
    hidePointSelectionDrawTool?: boolean
    initialValue?: LatLngBoundsExpression
}

export class Leaflet {
    private readonly geoJsonRepository: GiovanniGeoJsonShapes

    constructor() {
        this.handleShapeSelect = this.handleShapeSelect.bind(this)
        this.geoJsonRepository = new GiovanniGeoJsonShapes()
    }
    map: any
    editableLayers: any
    listeners: any = []
    selectedGeoJson: any
    isMapReady: boolean = false

    // map initialization function
    initializeMap(container: HTMLElement, options: MapViewOptions) {
        this.map = new L.Map(container, {
            center:
                options.latitude && options.longitude
                    ? L.latLng(options.latitude, options.longitude)
                    : L.latLng(40.731253, -73.996139),
            zoom: options.zoom,
            attributionControl: false,
            minZoom: options.minZoom,
            maxZoom: options.maxZoom,
        })

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: options.maxZoom,
        }).addTo(this.map)

        // coord tracker true, display coord position tracker
        if (options.hasCoordTracker) {
            this.addCoordTracker()
        }

        if (options.hasNavigation) {
            this.addDrawControl(options)
        }

        this.map.whenReady((_e: any) => {
            this.isMapReady = true
            if (
                options.initialValue &&
                'lat' in options.initialValue &&
                'lng' in options.initialValue
            ) {
                L.marker(options.initialValue as any, {
                    icon: L.icon({
                        iconUrl:
                            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                        iconAnchor: [15, 40],
                        shadowUrl:
                            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    }),
                }).addTo(this.editableLayers)

                this.map.setView(options.initialValue, 5)

                return
            }

            if (
                options.initialValue &&
                ((options.initialValue as LatLngBoundsLiteral)?.length > 0 ||
                    'getNorthEast' in options.initialValue)
            ) {
                L.rectangle(options.initialValue as LatLngBoundsExpression, {
                    stroke: true,
                    color: '#3388ff',
                    weight: 4,
                    opacity: 0.5,
                    fill: true,
                    fillOpacity: 0.2,
                }).addTo(this.editableLayers)

                this.map.fitBounds(options.initialValue)
            }
        })
    }

    addCoordTracker() {
        // coord tracker extends leaflet controls
        const CoordTracker = L.Control.extend({
            options: {
                position: 'bottomleft',
                title: 'Mouse Position',
                exclude: [],
                include: [],
            },
            onAdd: function (map: any) {
                this.div = L.DomUtil.create(
                    'div',
                    'leaflet-mouse-position-container leaflet-bar'
                )
                this.p = L.DomUtil.create(
                    'p',
                    'leaflet-mouse-position-text',
                    this.div
                )
                let content = 'lat: 0, lng: 0'

                this.p.innerHTML = content

                L.DomEvent.addListener(map, 'mousemove', this._onChange, this)

                return this.div
            },
            _onChange: function (e: any) {
                this.p.innerHTML = `lat: ${Math.round(
                    e.latlng.lat
                )}, lng: ${Math.round(e.latlng.lng)}`
            },
        })

        const coordTracker = new CoordTracker()

        coordTracker.addTo(this.map)
    }

    addDrawControl(options: MapViewOptions) {
        this.editableLayers = new L.FeatureGroup()

        this.editableLayers.addTo(this.map)

        let drawControl = new L.Control.Draw({
            position: 'topleft',
            draw: {
                polyline: false,
                polygon: false,
                circle: false, // Turns off this drawing tool
                circlemarker: false,
                rectangle: options?.hideBoundingBoxDrawTool ? false : {},
                marker: options?.hidePointSelectionDrawTool
                    ? false
                    : {
                          icon: L.icon({
                              iconUrl:
                                  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                              iconAnchor: [15, 40],
                              shadowUrl:
                                  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                          }),
                      },
            },
            edit: {
                featureGroup: this.editableLayers, //REQUIRED!!
            },
        })

        this.map.addControl(drawControl)

        /** I am currently getting an error in dev console when viewing component. Error states cannot read properties of undefined (reading 'Event')
         *  switched to use string value for now  */
        this.map.on('draw:created', (event: any) => {
            this.editableLayers.clearLayers()

            const { layer, layerType } = event

            this.editableLayers.addLayer(layer)

            const detail = {
                geoJson: layer.toGeoJSON(),
                ...(layerType === 'rectangle' && { bounds: layer.getBounds() }),
                ...(layerType === 'marker' && { latLng: layer._latlng }),
            }

            this.dispatch('draw', detail)
        })

        this.map.on('draw:edited', (event: any) => {
            const { layer, layerType } = event

            const detail = {
                geoJson: layer.toGeoJSON(),
                ...(layerType === 'rectangle' && { bounds: layer.getBounds() }),
                ...(layerType === 'marker' && { latLng: layer._latlng }),
            }

            this.dispatch('draw', detail)
        })

        this.map.on('draw:deleted', (_event: any) => {
            this.editableLayers.clearLayers()

            this.dispatch('clear')
        })
    }

    on(eventName: any, callback: any) {
        this.listeners.push({
            eventName,
            callback,
        })
    }

    dispatch(eventName: any, detail: any = null) {
        const eventTriggered = this.listeners.filter(
            (listener: any) => listener.eventName === eventName
        )

        eventTriggered.forEach((listener: any) => {
            listener.callback(detail)
        })
    }

    transformShapeData(data: any) {
        const shapes = data.shapes
        const shapefileID = data.shapefileID

        const transformedShapes = Object.keys(shapes).map(key => {
            const shape = shapes[key]
            let name

            if (shapefileID === 'lakes') {
                name = shape.values[2]
            } else if (
                shapefileID === 'gpmLandMask' ||
                shapefileID === 'gpmSeaMask'
            ) {
                name = shape.values.find(
                    (value: any) => typeof value === 'string' && value.includes('deg')
                )
            } else if (
                shapefileID === 'state_dept_countries_2017' ||
                shapefileID === 'world_regions' ||
                shapefileID === 'major_world_basins'
            ) {
                name = shape.values[1]
            } else if (shapefileID === 'tl_2014_us_state') {
                name = shape.values[6]
            }

            return {
                name: name,
                [data.uniqueShapeIDField]: key,
                shapefileID: shapefileID,
            }
        })

        return transformedShapes
    }

    async handleShapeSelect(event: any) {
        event.preventDefault()

        const selectedShape = event.target.value

        if (!selectedShape) return

        const shapeGeoJson = await this.geoJsonRepository.getGeoJson(selectedShape)

        if (this.selectedGeoJson?.hasLayer) {
            this.selectedGeoJson.remove()
        }

        this.selectedGeoJson = L.geoJson(shapeGeoJson.features).addTo(
            this.editableLayers
        )

        this.map.fitBounds(this.selectedGeoJson.getBounds())

        this.dispatch('draw', {
            geoJson: this.selectedGeoJson.toGeoJSON(),
            bounds: this.selectedGeoJson.getBounds(),
        })
    }

    drawRectangle(bounds: LatLngBoundsExpression) {
        this.clearLayers()

        L.rectangle(bounds, {
            stroke: true,
            color: '#3388ff',
            weight: 4,
            opacity: 0.5,
            fill: true,
            fillOpacity: 0.2,
        }).addTo(this.editableLayers)
    }

    setValue(value: LatLngBoundsExpression) {
        if (this.isMapReady) {
            this.drawRectangle(value)
            this.map.fitBounds(value)
        }
    }

    clearLayers() {
        this.editableLayers.clearLayers()
    }
}
