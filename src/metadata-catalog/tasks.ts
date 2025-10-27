import { Task } from '@lit/task'
import { GiovanniVariableCatalog } from './giovanni-variable-catalog.js'
import type { HostWithMaybeProperties } from './types.js'
import { getVariableEntryId } from './utilities.js'
import type { Variable } from '../components/browse-variables/browse-variables.types.js'

// Global cache for variable data to prevent duplicate requests
const variableCache = new Map<string, Variable>()
const pendingRequests = new Map<string, Promise<Variable | null>>()

function setHostPropertiesFromVariable(
    host: HostWithMaybeProperties,
    variable: Variable,
    variableEntryId: string
) {
    host.startDate = host.startDate ?? variable.exampleInitialStartDate?.toISOString()
    host.endDate = host.endDate ?? variable.exampleInitialEndDate?.toISOString()
    host.catalogVariable = variable
    host.variableEntryId = variableEntryId
}

export function getFetchVariableTask(
    host: HostWithMaybeProperties,
    autoRun: boolean = true
) {
    const catalog = new GiovanniVariableCatalog() // TODO: replace this with a factory call when we switch to CMR

    return new Task(host, {
        task: async _args => {
            const variableEntryId = getVariableEntryId(host)

            console.debug('Fetch variable ', variableEntryId)

            if (!variableEntryId) {
                return
            }

            // Check if we already have this variable cached
            if (variableCache.has(variableEntryId)) {
                console.debug('Using cached variable ', variableEntryId)
                const cachedVariable = variableCache.get(variableEntryId)!
                setHostPropertiesFromVariable(host, cachedVariable, variableEntryId)
                return
            }

            // Check if there's already a pending request for this variable
            if (pendingRequests.has(variableEntryId)) {
                console.debug(
                    'Waiting for pending request for variable ',
                    variableEntryId
                )
                const variable = await pendingRequests.get(variableEntryId)!

                if (variable) {
                    console.debug('Using cached variable ', variableEntryId)
                    setHostPropertiesFromVariable(host, variable, variableEntryId)
                }
                return
            }

            // Create a new request and cache the promise
            const requestPromise = catalog.getVariable(variableEntryId)
            pendingRequests.set(variableEntryId, requestPromise)

            try {
                const variable = await requestPromise

                console.debug('Found variable ', variable)

                if (!variable) {
                    return
                }

                // Cache the variable for future use
                variableCache.set(variableEntryId, variable)

                setHostPropertiesFromVariable(host, variable, variableEntryId)
            } finally {
                // Clean up the pending request
                pendingRequests.delete(variableEntryId)
            }
        },
        args: () => [host.variableEntryId, host.collection, host.variable],
        autoRun,
    })
}
