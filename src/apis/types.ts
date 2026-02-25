export type RequestOptions = {
    method?: HttpMethod
    body?: unknown
    headers?: HeadersInit
    signal?: AbortSignal
    bearerToken?: string
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
