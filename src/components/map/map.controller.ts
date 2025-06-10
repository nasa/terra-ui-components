import type { ReactiveController, ReactiveControllerHost } from 'lit'
import type TerraMap from './map.js'

const SHAPE_FILES_ENDPOINT =
    'https://5ejg1qg7s4.execute-api.us-east-1.amazonaws.com/default/giovanni-shape-files'

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
        const data = await fetch(SHAPE_FILES_ENDPOINT, {
            mode: 'cors',
        })

        const listOfShapes = await data.json()

        return listOfShapes
    }
}
