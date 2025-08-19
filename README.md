# Terra UI Components

Intro

### Forking the Repo

Start by [forking the repo](https://github.com/nasa/terra-ui-components/fork) on GitHub, then clone it locally and install dependencies.

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/components terra-ui-components
cd terra-ui-components
npm install
```

### Developing

Once you've cloned the repo, run the following command.

```bash
npm start
```

This will spin up the dev server. After the initial build, a browser will open automatically. There is currently no hot module reloading (HMR), as browser's don't provide a way to reregister custom elements, but most changes to the source will reload the browser automatically.

### Building

To generate a production build, run the following commands.

```bash
npm run build # to build the Lit components
```

### Creating New Components

To scaffold a new component, run the following command, replacing `terra-tag-name` with the desired tag name.

```bash
npm run create terra-tag-name
```

This will generate source files, a stylesheet, a Jupyter widget, and a docs page for you. When you start the dev server, you'll find the new component in the "Components" section of the sidebar. Do a `git status` to see all the changes this command made.

### Testing Components in Jupyter Lab

Install the `uv` package manager (https://github.com/astral-sh/uv), it's a lightweight tool that makes working with virtual environments and packages much easier.

Then run the following:

-   `uv venv` - create a virtual environment (only have to do this the first time)
-   `source .venv/bin/activate` - activate it
-   `uv pip install -e ".[dev]"` - install dependencies (see pyproject.toml)
-   `npm run start:python` - spins up Jupyter lab and should open the browser for you

For an example of how to use the components in a Jupyter Notebook, open the `/notebooks/playground.ipynb` notebook in Jupyter Lab.

### Publishing to NPM and PyPI

The Lit components are available on NPM at: https://www.npmjs.com/package/@nasa-terra/components
The Python widgets are available on PyPI: https://pypi.org/project/terra_ui_components/

To build a new version and publish it, you can use NPM commands. The Python equivalents will be run automatically for you (see the "scripts" in package.json for details). You will need access to both repositories in order to publish.

```bash
# commit all your changes first
npm version patch # bump the version, you can use "major", "minor", "patch", etc.
npm publish --access=public
```

## License

Terra UI Components were created by the NASA GES DISC team, on top of the amazing library Shoelace.

Shoelace was created by [Cory LaViska](https://twitter.com/claviska) and is available under the terms of the MIT license.
