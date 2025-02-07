import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'

type Facets = {
    depths: FacetField[]
    disciplines: FacetField[]
    measurements: FacetField[]
    observations: FacetField[]
    platformInstruments: FacetField[]
    portals: FacetField[]
    spatialResolutions: FacetField[]
    specialFeatures: FacetField[]
    temporalResolutions: FacetField[]
    wavelengths: FacetField[]
}

type FacetField = {
    name: string
    count: number
}

//? there are quite a few more properties available, look at the response directly
type Variable = {
    dataProductShortName: string
    dataProductVersion: string
    dataFieldShortName: string
    dataFieldLongName: string
    dataProductLongName: string
    dataProductTimeInterval: string
    dataProductWest: number
    dataProductSouth: number
    dataProductEast: number
    dataProductNorth: number
    dataProductSpatialResolution: string
    dataProductBeginDateTime: string
    dataProductEndDateTime: string
}

export class GiovanniBrowseController {
    facets: Facets
    variables: Variable[]

    #task: Task<[], any[]>

    constructor(host: ReactiveControllerHost) {
        this.#task = new Task(host, {
            task: async (_args, { signal }) => {
                const response = await fetch(
                    'https://windmill-load-balancer-641499207.us-east-1.elb.amazonaws.com/api/r/giovanni/catalog',
                    { signal }
                )

                if (!response.ok) {
                    console.error(response)
                    // TODO: better error handling for Catalog I/O
                    throw new Error('Failed to fetch catalog')
                }

                const result = await response.json()

                this.facets = result.facets
                this.variables = result.variables

                return result
            },
            args: (): any => [],
        })
    }

    render(renderFunctions: StatusRenderer<any>) {
        return this.#task.render(renderFunctions)
    }
}
