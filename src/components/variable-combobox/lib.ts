import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import type { GroupedListItem, ListItem } from './variable-combobox.types.js'

function renderSearchResult(listItem: GroupedListItem, index: number) {
    return html`<li class="listbox-option-group" data-tree-walker="filter_skip">
        <span class="group-title" data-tree-walker="filter_skip"
            >${listItem.collectionEntryId}</span
        >
        <ul data-tree-walker="filter_skip">
            ${repeat(
                listItem.variables,
                variable =>
                    `${variable.collectionShortName}_${variable.collectionVersion}--${variable.longName}`,
                (variable, subIndex) => {
                    return html`
                        <li
                            id="listbox-option-${index}.${subIndex}"
                            role="option"
                            class="listbox-option"
                            data-long-name=${variable.longName}
                            data-event-detail=${variable.eventDetail}
                        >
                            ${variable.longName} (${variable.units})
                        </li>
                    `
                }
            )}
        </ul>
    </li>`
}

function removeEmptyCollections(docs: GroupedListItem[]) {
    const nonEmptyCollections = docs.filter(doc => {
        return !!doc.variables.length
    })

    return nonEmptyCollections
}

function groupDocsByCollection(docs: ListItem[]): GroupedListItem[] {
    const groupedDocs: Record<string, ListItem[]> = {}

    for (const doc of docs) {
        const key = `${doc.collectionShortName}_${doc.collectionVersion}`

        Array.isArray(groupedDocs[key])
            ? groupedDocs[key].push(doc)
            : (groupedDocs[key] = [doc])
    }

    return Object.entries(groupedDocs).map(([collectionEntryId, variables]) => {
        return {
            collectionEntryId,
            variables,
        }
    })
}

function cherryPickDocInfo(docs: Record<string, any>[]): ListItem[] {
    return docs.map(doc => {
        const renderableData = {
            collectionBeginningDateTime: doc['Collection.BeginDateTime'],
            collectionEndingDateTime: doc['Collection.EndDateTime'],
            collectionLongName: doc['Collection.LongName'],
            collectionShortName: doc['Collection.ShortName'],
            collectionVersion: doc['Collection.Version'],
            entryId: `${doc['Collection.ShortName']}_${doc['Collection.Version']}_${doc['Variable.Name']}`,
            longName: doc['Variable.LongName'],
            name: doc['Variable.Name'],
            standardName: doc['Variable.StandardName'],
            units: doc['Variable.Units'],
        }

        const { collectionLongName, ...eventDetails } = renderableData

        return {
            ...renderableData,
            eventDetail: JSON.stringify({
                ...eventDetails,
                datasetLandingPage: doc['Collection.DescriptionUrl'],
                variableLandingPage: doc['Variable.DescriptionUrl'],
            }),
        }
    })
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

export {
    cherryPickDocInfo,
    walkToOption,
    clearSelection,
    groupDocsByCollection,
    removeEmptyCollections,
    renderSearchResult,
}
