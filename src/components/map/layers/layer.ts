import type { QueryClient } from '@tanstack/query-core'
import type TileLayer from 'ol/layer/Tile.js'
import type VectorTileLayer from 'ol/layer/VectorTile.js'
import {
    buildGeoTiffLayer,
    type GeoTiffLayerConfig,
    type GeoTiffLayerInfo,
    layerRequiresAuthentication as geoTiffLayerRequiresAuthentication,
    updateGeoTiffStyle,
} from './geotiff.layer.js'
import {
    buildGibsLayer,
    type GibsLayerConfig,
    type GibsLayerInfo,
} from './gibs.layer.js'

type BaseLayerType = MapLayerResult['layer']
type CommonMutableKey = 'opacity' | 'visible' | 'title'
type LayerUpdateStrategy<T extends MapLayerConfig['type'] = MapLayerConfig['type']> =
    {
        /** Type-specific config keys that can be updated in place without rebuilding. */
        mutableKeys: readonly (keyof Extract<MapLayerConfig, { type: T }> & string)[]
        /** Checks whether the live layer has the state required to apply a style update in place. */
        canApplyStyle?: (layer: BaseLayerType) => boolean
        /** Applies type-specific style changes in place. */
        applyStyle?: (
            layer: BaseLayerType,
            previous: Extract<MapLayerConfig, { type: T }>,
            next: Extract<MapLayerConfig, { type: T }>
        ) => Promise<GeoTiffLayerInfo | undefined>
    }

const COMMON_MUTATORS: {
    [K in CommonMutableKey]: (layer: BaseLayerType, config: MapLayerConfig) => void
} = {
    opacity: (layer, config) => layer.setOpacity(config.opacity ?? 1),
    visible: (layer, config) => layer.setVisible(config.visible ?? true),
    title: (layer, config) => layer.set('title', config.title ?? config.name),
}

const COMMON_MUTABLE_KEYS = Object.keys(COMMON_MUTATORS) as CommonMutableKey[]

const IN_PLACE_UPDATES: {
    [T in MapLayerConfig['type']]: LayerUpdateStrategy<T>
} = {
    geotiff: {
        mutableKeys: ['colorMapName', 'colorSteps', 'reverseColors'],
        canApplyStyle: layer => Boolean(layer.get('info')),
        applyStyle: async (layer, _previous, next) => {
            const info = layer.get('info') as GeoTiffLayerInfo | undefined
            if (!info) {
                return undefined
            }
            return updateGeoTiffStyle(info, next)
        },
    },
    gibs: {
        mutableKeys: [],
    },
    'gibs-vector': {
        mutableKeys: [],
    },
}

function valuesEqual(a: unknown, b: unknown): boolean {
    return a === b || JSON.stringify(a) === JSON.stringify(b)
}

function hasOnlyMutableChanges(
    previous: MapLayerConfig,
    next: MapLayerConfig,
    mutableKeys: ReadonlySet<string>
): boolean {
    if (previous.type !== next.type) {
        return false
    }

    const allKeys = new Set([...Object.keys(previous), ...Object.keys(next)])
    for (const key of allKeys) {
        if (mutableKeys.has(key)) {
            continue
        }

        const prevVal = (previous as Record<string, unknown>)[key]
        const nextVal = (next as Record<string, unknown>)[key]

        if (!valuesEqual(prevVal, nextVal)) {
            return false
        }
    }

    return true
}

export async function tryUpdateMapLayerInPlace(
    layer: BaseLayerType,
    previous: MapLayerConfig,
    next: MapLayerConfig
): Promise<InPlaceUpdateResult> {
    if (previous.type !== next.type) {
        return { updated: false }
    }

    const strategy = IN_PLACE_UPDATES[next.type] as LayerUpdateStrategy<any>
    const allowedKeys = new Set<string>([
        ...COMMON_MUTABLE_KEYS,
        ...strategy.mutableKeys,
    ])

    if (!hasOnlyMutableChanges(previous, next, allowedKeys)) {
        return { updated: false }
    }

    const styleChanged = strategy.mutableKeys.some(
        (key: string) =>
            !valuesEqual(
                (previous as Record<string, unknown>)[key],
                (next as Record<string, unknown>)[key]
            )
    )

    if (styleChanged && strategy.canApplyStyle && !strategy.canApplyStyle(layer)) {
        return { updated: false }
    }

    for (const key of COMMON_MUTABLE_KEYS) {
        if (previous[key] !== next[key]) {
            COMMON_MUTATORS[key](layer, next)
        }
    }

    const info =
        styleChanged && strategy.applyStyle
            ? await strategy.applyStyle(layer, previous, next)
            : undefined

    return { updated: true, type: next.type, info }
}

export type InPlaceUpdateResult =
    | { updated: false }
    | {
          updated: true
          type: MapLayerConfig['type']
          info?: GeoTiffLayerInfo
      }

/**
 * Declarative config for any layer `<terra-map layers>` can build, discriminated
 * by `type`: `'gibs'` (raster) / `'gibs-vector'` from GIBS, or `'geotiff'` for a
 * standalone GeoTIFF/COG by URL.
 */
export type MapLayerConfig = GibsLayerConfig | GeoTiffLayerConfig

export type MapLayerResult =
    | {
          type: 'gibs' | 'gibs-vector'
          layer: TileLayer | VectorTileLayer
          legend: GibsLayerInfo['legend']
      }
    | { type: 'geotiff'; layer: GeoTiffLayerInfo['layer']; info: GeoTiffLayerInfo }

export type BuildMapLayerOptions = {
    bearerToken?: string
    queryClient?: QueryClient
}

/**
 * Builds a layer from a `MapLayerConfig`, dispatching to `buildGibsLayer()` or
 * `buildGeoTiffLayer()` based on `config.type`.
 */
export async function buildMapLayer(
    config: MapLayerConfig,
    options?: BuildMapLayerOptions
): Promise<MapLayerResult> {
    if (config.type === 'geotiff') {
        const info = await buildGeoTiffLayer(config, options)
        return { type: 'geotiff', layer: info.layer, info }
    }

    const { layer, legend } = await buildGibsLayer(config, options)
    return { type: config.type, layer, legend }
}

export function layerRequiresAuthentication(config: MapLayerConfig): boolean {
    if (config.type === 'geotiff') {
        return geoTiffLayerRequiresAuthentication(config)
    }

    return false
}
