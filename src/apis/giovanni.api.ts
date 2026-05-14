import { apiClient, type RequestOptions } from '../lib/api.client.js'

const baseUrl = 'https://api.giovanni.earthdata.nasa.gov/'

// we are temporarily using on-prem Giovanni for GeoJSON and catalog results
// however it does not support CORS, so we are proxying requests through an AWS Lambda function until CORS is supported in the on-prem deployment
const onPremProxy =
    'https://sjldutoe6c.execute-api.us-east-1.amazonaws.com/default/harmony-proxy'

type ShapeFilesResponse = {
    available: string[]
    info: Record<string, ShapeFileInfo>
}

type ShapeFileInfo = {
    sourceURL: string
    title: string
    sourceName: string
    fields: Array<[name: string, type: string, length: number]>
    shapes: Record<string, ShapeFileShape>
    shapefileID: string
    parentDir: string
    uniqueShapeIDField: string
}

type ShapeFileShape = {
    values: Array<string | number | null | undefined>
    bbox: number[]
}

const SOLR_CATALOG_PATH = 'daac-bin/catalogServices.pl'

const solrFieldMap: Record<string, string> = {
    observations: 'dataProductObservation',
    disciplines: 'dataFieldDiscipline',
    measurements: 'dataFieldMeasurement',
    platformInstruments: 'dataProductPlatformInstrument',
    spatialResolutions: 'dataProductSpatialResolution',
    temporalResolutions: 'dataProductTimeInterval',
    wavelengths: 'dataFieldWavelength',
    depths: 'dataFieldDepth',
    specialFeatures: 'specialFeatures',
    portals: 'dataFieldTags',
}

export type GiovanniVariable = {
    dataFieldId: string
    dataProductShortName: string
    dataProductVersion: string
    dataFieldShortName: string
    dataFieldAccessName: string
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
    dataFieldKeywords: string[]
    dataFieldUnits: string
    dataProductDescriptionUrl: string
    dataFieldDescriptionUrl: string
    dataProductInstrumentShortName: string
}

export type GiovanniFacetValue = {
    name: string
    count: number
}

export type GiovanniFacet = {
    category: string
    values: GiovanniFacetValue[]
}

class GiovanniApi {
    /**
     * Fetches the list of configured variables from the Giovanni API.
     * Giovanni does not support all variables, so this endpoint provides a list of variables that are supported for subsetting.
     */
    async getConfiguredVariables(options?: RequestOptions) {
        const response = await this.#request<{
            configured_variables: string[]
        }>('configured-variables', options)

