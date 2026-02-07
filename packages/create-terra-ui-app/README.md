# create-terra-ui-app

Create a new Terra UI app with one command.

## Usage

```bash
npx create-terra-ui-app
```

Or specify a framework:

```bash
npx create-terra-ui-app nextjs
```

## Local Development

To test this package locally before publishing:

1. Install dependencies:

    ```bash
    cd packages/create-terra-ui-app
    npm install
    ```

2. Link the package globally:

    ```bash
    npm link
    ```

3. Test it:
    ```bash
    create-terra-ui-app
    # or
    npx create-terra-ui-app
    ```

## Publishing

When ready to publish to npm:

```bash
cd packages/create-terra-ui-app
npm publish --access=public
```

After publishing, users can run:

```bash
npx create-terra-ui-app
```
