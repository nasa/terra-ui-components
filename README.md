# NASA GES DISC Components

Intro

### Forking the Repo

Start by [forking the repo](https://github.com/gesdisc/components/fork) on GitHub, then clone it locally and install dependencies.

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/components gesdisc-components
cd gesdisc-components
npm install
```

### Developing

Once you've cloned the repo, run the following command.

```bash
npm start
```

This will spin up the dev server. After the initial build, a browser will open automatically. There is currently no hot module reloading (HMR), as browser's don't provide a way to reregister custom elements, but most changes to the source will reload the browser automatically.

### Building

To generate a production build, run the following command.

```bash
npm run build
```

### Creating New Components

To scaffold a new component, run the following command, replacing `edux-tag-name` with the desired tag name.

```bash
npm run create edux-tag-name
```

This will generate a source file, a stylesheet, and a docs page for you. When you start the dev server, you'll find the new component in the "Components" section of the sidebar.

### Contributing

GES DISC Components is an open source project and contributions are encouraged! If you're interesting in contributing, please review the [contribution guidelines](CONTRIBUTING.md) first.

## License

GES DISC Components were created by the NASA GES DISC team, on top of the amazing library Shoelace.

Shoelace was created by [Cory LaViska](https://twitter.com/claviska) and is available under the terms of the MIT license.
