import cmrApi from '../apis/cmr.api.js'
import giovanniApi from '../apis/giovanni.api.js'
import { harmonyApi } from '../apis/harmony.api.js'

export function mockGiovanniQueries() {
    let originalGetConfiguredVariables: typeof giovanniApi.getConfiguredVariables
    let originalGetShapeFiles: typeof giovanniApi.getShapeFiles

    beforeEach(() => {
        originalGetConfiguredVariables = giovanniApi.getConfiguredVariables
        originalGetShapeFiles = giovanniApi.getShapeFiles

        giovanniApi.getConfiguredVariables =
            (async () => []) as typeof giovanniApi.getConfiguredVariables
        giovanniApi.getShapeFiles =
            (async () => []) as typeof giovanniApi.getShapeFiles
    })

    afterEach(() => {
        giovanniApi.getConfiguredVariables = originalGetConfiguredVariables
        giovanniApi.getShapeFiles = originalGetShapeFiles
    })
}

export function mockCollectionQueries(options: {
    collection: Record<string, any>
    capabilities: Record<string, any>
    ummVariables?: Array<{ umm: Record<string, any> }>
}) {
    const originals = {
        getCollectionByEntryId: cmrApi.getCollectionByEntryId,
        getCollectionCapabilities: harmonyApi.getCollectionCapabilities,
        searchVariables: cmrApi.searchVariables,
        getSamplingOfGranules: cmrApi.getSamplingOfGranules,
        getConfiguredVariables: giovanniApi.getConfiguredVariables,
        getShapeFiles: giovanniApi.getShapeFiles,
    }

    cmrApi.getCollectionByEntryId = (async () =>
        options.collection) as typeof cmrApi.getCollectionByEntryId

    harmonyApi.getCollectionCapabilities = (async () =>
        options.capabilities) as typeof harmonyApi.getCollectionCapabilities

    const ummVariables = options.ummVariables ?? []
    cmrApi.searchVariables = (async () => ({
        hits: ummVariables.length,
        items: ummVariables,
    })) as typeof cmrApi.searchVariables

    cmrApi.getSamplingOfGranules = (async () =>
        null) as typeof cmrApi.getSamplingOfGranules

    giovanniApi.getConfiguredVariables =
        (async () => []) as typeof giovanniApi.getConfiguredVariables

    giovanniApi.getShapeFiles =
        (async () => []) as typeof giovanniApi.getShapeFiles

    return () => {
        cmrApi.getCollectionByEntryId = originals.getCollectionByEntryId
        harmonyApi.getCollectionCapabilities =
            originals.getCollectionCapabilities
        cmrApi.searchVariables = originals.searchVariables
        cmrApi.getSamplingOfGranules = originals.getSamplingOfGranules
        giovanniApi.getConfiguredVariables = originals.getConfiguredVariables
        giovanniApi.getShapeFiles = originals.getShapeFiles
    }
}
