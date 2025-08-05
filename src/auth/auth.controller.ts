import { Task } from '@lit/task'
import type { StatusRenderer } from '@lit/task'
import type { ReactiveControllerHost } from 'lit'
import { authService, type AuthState } from './auth.service.js'

export class AuthController<C> {
    task: Task<[], AuthState>
    private unsubscribe?: () => void

    #host: ReactiveControllerHost & C

    constructor(host: ReactiveControllerHost & C) {
        this.#host = host

        this.task = new Task(host, {
            task: async ([]) => {
                this.unsubscribe = authService.subscribe(
                    state => {
                        if (state.token) {
                            // @ts-expect-error - we can't guarantee the host has a bearerToken property
                            this.#host.bearerToken = state.token
                        }

                        // Trigger a re-render when auth state changes
                        this.#host.requestUpdate()
                    },
                    // @ts-expect-error - we can't guarantee the host has a bearerToken property
                    this.#host.bearerToken
                )

                // Return current state
                return authService.getState()
            },
            args: (): any => [],
            autoRun: true,
        })
    }

    get state() {
        return authService.getState()
    }

    login() {
        authService.login()
    }

    render(renderFunctions: StatusRenderer<AuthState>) {
        return this.task.render(renderFunctions)
    }

    disconnectedCallback() {
        // Clean up subscription when controller is disconnected
        if (this.unsubscribe) {
            this.unsubscribe()
        }
    }
}
