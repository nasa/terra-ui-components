import { Task } from '@lit/task'
import giovanniApi from '../apis/giovanni.api.js'
import type { HostWithMaybeProperties } from './variable.js'
import { getVariableEntryIds } from './variable.js'
import type { Variable } from '../components/browse-variables/browse-variables.types.js'
import { getUTCDate } from './date.js'

// Global cache for variable data to prevent duplicate requests
const variableCache = new Map<string, Variable>()
const pendingRequests = new Map<string, Promise<Variable | null>>()

function adaptVariable(
    variable: Awaited<
        ReturnType<typeof giovanniApi.searchVariables>
    >['variables'][number],
): Variable {
    let exampleInitialStartDate: Date | undefined
    let exampleInitialEndDate: Date | undefined

    if (variable.dataProductBeginDateTime && variable.dataProductEndDateTime) {
        const diff = Math.abs(
            new Date(variable.dataProductEndDateTime).getTime() -
                new Date(variable.dataProductBeginDateTime).getTime(),
        )
        const threeQuarterRange = Math.floor(diff * 0.75)
        const startMs = Math.abs(
            new Date(variable.dataProductBeginDateTime).getTime() +
                threeQuarterRange,
        )
        exampleInitialStartDate = getUTCDate(startMs)
        exampleInitialEndDate = getUTCDate(variable.dataProductEndDateTime)
    }

    return {
        ...variable,
        exampleInitialStartDate,
        exampleInitialEndDate,
        dataFieldShortName:
            !variable.dataFieldShortName || variable.dataFieldShortName === ''
                ? variable.dataFieldAccessName
                : variable.dataFieldShortName,
    }
}

function sameVariableIds(a: Variable[] | undefined, b: Variable[]): boolean {
    if (!a || a.length !== b.length) {
        return false
    }

    return a.every(
        (variable, index) => variable.dataFieldId === b[index].dataFieldId,
    )
}

function setHostPropertiesFromVariable(
    host: HostWithMaybeProperties,
    variables: Variable[],
) {
    const primaryVariable = variables[0]

    if (!primaryVariable) {
        return
    }

    host.startDate =
        host.startDate ?? primaryVariable.exampleInitialStartDate?.toISOString()
    host.endDate =
        host.endDate ?? primaryVariable.exampleInitialEndDate?.toISOString()
    host.catalogVariable = primaryVariable
    if (!sameVariableIds(host.catalogVariables, variables)) {
        host.catalogVariables = [...variables]
    }
    host.variableEntryId = primaryVariable.dataFieldId
}

export function getFetchVariableTask(
    host: HostWithMaybeProperties,
    autoRun: boolean = true,
) {
    return new Task(host, {
        task: async (_args) => {
            const variableEntryIds = getVariableEntryIds(host)

            console.debug('Fetch variables ', variableEntryIds)

            if (!variableEntryIds.length) {
                return
            }

            const variables = (
                await Promise.all(
                    variableEntryIds.map(async (variableEntryId) => {
                        // Check if we already have this variable cached
                        if (variableCache.has(variableEntryId)) {
                            console.debug(
                                'Using cached variable ',
                                variableEntryId,
                            )
                            return variableCache.get(variableEntryId)!
                        }

                        // Check if there's already a pending request for this variable
                        if (pendingRequests.has(variableEntryId)) {
                            console.debug(
                                'Waiting for pending request for variable ',
                                variableEntryId,
                            )
                            const pendingVariable =
                                await pendingRequests.get(variableEntryId)!
                            return pendingVariable
                        }

                        // Create a new request and cache the promise
                        const requestPromise = giovanniApi
                            .getVariable(variableEntryId)
                            .then((variable) => {
                                if (!variable) return null
                                return adaptVariable(variable)
                            })
                            .catch((error) => {
                                console.warn(
                                    'Failed to fetch variable',
                                    variableEntryId,
                                    error,
                                )
                                return null
                            })
                        pendingRequests.set(variableEntryId, requestPromise)

                        try {
                            const variable = await requestPromise

                            console.debug('Found variable ', variable)

                            if (!variable) {
                                return null
                            }

                            // Cache the variable for future use
                            variableCache.set(variableEntryId, variable)

                            return variable
                        } finally {
                            // Clean up the pending request
                            pendingRequests.delete(variableEntryId)
                        }
                    }),
                )
            ).filter(Boolean) as Variable[]

            if (!variables.length) {
                return
            }

            setHostPropertiesFromVariable(host, variables)
        },
        args: () => [
            host.variableEntryId,
            host.variableEntryIds?.join('|'),
            host.collection,
            host.variable,
        ],
        autoRun,
    })
}
