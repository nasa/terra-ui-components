---
meta:
    title: Accordion
    description:
layout: component
---

A single, accessible accordion item for FAQs and expandable content. Supports a summary (via property or slot), smooth expand/collapse, keyboard accessibility, and custom content.

## Usage

Use the `summary` property for a simple title, or the `summary` slot for custom summary content. Place the expandable content in the default slot.

```html:preview
<terra-accordion summary="Why is the rover called Perseverance?">
  Perseverance is studying Mars' habitability, seeking signs of past microbial life, collecting and storing samples of selected rock and soil, and preparing for future human missions.
</terra-accordion>
```

## Examples

### Using the `summary` property

```html:preview
<terra-accordion summary="What is Perseverance doing on Mars?">
  Perseverance is studying Mars' habitability, seeking signs of past microbial life, collecting and storing samples of selected rock and soil, and preparing for future human missions.
</terra-accordion>
```

### Using the `summary` slot

```html:preview
<terra-accordion>
  <span slot="summary">How long is the 2020 mission?</span>
  The 2020 Mars mission is planned to last at least one Mars year (about 687 Earth days).
</terra-accordion>
```

### Multiple Accordions

Accordions stack nicely when used together, with consistent spacing between them.

```html:preview
<terra-accordion summary="What is Perseverance doing on Mars?">
  Perseverance is studying Mars' habitability, seeking signs of past microbial life, collecting and storing samples of selected rock and soil, and preparing for future human missions.
</terra-accordion>

<terra-accordion summary="Why is the rover called Perseverance?">
  The name "Perseverance" was chosen through a nationwide student contest. It reflects the determination and persistence required to explore Mars and advance our understanding of the Red Planet.
</terra-accordion>

<terra-accordion summary="How long is the 2020 mission?">
  The 2020 Mars mission is planned to last at least one Mars year (about 687 Earth days), with the possibility of extension based on the rover's condition and scientific objectives.
</terra-accordion>

<terra-accordion summary="What instruments does Perseverance carry?">
  Perseverance carries seven scientific instruments, including cameras, spectrometers, a ground-penetrating radar, and the first microphone to record sounds on Mars. It also carries the Ingenuity helicopter, the first aircraft to fly on another planet.
</terra-accordion>
```

## Features

-   Large, bold summary with chevron icon
-   Smooth expand/collapse animation
-   Keyboard accessible (Enter/Space to toggle)
-   Divider lines above and below
-   Customizable summary via slot or property

[component-metadata:terra-accordion]
