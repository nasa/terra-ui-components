import { html } from 'lit'
import type { TemplateResult } from 'lit'
import type { SubsetJobError } from '../apis/harmony.api.js'

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
 * and nested error structures
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

    // Check cause property (standard Error.cause)
    // Cause can be an Error object or a string
    const { cause } = error as Error & { cause?: unknown }
    if (cause) {
        let causeMessage: string
        if (cause instanceof Error) {
            causeMessage = cause.message.toLowerCase()
            if (cause.name === 'AbortError') {
                return true
            }
        } else {
            causeMessage = String(cause).toLowerCase()
        }

        if (
            causeMessage.includes('cancelled') ||
            causeMessage.includes('canceled') ||
            causeMessage.includes('aborted')
        ) {
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
    jobErrors?: Array<SubsetJobError>,
): HarmonyErrorDetails {
    let errorCode = '400' // Default to 400 for GraphQL errors (usually client errors)
    let errorMessage = 'An error occurred'
    let errorContext: string | undefined

    // Extract error information from the error object
    if (error instanceof Error) {
        errorMessage = error.message

        const { cause } = error as Error & { cause?: unknown }

        // Check cause property (standard Error.cause)
        // Cause can be an Error object or a string
        let underlyingMessage: string | undefined
        if (cause) {
            if (cause instanceof Error) {
                underlyingMessage = cause.message
            } else {
                underlyingMessage = String(cause)
            }
        }

        // If the underlying cause indicates cancellation, surface that message
        if (underlyingMessage) {
            const underlyingMessageLower = underlyingMessage.toLowerCase()
            if (
                underlyingMessageLower.includes('cancelled') ||
                underlyingMessageLower.includes('canceled') ||
                underlyingMessageLower.includes('aborted')
            ) {
                errorMessage = underlyingMessage
            }
        }

        // Try to extract a more specific message from known error formats
        const errorMatch = errorMessage.match(
            /Failed to (?:create|fetch|cancel) subset job:\s*(.+)/i,
        )
        if (errorMatch) {
            errorContext = errorMatch[1]
            errorMessage = errorMatch[1]
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
        const errorText =
            error.context || error.message || 'Bad or missing input'
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
