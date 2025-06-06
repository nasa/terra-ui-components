import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type TerraMap from './map.js'
import { GiovanniGeoJsonShapes } from '../../geojson/giovanni-geojson.js'

export class MapController implements ReactiveController {
    private host: ReactiveControllerHost & TerraMap
    private readonly geoJsonShapes: GiovanniGeoJsonShapes

    constructor(host: ReactiveControllerHost & TerraMap) {
        this.host = host
        this.geoJsonShapes = new GiovanniGeoJsonShapes()
        this.host.addController(this)
    }

    async hostConnected() {
        if (this.host.hasShapeSelector) {
            this.host.shapes = await this.geoJsonShapes.getShapeFiles()
        }
    }
}
