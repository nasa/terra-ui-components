import { HARMONY_URLS, Environments } from '../../apis/harmony.api.js'
import { LatLng } from '../../components/map/models/LatLng.js'
import { LatLngBounds } from '../../components/map/models/LatLngBounds.js'
import { BadRequestException } from '../../exceptions/http.exception.js'

export type HarmonyRequestOptions = {
    environment?: Environments
    collectionConceptId?: string
    variableConceptIds?: Array<string>
    /* supplying variables is optional, will append &variable=VARIABLE to the URL */
    variables?: Array<string>
    location: LatLng | LatLngBounds
    startDate?: string
    endDate?: string
    format?: string
    average?: string
    labels?: Array<string>
    skipPreview?: boolean
    anonymous?: boolean
    dimensions?: Array<RangeDimension>
}

export type RangeDimension = {
    name: string
    min: number
    max: number
}

/**
 * Builds a Harmony OGC request URL
 *
 * usage: new HarmonyRequest({ options here }).requestUrl
 * usage: new HarmonyRequest().location(location).format(format).requestUrl
 */
export class HarmonyRequest {
    private options: Partial<HarmonyRequestOptions>

    constructor(options?: Partial<HarmonyRequestOptions>) {
        this.options = {
            ...options,
        }

        // variables might have been passed in as concept ids, use the helper method to ensure we add them in the right spot
        this.options.variables = undefined // clear out variables first
        options?.variables?.forEach((v) => {
            this.variable(v)
        })
    }

    get requestUrl() {
        return `${this.baseUrl}?${this.params}`
    }

    get baseUrl() {
        const {
            environment,
            collectionConceptId,
            variableConceptIds,
            variables,
        } = this.options

        if (!collectionConceptId) {
            throw new BadRequestException({
                message: 'Collection concept id is required',
            })
        }

        const harmonyUrl = HARMONY_URLS[environment ?? Environments.PROD] // default to PROD if not provided

        const joinedVariables = variables?.length
            ? // If variables are present, use parameter_vars in the URL
              // and the variables will be added as ?variable= params instead
              'parameter_vars'
            : // otherwise we'll include the variable concept ids in the OGC API url
              Array.isArray(variableConceptIds)
              ? variableConceptIds.join(',')
              : variableConceptIds

        return `${harmonyUrl}/${collectionConceptId}/ogc-api-coverages/1.0.0/collections/${joinedVariables || 'all'}/coverage/rangeset`
    }

    get params() {
        const params = new URLSearchParams()
        const {
            location,
            startDate,
            endDate,
            format,
            labels,
            variables,
            average,
            anonymous,
            dimensions,
        } = this.options

        if (location instanceof LatLng) {
            params.append('point', `${location.lat},${location.lng}`)
        } else if (location instanceof LatLngBounds) {
            params.append(
                'subset',
                `lat(${location.getSouth()}:${location.getNorth()})`,
            )
            params.append(
                'subset',
                `lon(${location.getWest()}:${location.getEast()})`,
            )
        }

        // TODO: implement polygon
        // TODO: implement circle

        if (startDate) {
            // at least start date is required
            params.append(
                'subset',
                `time("${startDate}":"${endDate ?? startDate}")`,
            )
        }

        if (dimensions && dimensions.length > 0) {
            dimensions.forEach((dim) => {
                params.append('subset', `${dim.name}(${dim.min}:${dim.max})`)
            })
        }

        if (format) {
            params.append('format', format)
        }

        if (labels) {
            params.append('label', labels.join(','))
        }

        variables?.forEach((v) => {
            params.append('variable', v)
        })

        if (average) {
            params.append('average', average)
        }

        if (anonymous) {
            params.append('maxResults', '10')
        }

        return params.toString()
    }

    private set(patch: Partial<HarmonyRequestOptions>) {
        this.options = { ...this.options, ...patch }
        return this
    }

    environment(environment: HarmonyRequestOptions['environment']) {
        return this.set({ environment })
    }

    collection(collectionConceptId: string) {
        return this.set({ collectionConceptId })
    }

    variable(variable: string) {
        if (this.isVariableConceptId(variable)) {
            return this.set({
                variableConceptIds: [
                    ...(this.options.variableConceptIds ?? []),
                    variable,
                ],
            })
        }

        return this.set({
            variables: [...(this.options.variables ?? []), variable],
        })
    }

    location(location: HarmonyRequestOptions['location']) {
        return this.set({ location })
    }

    dateRange(startDate: string, endDate: string) {
        return this.set({
            startDate,
            endDate,
        })
    }

    startDate(startDate: string) {
        return this.set({ startDate })
    }

    endDate(endDate: string) {
        return this.set({ endDate })
    }

    format(format: string) {
        return this.set({ format })
    }

    label(label: string) {
        return this.set({
            labels: [...(this.options.labels ?? []), label],
        })
    }

    average(average: string) {
        return this.set({ average })
    }

    dimension(dimension: RangeDimension) {
        return this.set({
            dimensions: [...(this.options.dimensions ?? []), dimension],
        })
    }

    skipPreview(skipPreview: boolean) {
        return this.set({ skipPreview })
    }

    isVariableConceptId(value: string) {
        return /^V\d+-.+$/.test(value)
    }
}
