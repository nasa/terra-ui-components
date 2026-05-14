import type { QueryObserverOptions } from '@tanstack/query-core'
import giovanniApi from '../apis/giovanni.api.js'

export function queryGiovanniConfiguredVariables(): QueryObserverOptions<Awaited<
    ReturnType<typeof giovanniApi.getConfiguredVariables>
> | null> {
    return {
        queryKey: ['giovanni', 'configuredVariables'],
        queryFn: async ({ signal }) => {
            return giovanniApi.getConfiguredVariables({
                signal,
            })
        },
    }
}

export function queryGiovanniShapeFiles(): QueryObserverOptions<Awaited<
    ReturnType<typeof giovanniApi.getShapeFiles>
> | null> {
    return {
        queryKey: ['giovanni', 'shapeFiles'],
        queryFn: async ({ signal }) => {
            return giovanniApi.getShapeFiles({
                signal,
            })
        },
    }
}

export function queryGiovanniGeoJsonShape(
    shapeFileId: string,
): QueryObserverOptions<Awaited<
    ReturnType<typeof giovanniApi.getGeoJson>
> | null> {
    return {
        queryKey: ['giovanni', 'geoJsonShape', shapeFileId],
        queryFn: async ({ signal }) => {
            return giovanniApi.getGeoJson(shapeFileId, {
                signal,
            })
        },
    }
}

export function queryGiovanniVariables(
    params?: Parameters<typeof giovanniApi.searchVariables>[0],
): QueryObserverOptions<Awaited<
    ReturnType<typeof giovanniApi.searchVariables>
> | null> {
    return {
        queryKey: ['giovanni', 'variables', params],
        queryFn: async ({ signal }) => {
            return giovanniApi.searchVariables(params, { signal })
        },
        placeholderData: (previousData) => previousData,
    }
}

export function queryGiovanniVariable(
    variableEntryId: string,
): QueryObserverOptions<Awaited<
    ReturnType<typeof giovanniApi.getVariable>
> | null> {
    return {
        queryKey: ['giovanni', 'variable', variableEntryId],
        queryFn: async ({ signal }) => {
            return giovanniApi.getVariable(variableEntryId, { signal })
        },
    }
}

export function queryGiovanniSearchKeywords(): QueryObserverOptions<Awaited<
    ReturnType<typeof giovanniApi.getSearchKeywords>
> | null> {
    return {
        queryKey: ['giovanni', 'searchKeywords'],
        queryFn: async ({ signal }) => {
            return giovanniApi.getSearchKeywords({ signal })
        },
    }
}
