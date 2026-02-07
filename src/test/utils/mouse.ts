import { sendMouse } from '@web/test-runner-commands'

export async function mouseOverElement(el: HTMLElement) {
    const rect = el.getBoundingClientRect()

    // hover over the middle of the element
    await sendMouse({
        type: 'move',
        position: [
            Math.floor(rect.left + rect.width / 2),
            Math.floor(rect.top + rect.height / 2),
        ],
    })
}

export async function mouseOutElement(el: HTMLElement) {
    const rect = el.getBoundingClientRect()

    // hover off of the element
    await sendMouse({
        type: 'move',
        position: [rect.left - 20, rect.top - 20],
    })
}
