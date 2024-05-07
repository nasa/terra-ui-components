import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import type { GroupedListItem } from './type.js'

function renderSearchResult(listItem: GroupedListItem, index: number) {
    return html`<li class="listbox-option-group" data-tree-walker="filter_skip">
        <span class="group-title" data-tree-walker="filter_skip"
            >${listItem.name}</span
        >
        <ul data-tree-walker="filter_skip">
            ${repeat(
                listItem.items,
                item => `${listItem.name}_${item.name}`,
                (item, subIndex) => {
                    return html`
                        <li
                            id="listbox-option-${index}.${subIndex}"
                            role="option"
                            class="listbox-option"
                            data-name=${item.name}
                            data-event-detail=${JSON.stringify(item)}
                        >
                            ${item.name}
                        </li>
                    `
                }
            )}
        </ul>
    </li>`
}
