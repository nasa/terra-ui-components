import { html } from 'lit'
import type { ListItem } from './variable-keyword-search.types.js'

const whenIdle =
    'requestIdleCallback' in window ? requestIdleCallback : requestAnimationFrame

function renderSearchResult(listItem: ListItem) {
    return html`
        <li id=${listItem.id} role="option" class="listbox-option">${listItem.id}</li>
    `
}

function clearSelection(combobox: HTMLInputElement, listbox: HTMLUListElement) {
    combobox.removeAttribute('aria-activedescendant')

    listbox
        .querySelectorAll('[aria-selected]')
        .forEach(option => option.removeAttribute('aria-selected'))
}

function walkToOption(
    walker: TreeWalker,
    combobox: HTMLInputElement,
    direction: 'next' | 'previous' = 'next'
) {
    const maybeCurrentElement =
        direction === 'next' ? walker.nextNode() : walker.previousNode()

    //* Sometimes the TreeWalker will walk to the root node instead of the next.
    //* If attempting to walk to an adjacent element does not work, we're at the end of a list and need to jump.
    if (maybeCurrentElement === null || maybeCurrentElement === walker.root) {
        walker.parentNode()
        direction === 'next' ? walker.firstChild() : walker.lastChild()
    }

    const currentNode = walker.currentNode as HTMLLIElement

    whenIdle(() => {
        currentNode.scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
        })
        currentNode.setAttribute('aria-selected', 'true')
        combobox.setAttribute('aria-activedescendant', currentNode.id)
    })
}

export { walkToOption, clearSelection, renderSearchResult, whenIdle }
