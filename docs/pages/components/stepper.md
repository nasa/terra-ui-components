---
meta:
    title: Stepper
    description: Steppers display a visitor's progress through linear workflows and experiences with multiple steps.
layout: component
sidebarSection: Elements
---

```html:preview
<terra-stepper>
  <terra-stepper-step title="Background" state="completed">Curation and Production</terra-stepper-step>
  <terra-stepper-step title="Contact Information" state="current"></terra-stepper-step>
  <terra-stepper-step title="Event Details" state="upcoming"></terra-stepper-step>
  <terra-stepper-step title="Documents" state="upcoming"></terra-stepper-step>
</terra-stepper>
```

```jsx:react
import TerraStepper from '@nasa-terra/components/dist/react/stepper';
import TerraStepperStep from '@nasa-terra/components/dist/react/stepper-step';

const App = () => (
  <TerraStepper>
    <TerraStepperStep title="Background" state="completed">
      Curation and Production
    </TerraStepperStep>
    <TerraStepperStep title="Contact Information" state="current" />
    <TerraStepperStep title="Event Details" state="upcoming" />
    <TerraStepperStep title="Documents" state="upcoming" />
  </TerraStepper>
);
```

## Examples

### Default Variant

The default stepper includes a color-coded bar with a title for each step and an optional caption. It should be used when the steps are clearly defined and different.

```html:preview
<terra-stepper>
  <terra-stepper-step title="Background" state="completed">Curation and Production</terra-stepper-step>
  <terra-stepper-step title="Contact Information" state="current"></terra-stepper-step>
  <terra-stepper-step title="Event Details" state="upcoming"></terra-stepper-step>
  <terra-stepper-step title="Documents" state="upcoming"></terra-stepper-step>
</terra-stepper>
```

```jsx:react
import TerraStepper from '@nasa-terra/components/dist/react/stepper';
import TerraStepperStep from '@nasa-terra/components/dist/react/stepper-step';

const App = () => (
  <TerraStepper>
    <TerraStepperStep title="Background" state="completed">
      Curation and Production
    </TerraStepperStep>
    <TerraStepperStep title="Contact Information" state="current" />
    <TerraStepperStep title="Event Details" state="upcoming" />
    <TerraStepperStep title="Documents" state="upcoming" />
  </TerraStepper>
);
```

### Condensed Variant

The condensed version uses colored bars to represent each step. It can be used when space is a concern, there are many steps, or when the titles of each step aren't descriptive (for example a quiz with numbered steps).

```html:preview
<terra-stepper variant="condensed">
  <terra-stepper-step state="completed"></terra-stepper-step>
  <terra-stepper-step state="completed"></terra-stepper-step>
  <terra-stepper-step state="current"></terra-stepper-step>
  <terra-stepper-step state="upcoming"></terra-stepper-step>
  <terra-stepper-step state="upcoming"></terra-stepper-step>
  <terra-stepper-step state="upcoming"></terra-stepper-step>
  <terra-stepper-step state="upcoming"></terra-stepper-step>
  <terra-stepper-step state="upcoming"></terra-stepper-step>
  <terra-stepper-step state="upcoming"></terra-stepper-step>
  <terra-stepper-step state="upcoming"></terra-stepper-step>
</terra-stepper>
<div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--terra-color-carbon-60);">Step 3 of 10</div>
```

### Step States

Each step can be in one of three states: `completed`, `current`, or `upcoming`.

```html:preview
<terra-stepper>
  <terra-stepper-step title="Completed" state="completed">Done</terra-stepper-step>
  <terra-stepper-step title="Current" state="current">In Progress</terra-stepper-step>
  <terra-stepper-step title="Upcoming" state="upcoming">Not Started</terra-stepper-step>
</terra-stepper>
```

### With Captions

Steps can include optional captions to provide additional context.

```html:preview
<terra-stepper>
  <terra-stepper-step title="Background" state="completed">Curation and Production</terra-stepper-step>
  <terra-stepper-step title="Contact Information" state="current">Your details</terra-stepper-step>
  <terra-stepper-step title="Event Details" state="upcoming">Event information</terra-stepper-step>
</terra-stepper>
```

### Equal Width Distribution

The stepper automatically distributes space evenly among all steps using flexbox. Each step takes an equal portion of the available width.

```html:preview
<terra-stepper>
  <terra-stepper-step title="Step 1" state="completed"></terra-stepper-step>
  <terra-stepper-step title="Step 2" state="completed"></terra-stepper-step>
  <terra-stepper-step title="Step 3" state="current"></terra-stepper-step>
  <terra-stepper-step title="Step 4" state="upcoming"></terra-stepper-step>
</terra-stepper>
```

```jsx:react
import TerraStepper from '@nasa-terra/components/dist/react/stepper';
import TerraStepperStep from '@nasa-terra/components/dist/react/stepper-step';

const App = () => (
  <TerraStepper>
    <TerraStepperStep title="Step 1" state="completed" />
    <TerraStepperStep title="Step 2" state="completed" />
    <TerraStepperStep title="Step 3" state="current" />
    <TerraStepperStep title="Step 4" state="upcoming" />
  </TerraStepper>
);
```

## Usage Guidelines

-   **Step titles** should be as short as possible, preferably 1-2 words
-   The titles included in the stepper are not meant to serve as the main page header, which can appear below the stepper
-   The stepper is not meant to be interactive. Links or buttons to navigate between steps can be included separately if necessary
-   Consider another approach for long forms with conditional logic (if the number of steps might change due to user input), or experiences with nonlinear progression (where steps might be completed in any order)
-   If a form or process has fewer than three sections, don't use a stepper
-   The condensed stepper style is also the mobile version of the default stepper

[component-metadata:terra-stepper]
