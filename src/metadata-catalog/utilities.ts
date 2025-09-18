import type { HostWithMaybeProperties } from './types.js'

export function getVariableEntryId(host: HostWithMaybeProperties) {
    if (!host.variableEntryId && !(host.collection && host.variable)) {
        return
    }

    return host.variableEntryId ?? `${host.collection}_${host.variable}`
}
