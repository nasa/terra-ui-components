---
meta:
    title: Pagination
    description: Pagination is a navigational element that allows users to navigate between content or pages.
layout: component
sidebarSection: Elements
---

## Usage

Pagination is used when you cannot fit the entire content on the screen. Pagination navigates through content but keeps the user on the same page. In some instances, users can choose how much content is displayed per page through a filter. This will ultimately increase or decrease the total number of pages.

## Variants

### Centered Pagination

Centered pagination displays the full pagination controls in the center of the container. This is useful when pagination is the primary focus.

```html:preview
<terra-pagination centered current="10" total="20"></terra-pagination>
```

```jsx:react
import TerraPagination from '@nasa-terra/components/dist/react/pagination';

const App = () => (
    <TerraPagination centered current={10} total={20} />
);
```

### Left-Aligned Pagination with Slot

Left-aligned pagination displays pagination controls on the left and provides a slot on the right for additional content (such as a rows per page dropdown).

```html:preview
<terra-pagination current="5" total="20">
    <terra-dropdown>
        <terra-button slot="trigger" caret>10 per page</terra-button>
        <terra-menu>
            <terra-menu-item value="10">10 per page</terra-menu-item>
            <terra-menu-item value="25">25 per page</terra-menu-item>
            <terra-menu-item value="50">50 per page</terra-menu-item>
        </terra-menu>
    </terra-dropdown>
</terra-pagination>
```

```jsx:react
import TerraPagination from '@nasa-terra/components/dist/react/pagination';
import TerraDropdown from '@nasa-terra/components/dist/react/dropdown';
import TerraButton from '@nasa-terra/components/dist/react/button';
import TerraMenu from '@nasa-terra/components/dist/react/menu';
import TerraMenuItem from '@nasa-terra/components/dist/react/menu-item';

const App = () => (
    <TerraPagination current={5} total={20}>
        <TerraDropdown>
            <TerraButton slot="trigger" caret>10 per page</TerraButton>
            <TerraMenu>
                <TerraMenuItem value="10">10 per page</TerraMenuItem>
                <TerraMenuItem value="25">25 per page</TerraMenuItem>
                <TerraMenuItem value="50">50 per page</TerraMenuItem>
            </TerraMenu>
        </TerraDropdown>
    </TerraPagination>
);
```

### Prev/Next Only

For mobile pagination where the number of pages doesn't exceed 5 pages, a simplified pagination can be used without numbers.

```html:preview
<terra-pagination variant="simple" current="2" total="5"></terra-pagination>
```

```jsx:react
import TerraPagination from '@nasa-terra/components/dist/react/pagination';

const App = () => (
    <TerraPagination variant="simple" current={2} total={5} />
);
```

## Examples

### First Page

```html:preview
<terra-pagination centered current="1" total="20"></terra-pagination>
```

### Middle Page

```html:preview
<terra-pagination centered current="10" total="20"></terra-pagination>
```

### Last Page

```html:preview
<terra-pagination centered current="20" total="20"></terra-pagination>
```

### Many Pages (with Ellipsis)

When there are many pages, ellipsis are shown to indicate skipped pages.

```html:preview
<terra-pagination centered current="50" total="100"></terra-pagination>
```

### Few Pages (No Ellipsis)

When there are 7 or fewer pages, all page numbers are shown.

```html:preview
<terra-pagination centered current="3" total="7"></terra-pagination>
```

## Events

Listen for the `terra-page-change` event to handle page changes:

```html:preview
<terra-pagination id="pagination" centered current="5" total="20"></terra-pagination>
<script>
    const pagination = document.getElementById('pagination');
    pagination.addEventListener('terra-page-change', (e) => {
        console.log('Page changed to:', e.detail.page);
    });
</script>
```

```jsx:react
import TerraPagination from '@nasa-terra/components/dist/react/pagination';

const App = () => {
    function handlePageChange(event) {
        console.log('Page changed to:', event.detail.page);
    }

    return (
        <TerraPagination
            centered
            current={5}
            total={20}
            onTerraPageChange={handlePageChange}
        />
    );
};
```

## Dark Mode

Pagination automatically adapts to dark mode based on system preference.

### Light Background

```html:preview
<div style="background-color: #f5f5f5; padding: 2rem;">
    <terra-pagination centered current="10" total="20"></terra-pagination>
</div>
```

### Dark Background

```html:preview
<div style="background-color: #1a1a1a; padding: 2rem;">
    <terra-pagination centered current="10" total="20"></terra-pagination>
</div>
```

## Customization

You can customize pagination appearance using CSS custom properties:

```css
terra-pagination {
    --terra-pagination-button-color: var(--terra-color-carbon-90);
    --terra-pagination-button-background-color: var(--terra-color-spacesuit-white);
    --terra-pagination-button-border-color: var(--terra-color-carbon-20);
    --terra-pagination-button-color-current: var(--terra-color-spacesuit-white);
    --terra-pagination-button-background-color-current: var(--terra-color-nasa-blue);
}
```

### Design Tokens

The following design tokens are available for customization:

-   `--terra-pagination-button-color`: Text color of page buttons (default: `--terra-color-carbon-90` in light mode, `--terra-color-carbon-60` in dark mode)
-   `--terra-pagination-button-background-color`: Background color of page buttons (default: `--terra-color-spacesuit-white` in light mode, `--terra-color-carbon-10` in dark mode)
-   `--terra-pagination-button-border-color`: Border color of page buttons (default: `--terra-color-carbon-20`)
-   `--terra-pagination-button-color-hover`: Text color of page buttons on hover (default: `--terra-color-carbon-90` in light mode, `--terra-color-carbon-80` in dark mode)
-   `--terra-pagination-button-background-color-hover`: Background color of page buttons on hover (default: `--terra-color-carbon-5`)
-   `--terra-pagination-button-border-color-hover`: Border color of page buttons on hover (default: `--terra-color-carbon-30`)
-   `--terra-pagination-button-color-current`: Text color of the current page button (default: `--terra-color-spacesuit-white`)
-   `--terra-pagination-button-background-color-current`: Background color of the current page button (default: `--terra-color-nasa-blue` in light mode, `--terra-color-nasa-blue-tint` in dark mode)
-   `--terra-pagination-button-border-color-current`: Border color of the current page button (default: `--terra-color-nasa-blue` in light mode, `--terra-color-nasa-blue-tint` in dark mode)

All tokens automatically adapt to dark mode when dark mode is active.

[component-metadata:terra-pagination]
