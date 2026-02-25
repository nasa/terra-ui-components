import { HttpException } from '../exceptions/http.exception.js'

/**
 * A simple API client for interacting with REST APIs
 * Handles authentication via Bearer tokens
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
    method?: HttpMethod
    body?: unknown
    headers?: HeadersInit
    signal?: AbortSignal
}

async function request<T>(
    url: string,
    { method = 'GET', body, headers = {}, signal }: RequestOptions = {}
): Promise<T> {
    try {
        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal,
        })

        if (!res.ok) {
            if (!res.headers.get('Content-Type')?.includes('application/json')) {
                // response is not JSON, assume it's a server error
                const text = await res.text()
                throw new HttpException({
                    status: res.status,
                    message: text || `HTTP ${res.status}`,
                })
            }

            const json = await res.json()
            throw new HttpException({
                status: res.status,
                message:
                    json.message ?? // most REST clients will pass a error message
                    json.description ?? // NASA Harmony uses the description field
                    json.errors?.[0] ?? // NASA CMR uses an array of errors
                    `HTTP ${res.status}`,
            })
        }

        if (res.status === 204) {
            return undefined as T
        }

        return res.json() as Promise<T>
    } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
            // ignore aborted requests, these are expected when React Query cancels a request using signals
            // catching them prevents polluting the console with errors
            return undefined as T
        }

        if (err instanceof HttpException && err.status !== 500) {
            throw err
        }

        // unhandled error
        console.error(err)
        console.error(`Failed to fetch ${url}`)
        throw new HttpException({
            status: 500,
            message: `An unknown error occurred when attempting to fetch, please try again later.`,
            cause: err as Error,
        })
    }
}

export const apiClient = {
    get: <T>(url: string, options?: RequestOptions) =>
        request<T>(url, { ...options }),
    post: <T>(url: string, body: unknown, options?: RequestOptions) =>
        request<T>(url, { method: 'POST', body, ...options }),
    put: <T>(url: string, body: unknown) => request<T>(url, { method: 'PUT', body }),
    patch: <T>(url: string, body: unknown) =>
        request<T>(url, { method: 'PATCH', body }),
    delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
}