        return response.configured_variables
    }

    async getShapeFiles(options?: RequestOptions) {
        const shapeFiles = await this.#onPremRequest<ShapeFilesResponse>(
            'daac-bin/getProvisionedShapefiles.py',
            options,
        )

        // the giovanni response is very suited to on-prem Giovanni, but not for our usage
        // so we need to map it to a more friendly format
        return Object.keys(shapeFiles.info).map((shapefileID) => ({
            shapefileID,
            title: shapeFiles.info[shapefileID].title,
            sourceName: shapeFiles.info[shapefileID].sourceName,
            sourceURL: shapeFiles.info[shapefileID].sourceURL,
            shapes: this.#transformShapeData(
                shapeFiles.info[shapefileID].shapes,
                shapefileID,
            ),
        }))
    }

    async getGeoJson(shapeFileId: string, options?: RequestOptions) {
        return this.#onPremRequest(
            `daac-bin/getGeoJSON.py?shape=${shapeFileId}`,
            options,
        )
    }

    /**
     * Searches the Giovanni variable catalog via the on-prem Solr endpoint.
     */
    async searchVariables(
        params?: {
            q?: string
            filter?: Record<string, string[]>
            variableEntryIds?: string[]
            rows?: string
        },
        options?: RequestOptions,
    ): Promise<{
        count: number
        total: number
        variables: GiovanniVariable[]
        facets: GiovanniFacet[]
    }> {
        const queryParams = new URLSearchParams({
            version: '2.2',
            facet: 'true',
            'facet.sort': 'index',
            wt: 'json',
            rows: params?.rows ?? '200',
            start: '0',
        })

        if (params?.variableEntryIds?.length) {
            const orQuery = params.variableEntryIds
                .map((id) => `dataFieldId:"${id.replace(/\./g, '_')}"`)
                .join(' OR ')
            queryParams.append('q', `(${orQuery}) AND dataFieldActive:true`)
            queryParams.append('q.op', 'AND')
            queryParams.set('rows', params.variableEntryIds.length.toString())
        } else if (params?.q) {
            queryParams.append(
                'q',
                `dataFieldActive:true AND dataFieldKeywordsText:(${params.q})`,
            )
            queryParams.append('q.op', 'AND')
        } else {
            queryParams.append('q', 'dataFieldActive:true')
        }

        if (params?.filter) {
            for (const [key, values] of Object.entries(params.filter)) {
                const solrField = solrFieldMap[key]
                if (solrField) {
                    queryParams.append(
                        'fq',
                        `${solrField}:(${values.map((v) => `"${v}"`).join(' OR ')})`,
                    )
                }
            }
        }

        for (const field of Object.values(solrFieldMap)) {
            queryParams.append('facet.field', field)
        }

        type SolrCatalogResponse = {
            response: { numFound: number; docs: GiovanniVariable[] }
            facet_counts: {
                facet_fields: Record<string, Array<string | number>>
            }
        }

        const result = await this.#onPremRequest<SolrCatalogResponse>(
            `${SOLR_CATALOG_PATH}?${queryParams.toString()}`,
            options,
        )

        let variables = result.response.docs

        if (!params?.variableEntryIds?.length) {
            const configuredVariables =
                await this.getConfiguredVariables(options)
            if (configuredVariables.length > 0) {
                const configuredVarsSet = new Set(configuredVariables)
                variables = variables.filter(
                    (v) =>
                        v.dataFieldId && configuredVarsSet.has(v.dataFieldId),
                )
            }
        }

        const facets: GiovanniFacet[] = Object.entries(
            result.facet_counts.facet_fields,
        ).map(([solrName, rawValues]) => {
            const category =
                Object.entries(solrFieldMap).find(
                    ([, v]) => v === solrName,
                )?.[0] ?? solrName
            const values: GiovanniFacetValue[] = []
            for (let i = 0; i < rawValues.length; i += 2) {
                values.push({
                    name: rawValues[i] as string,
                    count: rawValues[i + 1] as number,
                })
            }
            return { category, values }
        })

        return {
            count: variables.length,
            total: result.response.numFound,
            variables,
            facets,
        }
    }

    /**
     * Fetches a single variable by its entry ID from the Giovanni Solr catalog.
     * Returns null if not found.
     */
    async getVariable(
        variableEntryId: string,
        options?: RequestOptions,
    ): Promise<GiovanniVariable | null> {
        const result = await this.searchVariables(
            { variableEntryIds: [variableEntryId] },
            options,
        )
        return result.variables[0] ?? null
    }

    /**
     * Fetches all active keyword terms from the Giovanni Solr catalog.
     * Returns each keyword as { id: string }, matching the SearchKeywordsResponse
     * shape expected by the variable-keyword-search component.
     */
    async getSearchKeywords(
        options?: RequestOptions,
    ): Promise<Array<{ id: string }>> {
        const result = await this.#onPremRequest<{
            terms: Record<string, Array<any>>
        }>(
            'daac-bin/aesir_proxy.pl/terms?terms.fl=dataFieldKeywords&terms.limit=-1&wt=json&terms.sort=count',
            options,
        )

        return result.terms?.dataFieldKeywords.flatMap((doc, index) => {
            return index % 2 === 0 ? [{ id: doc }] : []
        })
    }

    #request<T>(path: string, requestOptions?: RequestOptions) {
        return apiClient.get<T>(`${baseUrl}${path}`, requestOptions)
    }

    #onPremRequest<T>(path: string, requestOptions?: RequestOptions) {
        return apiClient.get<T>(
            `${onPremProxy}/giovanni.gsfc.nasa.gov/giovanni/${path}`,
            requestOptions,
        )
    }

    #transformShapeData(
        shapes: Record<string, ShapeFileShape>,
        shapefileID: string,
    ) {
        return Object.keys(shapes).map((key) => {
            const shape = shapes[key]
            let name: string | number | null | undefined = null

            if (shapefileID === 'lakes') {
                name = shape.values[2]
            } else if (
                shapefileID === 'gpmLandMask' ||
                shapefileID === 'gpmSeaMask'
            ) {
                name = shape.values.find(
                    (value) =>
                        typeof value === 'string' && value.includes('deg'),
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
                shapeID: key,
                shapefileID: shapefileID,
            }
        })
    }
}

const giovanniApi = new GiovanniApi()

export default giovanniApi
