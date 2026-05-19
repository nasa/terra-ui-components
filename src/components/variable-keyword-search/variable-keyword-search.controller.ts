import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import type { ReadableTaskStatus } from './variable-keyword-search.types.js'
import { QueryController } from '../../controllers/query.controller.js'
import type { QueryClientHost } from '../../mixins/query-client.mixin.js'
import { queryGiovanniSearchKeywords } from '../../queries/giovanni.queries.js'
import type giovanniApi from '../../apis/giovanni.api.js'

type SearchKeywords = Awaited<ReturnType<typeof giovanniApi.getSearchKeywords>>

export class FetchController {
    #query: QueryController<SearchKeywords | null>

    constructor(host: ReactiveControllerHost & QueryClientHost) {
        this.#query = new QueryController(host, () =>
            queryGiovanniSearchKeywords(),
        )
    }

    get taskComplete() {
        return this.#query.result?.isSuccess ?? false
    }

    get value() {
        return this.#query.result?.data
    }

    get taskStatus(): ReadableTaskStatus {
        if (this.#query.result?.isError) return 'ERROR'
        if (this.#query.result?.isSuccess) return 'COMPLETE'
        if (this.#query.result?.isPending) return 'PENDING'
        return 'INITIAL'
    }

    render<T>(renderFunctions: StatusRenderer<T>) {
        const result = this.#query.result

        if (!result || (result.isPending && result.fetchStatus === 'idle')) {
            return renderFunctions.initial?.()
        }

        if (result.isPending || result.isFetching) {
            return renderFunctions.pending?.()
        }

        if (result.isError) {
            return renderFunctions.error?.(result.error)
        }

        return renderFunctions.complete?.(result.data as T)
    }
}
