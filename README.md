## Tech Stack

- ⚡️ [Vue 3](https://github.com/vuejs/vue-next), [Vite 2](https://github.com/vitejs/vite)
- 🍍 [State Management via Pinia](https://pinia.esm.dev/)
- 🌍 [I18n ready](./locales)
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Rapidly build modern websites without ever leaving your HTML.
- 🔥 Use the [new `<script setup>` syntax](https://github.com/vuejs/rfcs/pull/227)
- 📥 [APIs auto importing](https://github.com/antfu/unplugin-auto-import) - use Composition API and others directly

## Feature & shortcuts

### MindMap
- Add child node   [Tab]
- Add sibling node.  [Enter]
- Delete Node    [Delete, Backspace]
- Toggle Successor Node   [Delete, Backspace]
- Enable edit   [Space, Double Click]
- Move current node   [←, ↑, ↓, →]

### Others
- Export as a Picture
- Multiple Theme
- Export as mindmap file [TODO]


## Pre-packed

### UI Frameworks

- [TailwindCSS](https://tailwindcss.com/)
  - [TailwindCSS Typography](https://github.com/tailwindlabs/tailwindcss-typography)
  - [TailwindCSS Forms](https://github.com/tailwindlabs/tailwindcss-forms)
  - [TailwindCSS Aspect Ratio](https://github.com/tailwindlabs/tailwindcss-aspect-ratio)
  - [DaisyUI](https://daisyui.com/)

### Plugins

- [Vue Router](https://github.com/vuejs/vue-router)
  - [`vite-plugin-pages`](https://github.com/hannoeru/vite-plugin-pages) - file system based routing
  - [`vite-plugin-vue-layouts`](https://github.com/JohnCampionJr/vite-plugin-vue-layouts) - layouts for pages
- [Pinia](https://pinia.esm.dev) - Intuitive, type safe, light and flexible Store for Vue using the composition api
- [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components) - components auto import
- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - Directly use Vue Composition API and others without importing
- [VueUse](https://github.com/antfu/vueuse) - collection of useful composition APIs
- [`@vueuse/head`](https://github.com/vueuse/head) - manipulate document head reactively
- [Vue I18n](https://github.com/intlify/vue-i18n-next) - Internationalization
  - [`vite-plugin-vue-i18n`](https://github.com/intlify/vite-plugin-vue-i18n) - Vite plugin for Vue I18n

### Coding Style

- Use Composition API with [`<script setup>` SFC syntax](https://github.com/vuejs/rfcs/pull/227)

### Dev tools

- [TypeScript](https://www.typescriptlang.org/)
- [VS Code Extensions](./.vscode/extensions.json)
  - [Vite](https://marketplace.visualstudio.com/items?itemName=antfu.vite) - Fire up Vite server automatically
  - [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) - Vue 3 `<script setup>` IDE support
  - [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify) - Icon inline display and autocomplete
  - [TailwindCSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) - IDE support for Tailwind CSS
  - [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally) - All in one i18n support



## Usage

### Development

Just run and visit http://localhost:3000

```bash
yarn dev
```

### Preview in Https

Just run and visit https://localhost

```bash
yarn build && yarn https-preview
```

### Build

To build the App, run

```bash
yarn build
```

And you will see the generated file in `dist` that ready to be served.

