import { html } from 'lit'
import type { TemplateResult } from 'lit'
import type { SubsetJobError } from '../data-services/types.js'

export interface HarmonyErrorDetails {
    status: number
    code: string
    message: string
    context?: string
    isCancellation?: boolean
}

export interface HarmonyError {
    code: string
    message?: string
    context?: string
}

/**
 * Checks if an error indicates a user cancellation by checking the error message
 * and nested error structures (like Apollo's cause/networkError)
 * @param error - The error to check
 * @returns true if the error indicates a user cancellation
 */
export function isCancellationError(error: unknown): boolean {
    if (!(error instanceof Error)) {
        return false
    }

    // Check standard AbortError
    if (error.name === 'AbortError') {
        return true
    }

    const errorMessage = error.message.toLowerCase()

    // Check main error message
    if (
        errorMessage.includes('cancelled') ||
        errorMessage.includes('canceled') ||
        errorMessage.includes('aborted')
    ) {
        return true
    }

    // Check Apollo error structure for nested errors
    const apolloError = error as any

    // Check cause property (standard Error.cause)
    // Cause can be an Error object or a string
    if (apolloError.cause) {
        let causeMessage: string
        if (apolloError.cause instanceof Error) {
            causeMessage = apolloError.cause.message.toLowerCase()
            if (apolloError.cause.name === 'AbortError') {
                return true
            }
        } else {
            causeMessage = String(apolloError.cause).toLowerCase()
        }

        if (
            causeMessage.includes('cancelled') ||
            causeMessage.includes('canceled') ||
            causeMessage.includes('aborted')
        ) {
            return true
        }
    }

    // Check networkError (Apollo-specific)
    if (apolloError.networkError instanceof Error) {
        const networkMessage = apolloError.networkError.message.toLowerCase()
        if (
            networkMessage.includes('cancelled') ||
            networkMessage.includes('canceled') ||
            networkMessage.includes('aborted') ||
            apolloError.networkError.name === 'AbortError'
        ) {
            return true
        }
    }

    // Check graphQLErrors array
    if (Array.isArray(apolloError.graphQLErrors)) {
        const hasCancellation = apolloError.graphQLErrors.some((gqlError: any) => {
            const msg = (gqlError.message || '').toLowerCase()
            return (
                msg.includes('cancelled') ||
                msg.includes('canceled') ||
                msg.includes('aborted')
            )
        })
        if (hasCancellation) {
            return true
        }
    }

    return false
}

/**
 * Extracts error information from Harmony GraphQL operations
 * @param error - The error object from Harmony operations
 * @param jobErrors - Optional array of job errors from Harmony job status
 * @returns Error details object with status, code, message, and context
 */
