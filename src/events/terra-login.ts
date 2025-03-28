export type TerraLoginEvent = CustomEvent<string>

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-login': TerraLoginEvent
    }
}
