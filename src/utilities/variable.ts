import type { ReactiveControllerHost } from 'lit'
import type { Variable } from '../components/browse-variables/browse-variables.types.js'

export type HostWithMaybeProperties = ReactiveControllerHost & {
    variableEntryId?: string
    variableEntryIds?: string[]
    collection?: string
    variable?: string
    startDate?: string
    endDate?: string
    catalogVariable?: Variable
    catalogVariables?: Variable[]
}

export function getVariableEntryId(host: HostWithMaybeProperties) {
    if (host.variableEntryIds?.length) {
        return host.variableEntryIds[0]
    }

    if (!host.variableEntryId && !(host.collection && host.variable)) {
        return
    }

    return host.variableEntryId ?? `${host.collection}_${host.variable}`
}

export function getVariableEntryIds(host: HostWithMaybeProperties): string[] {
    if (host.variableEntryIds?.length) {
        return [
            ...new Set(
                host.variableEntryIds.map((id) => id.trim()).filter(Boolean),
            ),
        ]
    }

    const variableEntryId = getVariableEntryId(host)
    return variableEntryId ? [variableEntryId] : []
}
