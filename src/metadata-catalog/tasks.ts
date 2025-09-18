import { Task } from '@lit/task'
import { GiovanniVariableCatalog } from './giovanni-variable-catalog.js'
import type { HostWithMaybeProperties } from './types.js'
import { getVariableEntryId } from './utilities.js'

export function getFetchVariableTask(
    host: HostWithMaybeProperties,
    autoRun: boolean = true
) {
    const catalog = new GiovanniVariableCatalog() // TODO: replace this with a factory call when we switch to CMR

    return new Task(host, {
        task: async (_args, { signal }) => {
            const variableEntryId = getVariableEntryId(host)

            console.debug('fetch variable ', variableEntryId)

            if (!variableEntryId) {
                return
            }

            const variable = await catalog.getVariable(variableEntryId, {
                signal,
            })

            console.debug('found variable ', variable)

            if (!variable) {
                return
            }

            host.startDate =
                host.startDate ?? variable.exampleInitialStartDate?.toISOString()
            host.endDate =
                host.endDate ?? variable.exampleInitialEndDate?.toISOString()
            host.catalogVariable = variable
            host.variableEntryId = variableEntryId
        },
        args: () => [host.variableEntryId, host.collection, host.variable],
        autoRun,
    })
}
