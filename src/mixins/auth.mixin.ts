import type { LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import { type AuthState, authService, type User } from '../auth/auth.service.js'
import { undefinedStringConverter } from '../internal/terra-element.js'
import type { Constructor } from './mixin.types.js'

export interface AuthHost {
    bearerToken?: string
    user: User | null
    authError: string | null
    isAuthenticated: boolean
    isLoggingIn: boolean
    login(): void
    logout(): void
    loginWithCredentials(username: string, password: string): Promise<User | null>
}

/**
 * AuthMixin connects a Lit component to the singleton `authService`.
 *
 * `authService` is the single source of truth for session state. Session fields
 * (`user`, `authError`, `isLoggingIn`) are read directly from `authService.getState()`
 * via getters, and `authService.subscribe()` triggers `this.requestUpdate()` whenever
 * session state changes.
 *
 * `bearerToken` is a `@property()` on the element because it serves as both
 * an inbound HTML attribute/property (`<terra-map bearer-token="...">`) that can
 * seed `authService` on mount, and a Lit reactive property tracked in
 * `changedProperties` for `@watch('bearerToken')` observers.
 *
 * @event terra-login - Emitted when authentication state changes or login occurs.
 */
export function AuthMixin<T extends Constructor<LitElement>>(Base: T) {
    class AuthElement extends Base implements AuthHost {
        /**
         * The token to be used for authentication with remote servers.
         * The component provides the header "Authorization: Bearer" (the request header and authentication scheme).
         * The property's value will be inserted after "Bearer" (the authentication scheme).
         */
        @property({
            attribute: 'bearer-token',
            reflect: false,
            converter: undefinedStringConverter,
        })
        bearerToken?: string

        #unsubscribe?: () => void

        get user(): User | null {
            return authService.getState().user
        }

        get authError(): string | null {
            return authService.getState().error
        }

        get isLoggingIn(): boolean {
            return authService.getState().isLoading
        }

        get isAuthenticated(): boolean {
            return !this.isLoggingIn && Boolean(this.bearerToken)
        }

        connectedCallback() {
            super.connectedCallback?.()

            this.#unsubscribe = authService.subscribe(state => {
                this.bearerToken = state.token ?? undefined
                this.requestUpdate()
                this.#emitLogin(state)
            }, this.bearerToken)
        }

        disconnectedCallback() {
            super.disconnectedCallback?.()

            if (this.#unsubscribe) {
                this.#unsubscribe()
                this.#unsubscribe = undefined
            }
        }

        #emitLogin(state: AuthState) {
            this.dispatchEvent(
                new CustomEvent('terra-login', {
                    bubbles: true,
                    composed: true,
                    detail: state,
                })
            )
        }

        login(): void {
            authService.login()
        }

        logout(): void {
            authService.logout()
        }

        loginWithCredentials(
            username: string,
            password: string
        ): Promise<User | null> {
            return authService.loginWithCredentials(username, password)
        }
    }

    return AuthElement as unknown as T & Constructor<AuthHost>
}
