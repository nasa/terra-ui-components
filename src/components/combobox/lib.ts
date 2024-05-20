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
    //* If attempting to walk to an adjacent element does not work, we're at either end of a list and need to jump.
    if (maybeCurrentElement === null || maybeCurrentElement === walker.root) {
        direction === 'next' ? walkToFirst(walker) : walkToLast(walker)
    }

    combobox.setAttribute(
        'aria-activedescendant',
        (walker.currentNode as HTMLLIElement).id
    )
    ;(walker.currentNode as HTMLLIElement).setAttribute('aria-selected', 'true')

    //* Browsers seem to like having a little bit of breathing room before scrolling.
    globalThis.setTimeout(() => {
        ;(walker.currentNode as HTMLLIElement).scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
        })
    }, 100)
}

function walkToFirst(walker: TreeWalker) {
    walker.parentNode()
    walker.firstChild()
}

function walkToLast(walker: TreeWalker) {
    walker.parentNode()
    walker.lastChild()
}

export { clearSelection, walkToOption }
