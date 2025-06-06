import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type TerraMap from './map.js'
import { GiovanniGeoJsonShapesRepository } from '../../geojson/giovanni-geojson-repository.js'

export class MapController implements ReactiveController {
    private host: ReactiveControllerHost & TerraMap
    private readonly geoJsonRepository: GiovanniGeoJsonShapesRepository

    constructor(host: ReactiveControllerHost & TerraMap) {
        this.host = host
        this.geoJsonRepository = new GiovanniGeoJsonShapesRepository()
        this.host.addController(this)
    }

    async hostConnected() {
        if (this.host.hasShapeSelector) {
            this.host.shapes = await this.geoJsonRepository.getShapeFiles()
        }
    }
}
