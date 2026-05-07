import { HARMONY_URLS, Environments } from '../../apis/harmony.api.js'
export { Environments } from '../../apis/harmony.api.js'
import { LatLng } from '../../components/map/models/LatLng.js'
import { LatLngBounds } from '../../components/map/models/LatLngBounds.js'
import { BadRequestException } from '../../exceptions/http.exception.js'
import type { Variable } from '../../components/browse-variables/browse-variables.types.js'

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
    #options: Partial<HarmonyRequestOptions>

    constructor(options?: Partial<HarmonyRequestOptions>) {
        this.#options = {
            ...options,
        }

        // variables might have been passed in as concept ids, use the helper method to ensure we add them in the right spot
        this.#options.variables = undefined // clear out variables first
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
        } = this.#options

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
        } = this.#options

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

        labels?.forEach((label) => {
            params.append('label', label)
        })

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

    get options() {
        return this.#options
    }

    private set(patch: Partial<HarmonyRequestOptions>) {
        this.#options = { ...this.#options, ...patch }
        return this
    }

    /**
     * Helper method to get a label value by prefix, e.g. getLabelByPrefix('instrument-short-name') will return the value of the label that starts with 'instrument-short-name:'
     */
    getLabelByPrefix(prefix: string) {
        const label = this.#options.labels?.find((l) =>
            l.startsWith(`${prefix}:`),
        )

        const value = label ? label.split(':')[1].trim() : undefined

        return value !== 'NOT APPLICABLE' ? value : undefined
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
                    ...(this.#options.variableConceptIds ?? []),
                    variable,
                ],
            })
        }

        return this.set({
            variables: [...(this.#options.variables ?? []), variable],
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
            labels: [...(this.#options.labels ?? []), label],
        })
    }

    addLabelsFromVariable(variable: Variable) {
        this.label(
            `collection: ${variable.dataProductShortName}_${variable.dataProductVersion}`,
        )
        this.label(
            `variable-display-name: ${variable.dataFieldLongName || variable.dataFieldId}`,
        )
        this.label(
            `instrument-short-name: ${variable.dataProductInstrumentShortName}`,
        )
        this.label(`time-interval: ${variable.dataProductTimeInterval}`)
        this.label(`units: ${variable.dataFieldUnits}`)

        return this
    }

    average(average: string) {
        return this.set({ average })
    }

    dimension(dimension: RangeDimension) {
        return this.set({
            dimensions: [...(this.#options.dimensions ?? []), dimension],
        })
    }

    skipPreview(skipPreview: boolean) {
        return this.set({ skipPreview })
    }

    isVariableConceptId(value: string) {
        return /^V\d+-.+$/.test(value)
    }

    /**
     * Parses a Harmony OGC request URL and returns a HarmonyRequest instance
     * with the corresponding options populated.
     *
     * @example
     * const request = HarmonyRequest.fromUrl(
     *   'https://harmony.earthdata.nasa.gov/C2723754847-GES_DISC/ogc-api-coverages/1.0.0/collections/parameter_vars/coverage/rangeset?subset=lat(5:40)&subset=lon(62:95)&format=text%2Fcsv'
     * )
     */
    static fromUrl(url: string): HarmonyRequest {
        const parsed = new URL(url)

        // Determine environment from origin
        let environment: Environments | undefined
        if (parsed.origin === HARMONY_URLS[Environments.PROD]) {
            environment = Environments.PROD
        } else if (parsed.origin === HARMONY_URLS[Environments.UAT]) {
            environment = Environments.UAT
        }

        // Parse path: /{collectionConceptId}/ogc-api-coverages/1.0.0/collections/{collectionsValue}/coverage/rangeset
        // e.g. ['', 'C2723754847-GES_DISC', 'ogc-api-coverages', '1.0.0', 'collections', 'parameter_vars', 'coverage', 'rangeset']
        const pathParts = parsed.pathname.split('/')
        const collectionConceptId = pathParts[1] || undefined
        const collectionsValue = pathParts[5]

        // Variable concept IDs are encoded in the path when not using 'parameter_vars' or 'all'
        let variableConceptIds: string[] | undefined
        if (
            collectionsValue &&
            collectionsValue !== 'parameter_vars' &&
            collectionsValue !== 'all'
        ) {
            variableConceptIds = collectionsValue.split(',')
        }

        // Parse subset params for location, time, and named dimensions
        const subsets = parsed.searchParams.getAll('subset')
        let south: number | undefined
        let north: number | undefined
        let west: number | undefined
        let east: number | undefined
        let startDate: string | undefined
        let endDate: string | undefined
        const dimensions: RangeDimension[] = []

        for (const subset of subsets) {
            const latMatch = subset.match(/^lat\((.+):(.+)\)$/)
            const lonMatch = subset.match(/^lon\((.+):(.+)\)$/)
            const timeMatch = subset.match(/^time\("(.+)":"(.+)"\)$/)
            const dimMatch = subset.match(/^(\w+)\((.+):(.+)\)$/)

            if (latMatch) {
                south = parseFloat(latMatch[1])
                north = parseFloat(latMatch[2])
            } else if (lonMatch) {
                west = parseFloat(lonMatch[1])
                east = parseFloat(lonMatch[2])
            } else if (timeMatch) {
                startDate = timeMatch[1]
                endDate = timeMatch[2]
            } else if (dimMatch) {
                dimensions.push({
                    name: dimMatch[1],
                    min: parseFloat(dimMatch[2]),
                    max: parseFloat(dimMatch[3]),
                })
            }
        }

        // Build location from parsed lat/lon bounds or point
        let location: LatLng | LatLngBounds | undefined
        if (
            south !== undefined &&
            north !== undefined &&
            west !== undefined &&
            east !== undefined
        ) {
            // LatLngBounds expects [west, south, east, north]
            location = new LatLngBounds([west, south, east, north])
        }

        const point = parsed.searchParams.get('point')
        if (point) {
            const [lat, lng] = point.split(',').map(Number)
            location = new LatLng(lat, lng)
        }

        const format = parsed.searchParams.get('format') ?? undefined
        const label = parsed.searchParams.getAll('label') ?? undefined
        const labels = label && label.length > 0 ? label : undefined
        const variables = parsed.searchParams.getAll('variable')
        const average = parsed.searchParams.get('average') ?? undefined
        const anonymous =
            parsed.searchParams.get('maxResults') === '10' ? true : undefined

        return new HarmonyRequest({
            environment,
            collectionConceptId,
            variableConceptIds,
            variables: variables.length > 0 ? variables : undefined,
            location,
            startDate,
            endDate,
            format,
            labels,
            average,
            anonymous,
            dimensions: dimensions.length > 0 ? dimensions : undefined,
        })
    }
}
