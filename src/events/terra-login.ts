import type { AuthState } from '../auth/auth.service.js'

export type TerraLoginEvent = CustomEvent<AuthState>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-login': TerraLoginEvent
    }
}
