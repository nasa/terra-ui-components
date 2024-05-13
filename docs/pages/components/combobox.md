---
meta:
    title: Combobox
    description:
layout: component
---

```html:preview
<style>
  .hint {
    bottom: 0;
    color: var(--edux-color-neutral--600, var(--color-neutral--600));
    flex: 1 1 100%;
    font-size: 0.875rem;
    margin-block: 0;
    margin-bottom: 1rem;
    }
</style>
<edux-button id="cycleList">Cycle Statuses</edux-button>

<p class="hint">Use to cycle status of combobox</p>

<edux-combobox></edux-combobox>


<script type="module">
  // Select the edux-combobox element from the DOM
const element = document.querySelector('edux-combobox');

// Log the initial state of searchableList
console.log('Initial searchableList:', element.content);

// Define data for each type of SearchableList
const listItemData = [
    { name: 'Item1', title: 'Title1', value: 'Value1' },
    { name: 'Item2', title: 'Title2', value: 'Value2' },
     { name: 'Item3', title: 'Title3', value: 'Value3' }
];

// Assuming structure for GroupedListItem, here's a sample
const groupedListItemData = [
    {
        name: 'Group1',
        items: [
            { name: 'Item1', title: 'Title1', value: 'Value1' },
            { name: 'Item2', title: 'Title2', value: 'Value2' },
             { name: 'Item3', title: 'Title3', value: 'Value3' }
        ]
    },
    {
        name: 'Group2',
        items: [
            { name: 'Item4', title: 'Title4', value: 'Value4' },
            { name: 'Item5', title: 'Title5', value: 'Value5' },
            { name: 'Item6', title: 'Title6', value: 'Value6' }
        ]
    }
];

// Add an event listener to handle the custom 'edux-combobox-change' event
element.addEventListener('edux-combobox-change', (e) => {
    console.log('Combobox changed:', e.detail);
});



// Function to cycle through different SearchableList types on button click
let currentTypeIndex = 0;
let currentStatusIndex = 0;
function cycleSearchableList() {
    const statuses = ['INITIAL', 'PENDING', 'COMPLETE', 'ERROR']
    const types = ['ListItem', 'GroupedListItem'];
    const data = [listItemData, groupedListItemData];

    // Update the searchableList property with the next type
    element.status = statuses[currentStatusIndex]

    element.content = {
        type: types[currentTypeIndex],
        ...(statuses[currentStatusIndex] === 'ERROR' ? {data: 'An Error Occurred'} : {data: data[currentTypeIndex]})
    };

    document.querySelector("#cycleList").innerHTML = "Cycle Statuses" + " | " + statuses[currentStatusIndex]


    // Log the change for visibility
    console.log('Updated content to:', element.content);

    console.log("element status: ", element.status)

    // Move to the next type or wrap around
    currentStatusIndex = (currentStatusIndex + 1) % statuses.length;

    if(currentStatusIndex === 2) {
      currentTypeIndex = (currentTypeIndex + 1) % types.length;
    }
}

// Create a button element dynamically
const button = document.querySelector('#cycleList');
button.addEventListener('click', cycleSearchableList);

</script>
```

## Examples

### Default Combobox

```html:preview
<edux-combobox></edux-combobox>
```

### Configured Variable Combobox

```html:preview
<edux-combobox placeholder="Search for items: e.g., albedo" hide-label hide-help status='COMPLETE' content='{"type": "GroupedListItem", "data" : [{"name":"Amos group","items":[{"name":"Item 1","title":"Title 1","value":"Value 1"},{"name":"Item 2","title":"Title 2","value":"Value 2"}]},{"name":"Ben group","items":[{"name":"Item 3","title":"Title 3","value":"Value 3"},{"name":"Item 4","title":"Title 4","value":"Value 4"}]},{"name":"Jon group","items":[{"name":"Item 5","title":"Title 5","value":"Value 5"},{"name":"Item 6","title":"Title 6","value":"Value 6"}]},{"name":"Krupa group","items":[{"name":"Item 7","title":"Title 7","value":"Value 7"},{"name":"Item 8","title":"Title 8","value":"Value 8"}]}]}'></edux-combobox>
```

[component-metadata:edux-combobox]
