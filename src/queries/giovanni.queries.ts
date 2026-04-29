import type { QueryObserverOptions } from '@tanstack/query-core'

const GIOVANNI_API_BASE = 'https://api.giovanni.earthdata.nasa.gov'

export function queryGiovanniConfiguredVariables(): QueryObserverOptions<
    string[] | null
> {
    return {
        queryKey: ['giovanni', 'configured-variables'],
        queryFn: async ({ signal }) => {
            const response = await fetch(
                `${GIOVANNI_API_BASE}/configured-variables/`,
                { signal },
            )

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch Giovanni configured variables: ${response.status}`,
                )
            }

            const data = await response.json()
            return data.configured_variables as string[]
        },
    }
}
