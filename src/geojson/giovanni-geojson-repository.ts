import type {
    ShapeFilesResponse,
    GeoJsonShapeResponse,
    GeoJsonShapesInterface,
} from './types.js'
import { GET_SHAPE_FILES, GET_GEOJSON_SHAPE } from './queries.js'
import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    type NormalizedCacheObject,
} from '@apollo/client'

export class GiovanniGeoJsonShapesRepository implements GeoJsonShapesInterface {
    private readonly client: ApolloClient<NormalizedCacheObject>

    constructor() {
        this.client = new ApolloClient({
            link: new HttpLink({
                uri: 'https://u2u5qu332rhmxpiazjcqz6gkdm.appsync-api.us-east-1.amazonaws.com/graphql',
                headers: {
                    'x-api-key': 'da2-hg7462xbijdjvocfgx2xlxuytq',
                },
            }),
            cache: new InMemoryCache({
                addTypename: false,
            }),
        })
    }

    async getShapeFiles(): Promise<ShapeFilesResponse> {
        const response = await this.client.query<{ shapeFiles: ShapeFilesResponse }>({
            query: GET_SHAPE_FILES,
        })

        if (response.errors) {
            throw new Error(
                `Failed to fetch shape files: ${response.errors[0].message}`
            )
        }

        return response.data!.shapeFiles
    }

    async getGeoJson(query: string): Promise<GeoJsonShapeResponse> {
        const shapeId = query.replace('shape=', '')
        const response = await this.client.query<{
            getGeoJsonShape: GeoJsonShapeResponse
        }>({
            query: GET_GEOJSON_SHAPE,
            variables: {
                shape: shapeId,
            },
        })

        if (response.errors) {
            throw new Error(`Failed to fetch GeoJSON: ${response.errors[0].message}`)
        }

        return response.data!.getGeoJsonShape
    }
}
