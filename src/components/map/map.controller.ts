import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type TerraMap from './map.js'

export class MapController implements ReactiveController {
    private host: ReactiveControllerHost & TerraMap

    constructor(host: ReactiveControllerHost & TerraMap) {
        this.host = host

        this.host.addController(this)
    }

    async hostConnected() {
        if (this.host.hasShapeSelector) {
            this.host.shapes = await this.getShapeFiles()
        }
    }

    private async getShapeFiles() {
        const data = await fetch('http://localhost:9000/getProvisionedShapefiles', {
            mode: 'cors',
        })

        const listOfShapes = await data.json()

        return listOfShapes
    }
}
