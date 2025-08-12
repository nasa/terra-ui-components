export interface TerraAccordionToggleEvent extends CustomEvent {
    detail: {
        open: boolean
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        'terra-accordion-toggle': TerraAccordionToggleEvent
    }
}
