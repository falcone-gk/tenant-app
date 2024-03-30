# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## TODO

- Agregar evento para el botón del DynamicDialog en **~/pages/index.vue** dentro del método **open** se agrega la llave **emits** para agregar eventos.

Ejemplo de código

```js
// ~/page/index.vue
dialog.open(Component, {
    props: {...},
    emits: {
        onTest: () => console.log('hola')
    }
})
```

```html
<!--~/components/dialog/*-->
<template>
    <Button @click.prevent="emits('test')"><Button/>
<template />
```

```js
// ~/components/dialog/*
const emits = defineEmits(['test'])
```
