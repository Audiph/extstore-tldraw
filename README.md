# TLDraw Extension

An EXT Store extension for [TLDraw](https://www.tldraw.com/).

## Available Scripts

In the project directory, you can run:

### `npm run build`

Webpack will build and compile from the src folder. Generated dist folder will be used to import into EXT Store App

### `npm run build:prod`

Same process but it will use the production environment.

---

Steps to re-create this extension:

1. Clone this Repository: [TLDraw React Sample](https://github.com/Audiph/extstore-tldraw-react).
2. Follow the steps from [there](https://github.com/Audiph/extstore-tldraw-react/blob/main/README.md) on building the app.
3. You'll see that _build_ folder has been created. From there, make sure to move only the **index.html** and **static folder** to [extstore-tldraw](https://github.com/Audiph/extstore-tldraw) _src_ folder
4. Do an `npm install` to install all dependencies
5. Run `npm run build`
6. Make sure the dist folder generated from the latest script run is compressed (.zip). That will be used to import in EXT Store App.
