# vue-toastfic

**vue-toastfic** is a simple and customizable toast notification library for Vue.js and Nuxt.js projects. Follow the instructions below to integrate and use it in your application.

---

## Prerequisites
Before installing **vue-toastfic**, ensure you have the following installed in your development environment:
- **Node.js** (version v18.0.0 or later)
- **Vue.js** (version v3.0.0 or later)

---

## 01. Installation

Install **vue-toastfic** using your preferred package manager:

```bash
npm install maska
#or
yarn add maska
#or
pnpm install maska
#or
bun add maska
```

---

## 02. Import the CSS file

You need to import the style file into **main.ts** or in **nuxt.config.ts** if you are in Nuxt:

```bash
#main.ts
import "vue-toastfic/style.css"

#or nuxt.config.ts
css: ["vue-toastfic/style.css"]
```

---

## 03. To Vue 3

Usage for your app Vue.js 3:

#### app.vue

```bash
<script setup lang="ts">
import { Toast, useToast } from "vue-toastfic";

function handle() {
  useToast.default("First toast in Vue.js 3");
}
</script>

<template>
  <Toast />
  <button @click="handle">Toastfic Vue.js 3</button>
</template>
```

---

## 04. To Nuxt 3

Usage for your app Nuxt.js 3:

#### plugins/toastfic.ts
```bash
import { Toast, useToast } from "vue-toastfic";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Toast", Toast);

  return {
    provide: {
      useToast,
    },
  };
});
```

#### nuxt.config.ts
```bash
export default defineNuxtConfig({
  build: {
    transpile: ["vue-toastfic"]
  }
})
```

#### app.vue
```bash
<script setup lang="ts">
const { $useToast } = useNuxtApp();

function handle() {
  $useToast.default("First toast in Nuxt.js");
}
</script>

<template>
  <NuxtPage />
  <Toast theme="dark" />

  <button @click="handle">Toastfic Nuxt.js</button>
</template>
```
