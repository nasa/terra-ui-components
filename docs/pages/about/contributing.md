---
meta:
    title: Contributing
    description: Learn how to contribute to Terra UI Components
---

# Contributing

Thank you for your interest in contributing to Terra UI Components! We welcome contributions from the community and are grateful for your help in making Terra UI better.

## Getting Started

Before you begin, please familiarize yourself with:

-   [Installation Guide](/getting-started/installation) - How to set up Terra UI locally
-   [Horizon Design System](https://website.nasa.gov/hds/) - NASA's design system guidelines
-   [Component Documentation](/components/avatar) - Examples of existing components

## Governance

The NASA GES DISC team maintains Terra UI Components and has final decision-making authority on:

-   New design tokens and their values
-   New components and their APIs
-   Breaking changes and major version updates
-   Overall project direction and priorities

We review all pull requests and provide feedback to help ensure contributions align with project goals and quality standards. Don't let this daunt you from submitting a PR — we're a friendly group and are happy to discuss any changes. When in doubt, feel free to open an issue to discuss your ideas before implementing them.

## GitHub Issues

We use GitHub Issues to track bugs, feature requests, and discussions. Before opening an issue, please:

1. **Search existing issues** to see if your issue has already been reported or discussed
2. **Use clear, descriptive titles** that summarize the issue
3. **Provide context** including:
    - What you're trying to accomplish
    - What you expected to happen
    - What actually happened
    - Steps to reproduce (for bugs)
    - Browser and OS information (for bugs)
    - Screenshots or code examples when helpful

### Issue Types

-   **Bug Report**: Something isn't working as expected
-   **Feature Request**: Suggest a new component, feature, or enhancement
-   **Question**: Ask for help or clarification
-   **Documentation**: Report documentation issues or suggest improvements

## Pull Requests

We welcome pull requests! Here's how to get started:

1. **Fork the repository** and clone it locally
2. **Create a feature branch** from `main`:
    ```bash
    git checkout -b feature/my-new-feature
    ```
3. **Make your changes** following our [Best Practices](#best-practices)
4. **Test your changes** thoroughly
5. **Update documentation** if needed
6. **Submit a pull request** with a clear description of your changes

### Pull Request Guidelines

-   Keep PRs focused on a single feature or fix
-   Include tests for new features
-   Update documentation for API changes
-   Ensure all tests pass (`npm run test`)
-   Follow our code formatting standards (`npm run prettier`)

## Creating a New Component

Terra UI Components provides a generator to help you create new components quickly. To create a new component:

```bash
npm run create
```

You'll be prompted to enter the component tag name (e.g., `terra-my-component`). The generator will create:

-   Component TypeScript file (`*.component.ts`)
-   Component styles file (`*.styles.ts`)
-   Component test file (`*.test.ts`)
-   Component definition file (`*.ts`)
-   Documentation page template

After running the generator, you'll need to:

1. Implement your component logic in the `.component.ts` file
2. Add styles using design tokens in the `.styles.ts` file
3. Write tests in the `.test.ts` file
4. Update the documentation page in `docs/pages/components/`
5. Add design tokens to `src/themes/horizon.css` if needed

### Component Requirements

All new components must:

-   **Be accessible**: Follow WCAG guidelines, support keyboard navigation, and work with screen readers
-   **Follow Horizon Design System**: Match HDS design patterns and guidelines
-   **Use CSS custom properties**: Use design tokens from `horizon.css` instead of hardcoded values
-   **Support dark mode**: Ensure components work in both light and dark themes
-   **Include proper documentation**: JSDoc comments for all public APIs
-   **Have tests**: Include unit tests covering the component's functionality

## Python Widgets

Python widgets enable Terra UI components to work in Jupyter Notebooks. Widgets only need to be created when a component needs to be supported in Jupyter Notebooks.

### Creating a Widget

To create a Python widget for a component:

```bash
npm run create-widget
```

You'll be prompted to select the component. The generator will create a Python widget file that maps the component's properties and events to Python traits.

### Updating a Widget

If a widget already exists and you've added new properties or events to the component, update the widget:

```bash
npm run update-widget
```

This will scan the component's TypeScript file and update the Python widget with any new properties or events.

## Testing

Terra UI Components uses [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) for testing. To launch the test runner during development, open a terminal and launch the dev server:

```bash
npm start
```

In a second terminal window, launch the test runner:

```bash
npm run test:watch
```

Follow the on-screen instructions to work with the test runner. Tests will automatically re-run as you make changes.

To run all tests only once:

```bash
npm run test
```

To test a single component, use the component's basename as shown in the following example:

```bash
npm run test:component input
```

This will run tests for the `input` component (the test file `input.test.ts`).

### Writing Tests

Tests should be placed in `*.test.ts` files alongside the component. Use the `@open-wc/testing` library which provides helpful testing utilities:

```typescript
import '../../../dist/terra-ui-components.js'
import { expect, fixture, html } from '@open-wc/testing'

describe('<terra-my-component>', () => {
    it('should render a component', async () => {
        const el = await fixture(html` <terra-my-component></terra-my-component> `)
        expect(el).to.exist
    })
})
```

## Documentation

Maintaining good documentation can be a painstaking task, but poor documentation leads to frustration and makes the project less appealing to users. Fortunately, writing documentation for Terra UI is fast and easy!

Most of Terra UI's technical documentation is generated with JSDoc comments and TypeScript metadata from the source code. Every property, method, event, etc. is documented this way. In-code comments encourage contributors to keep the documentation up to date as changes occur so the docs are less likely to become stale. Refer to an existing component to see how JSDoc comments are used in Terra UI.

Instructions, code examples, and interactive demos are hand-curated to give users the best possible experience. Typically, the most relevant information is shown first and less common examples are shown towards the bottom. Edge cases and gotchas should be called out in context with tips or warnings.

The docs are powered by Eleventy. Check out `docs/pages/components/*.md` to get an idea of how pages are structured and formatted. If you're creating a new component, it may help to use an existing component's markdown file as a template.

### Documentation Structure

Component documentation pages should include:

1. **Front matter** with metadata (title, description, sidebarSection)
2. **Preview example** showing the component in action
3. **Examples section** with various use cases
4. **Properties table** (auto-generated from JSDoc)
5. **Events table** (auto-generated from JSDoc)
6. **Slots table** (auto-generated from JSDoc)
7. **Methods table** (auto-generated from JSDoc)
8. **Usage section** with best practices
9. **Accessibility section** with relevant a11y information

## Best Practices

### Accessibility

All components must be accessible:

-   Use semantic HTML elements where possible
-   Support keyboard navigation
-   Include proper ARIA attributes (`aria-label`, `aria-describedby`, `role`, etc.)
-   Ensure sufficient color contrast (WCAG AA minimum)
-   Test with screen readers
-   Support focus management for interactive components

Refer to the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) for guidance.

### Code Formatting

We use [Prettier](https://prettier.io/) for code formatting. The project includes a Prettier configuration, so formatting is consistent across the codebase.

**Installing Prettier in VS Code:**

1. Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
2. Enable "Format on Save" in VS Code settings:
    ```json
    {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
    ```

To format all files:

```bash
npm run prettier
```

To check formatting without making changes:

```bash
npm run prettier:check
```

### Class Names and Shadow DOM

Components use Shadow DOM for style encapsulation. Follow these conventions:

-   Use BEM-like naming: `component-name__element-name--modifier`
-   Prefix classes with the component name to avoid collisions
-   Use CSS custom properties for values that should be customizable
-   Target internal elements using CSS parts (`::part()`) when exposing customization points

Example:

```typescript
// Component class
export default class TerraMyComponent extends TerraElement {
    render() {
        return html`
            <div part="base" class="my-component">
                <span part="label" class="my-component__label">
                    <slot></slot>
                </span>
            </div>
        `
    }
}
```

### Custom Events

Components should emit custom events prefixed with `terra-` to avoid collisions with standard DOM events:

```typescript
this.emit('terra-change', {
    detail: { value: this.value },
})
```

Document all custom events in the component's JSDoc:

```typescript
/**
 * @event terra-change - Emitted when the value changes.
 */
```

### CSS Custom Properties

Always use design tokens from `horizon.css` instead of hardcoded values:

```typescript
// ✅ Good - uses design tokens
.my-component {
    color: var(--terra-color-carbon-80);
    padding: var(--terra-spacing-medium);
    border-radius: var(--terra-border-radius-medium);
}

// ❌ Bad - hardcoded values
.my-component {
    color: #333;
    padding: 1rem;
    border-radius: 4px;
}
```

If you need component-specific tokens, add them to `horizon.css` in a section for your component. Always include dark mode overrides when adding new tokens.

### Icons

Use the `terra-icon` component for icons. Icons are loaded from icon libraries (default, heroicons, etc.):

```typescript
import TerraIcon from '../icon/icon.component.js'

// In render:
html`<terra-icon name="check" library="heroicons"></terra-icon>`
```

For simple graphics, inline SVG is acceptable:

```typescript
html`<svg viewBox="0 0 16 16">
    <circle r="6" cx="8" cy="8" fill="currentColor"></circle>
</svg>`
```

### Writing Tests

Write tests that cover:

-   Component rendering
-   Property changes
-   Event emission
-   User interactions (clicks, keyboard navigation)
-   Edge cases and error states
-   Accessibility features

Use `@open-wc/testing` utilities:

```typescript
import { expect, fixture, html, waitUntil } from '@open-wc/testing'

it('should emit terra-change when value changes', async () => {
    const el = await fixture(html`<terra-input></terra-input>`)
    let changeEvent = null

    el.addEventListener('terra-change', e => {
        changeEvent = e
    })

    el.value = 'new value'
    el.input.dispatchEvent(new Event('input', { bubbles: true }))

    await waitUntil(() => changeEvent !== null)
    expect(changeEvent).to.exist
})
```

## Questions?

If you have questions about contributing, please:

-   Open a [GitHub issue](https://github.com/nasa/terra-ui-components/issues) for discussion
-   Review existing component implementations for examples
-   Check the [Horizon Design System documentation](https://website.nasa.gov/hds/)

We're here to help and appreciate your contributions!
