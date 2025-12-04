# Next.js Boilerplate

This directory contains boilerplate-specific code for generating Next.js applications with Terra UI Components.

## Usage

To create a Next.js boilerplate, run:

```bash
npm run create-boilerplate nextjs
```

Or with a custom output directory:

```bash
npm run create-boilerplate nextjs -- --output /path/to/output
```

## What it does

1. Creates a Next.js app using `create-next-app@latest` with:

    - TypeScript
    - Tailwind CSS
    - ESLint
    - npm (not yarn)
    - No React Compiler
    - No src directory
    - Pages router (not App router)
    - No import alias

2. Installs `@nasa-terra/components`

3. Configures `_app.tsx` with:

    - Terra UI theme CSS import
    - Base path configuration for CDN assets

4. Updates `index.tsx` with example TerraButton components

## Generated Project

The boilerplate will be created as `terra-ui-nextjs-boilerplate` in the current directory (or specified output directory).
