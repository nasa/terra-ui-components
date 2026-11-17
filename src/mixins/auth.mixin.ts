import type { LitElement } from 'lit'
import { property, state } from 'lit/decorators.js'
import { type AuthState, authService, type User } from '../auth/auth.service.js'
import { undefinedStringConverter } from '../internal/terra-element.js'
import type { Constructor } from './mixin.types.js'

export interface AuthHost {
    bearerToken?: string
    authState: AuthState
    isAuthenticated: boolean
    isLoggingIn: boolean
    login(): void
    logout(): void
    loginWithCredentials(username: string, password: string): Promise<User | null>
}

/**
 * AuthMixin equips a Lit component with Earthdata authentication state,
 * the `bearerToken` property, and login/logout methods directly via authService.
 *
 * Modeled after class-expression mixins:
 * - Subclasses Base cleanly
 * - Safely calls super lifecycle methods
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

        @state()
        authState: AuthState = authService.getState()

        @state()
        isLoggingIn: boolean = false

        #unsubscribe?: () => void

        get isAuthenticated(): boolean {
            return !this.authState.isLoading && Boolean(this.authState.token)
        }

        connectedCallback() {
            super.connectedCallback?.()

            this.#unsubscribe = authService.subscribe(state => {
                this.authState = state
                if (state.token) {
                    this.bearerToken = state.token
                }
                this.#emitLogin(state)
            }, this.bearerToken)

            // Ensure initial state matches authService.getState() (covers stubbed getState in tests)
            this.authState = authService.getState()
            if (this.authState.token && !this.bearerToken) {
                this.bearerToken = this.authState.token
            }
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

        async loginWithCredentials(
            username: string,
            password: string
        ): Promise<User | null> {
            this.isLoggingIn = true

            try {
                return await authService.loginWithCredentials(username, password)
            } finally {
                this.isLoggingIn = false
            }
        }
    }

    return AuthElement as unknown as T & Constructor<AuthHost>
}
