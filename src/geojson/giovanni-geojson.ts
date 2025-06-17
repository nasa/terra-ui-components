import type {
    ShapeFilesResponse,
    GeoJsonShapeResponse,
    GeoJsonShapesInterface,
} from './types.js'
import { GET_SHAPE_FILES, GET_GEOJSON_SHAPE } from './queries.js'
import { getGraphQLClient } from '../lib/graphql-client.js'

export class GiovanniGeoJsonShapes implements GeoJsonShapesInterface {
    async getShapeFiles(): Promise<ShapeFilesResponse> {
        const client = await getGraphQLClient()

        const response = await client.query<{
            shapeFiles: ShapeFilesResponse
        }>({
            query: GET_SHAPE_FILES,
            fetchPolicy: 'cache-first',
        })

        if (response.errors) {
            throw new Error(
                `Failed to fetch shape files: ${response.errors[0].message}`
            )
        }

        return response.data!.shapeFiles
    }

    async getGeoJson(query: string): Promise<GeoJsonShapeResponse> {
        const client = await getGraphQLClient()

        const shapeId = query.replace('shape=', '')

        const response = await client.query<{
            getGeoJsonShape: GeoJsonShapeResponse
        }>({
            query: GET_GEOJSON_SHAPE,
            variables: {
                shape: shapeId,
            },
            fetchPolicy: 'cache-first',
        })

        if (response.errors) {
            throw new Error(`Failed to fetch GeoJSON: ${response.errors[0].message}`)
        }

        return response.data!.getGeoJsonShape
    }
}