export function extractHarmonyError(
    error: unknown,
    jobErrors?: Array<SubsetJobError>
): HarmonyErrorDetails {
    let errorCode = '400' // Default to 400 for GraphQL errors (usually client errors)
    let errorMessage = 'An error occurred'
    let errorContext: string | undefined

    // Extract error information from the error object
    if (error instanceof Error) {
        errorMessage = error.message

        // Check for Apollo error structure with nested errors
        // Apollo errors can have cause, networkError, or graphQLErrors
        const apolloError = error as any

        // Check for "caused by" or underlying error that indicates user cancellation
        let underlyingError: Error | undefined
        let underlyingMessage: string | undefined

        // Check cause property (standard Error.cause)
        // Cause can be an Error object or a string
        if (apolloError.cause) {
            if (apolloError.cause instanceof Error) {
                underlyingError = apolloError.cause
                underlyingMessage = apolloError.cause.message
            } else {
                // Cause is a string (e.g., "Cancelled time series request")
                underlyingMessage = String(apolloError.cause)
            }
        }

        // Check networkError (Apollo-specific)
        if (apolloError.networkError instanceof Error) {
            underlyingError = apolloError.networkError
            underlyingMessage = apolloError.networkError.message
        }

        // Check graphQLErrors array
        if (
            Array.isArray(apolloError.graphQLErrors) &&
            apolloError.graphQLErrors.length > 0
        ) {
            const firstGQLError = apolloError.graphQLErrors[0]
            if (firstGQLError?.originalError instanceof Error) {
                underlyingError = firstGQLError.originalError
            } else if (firstGQLError?.message) {
                // Use GraphQL error message if it indicates cancellation
                const gqlMessage = firstGQLError.message.toLowerCase()
                if (
                    gqlMessage.includes('cancelled') ||
                    gqlMessage.includes('canceled') ||
                    gqlMessage.includes('aborted')
                ) {
                    errorMessage = firstGQLError.message
                }
            }
        }

        // If we found an underlying error or message, check if it indicates user cancellation
        if (underlyingMessage) {
            const underlyingMessageLower = underlyingMessage.toLowerCase()
            if (
                underlyingMessageLower.includes('cancelled') ||
                underlyingMessageLower.includes('canceled') ||
                underlyingMessageLower.includes('aborted')
            ) {
                // Use the underlying error message instead of the Apollo wrapper
                errorMessage = underlyingMessage
            }
        } else if (underlyingError) {
            const underlyingMessageLower = underlyingError.message.toLowerCase()
            if (
                underlyingMessageLower.includes('cancelled') ||
                underlyingMessageLower.includes('canceled') ||
                underlyingMessageLower.includes('aborted') ||
                underlyingError.name === 'AbortError'
            ) {
                // Use the underlying error message instead of the Apollo wrapper
                errorMessage = underlyingError.message
            }
        }

        // Try to extract GraphQL error information
        // GraphQL errors often have a format like "Failed to create subset job: <message>"
        // or the error might be an Apollo error with more details
        const graphQLErrorMatch = errorMessage.match(
            /Failed to (?:create|fetch|cancel) subset job:\s*(.+)/i
        )
        if (graphQLErrorMatch) {
            errorContext = graphQLErrorMatch[1]
            errorMessage = graphQLErrorMatch[1] // Use the extracted message as the main message
        } else {
            errorContext = errorMessage
        }

        // Try to extract status code from error message
        const statusMatch = errorMessage.match(/status[:\s]+(\d+)/i)
        if (statusMatch) {
            errorCode = statusMatch[1]
        }
    } else {
        errorMessage = String(error)
        errorContext = errorMessage
    }

    // If we have job errors, use the first one's message
    if (jobErrors && jobErrors.length > 0) {
        errorContext = jobErrors[0].message || errorContext
        errorMessage = jobErrors[0].message || errorMessage
    }

    // Check if this is a cancellation error
    const isCancellation = isCancellationError(error)

    return {
        status: parseInt(errorCode, 10) || 500,
        code: errorCode,
        message: errorMessage,
        context: errorContext,
        isCancellation,
    }
}

/**
 * Formats error messages for display in UI components
 * @param error - Error object with code, message, and optional context
 * @returns HTML template for the error message
 */
export function formatHarmonyErrorMessage(error: HarmonyError): TemplateResult {
    const errorCode = error.code

    // Handle 429 - Quota exceeded
    if (errorCode === '429') {
        return html`
            You have reached your quota for the month. Please reach out using the
            "Help" menu above for help
        `
    }

    // Handle 400 - Bad request, show the error message from the API
    if (errorCode === '400') {
        const errorText = error.context || error.message || 'Bad or missing input'
        return html`${errorText}`
    }

    // If we have a specific error message/context, show it instead of generic message
    const errorText = error.context || error.message
    if (errorText && errorText !== 'An error occurred') {
        return html`${errorText}`
    }

    // Handle all other errors with generic message
    return html`
        There was a problem making this request. For help, please
        <a
            href="https://forum.earthdata.nasa.gov/viewforum.php?f=7&DAAC=3"
            target="_blank"
            rel="noopener noreferrer"
            >contact us using the Earthdata Forum</a
        >
    `
}
